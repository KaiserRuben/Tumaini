#!/usr/bin/env python3
"""
Generate image-placement lookup table for all article/section images.

Queries local MongoDB, resolves each image to its article/section context,
sends image + context to Ollama qwen3.5 for bounding boxes, category,
trilingual descriptions, and placement recommendation.

Usage:
    python3 scripts/generate-focal-points.py [--model qwen3.5] [--force]

Requires: pip install ollama pymongo pydantic
Requires: Local MongoDB on localhost:27017 (docker compose up -d mongo)
Requires: Ollama running with qwen3.5
"""

import argparse
import json
import os
import sys
import tempfile
import urllib.parse
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

from ollama import chat
from pydantic import BaseModel
from pymongo import MongoClient

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

MONGO_URI = "mongodb://localhost:27017/Tumaini"
OUTPUT_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "image-placement.json"


class Description(BaseModel):
    de: str
    en: str
    nl: str


class ImagePlacement(BaseModel):
    tight: list[int]      # [x1, y1, x2, y2]
    subject: list[int]    # [x1, y1, x2, y2]
    safe: list[int]       # [x1, y1, x2, y2]
    category: str
    description: Description
    placement: str


DEFAULTS = {
    "tight": [350, 250, 650, 750],
    "subject": [0, 100, 1000, 900],
    "safe": [200, 150, 800, 850],
    "category": "unknown",
    "description": {"de": "", "en": "", "nl": ""},
    "placement": "accompanying",
}


def build_prompt(context: str) -> str:
    return f"""\
I am building a responsive website that crops images into hero banners, \
cards, and thumbnails. I need to know which areas of this image contain \
the important content so I can crop intelligently.

Context about this image (from the article it belongs to):
{context}

Give me:
- 3 bounding boxes on a 0-1000 scale (top-left is 0,0):
  - tight: smallest area around the single most important subject (for thumbnails)
  - subject: area containing all important subjects (for hero banners)
  - safe: area that must stay visible at any crop (for full-bleed backgrounds)
- category: a short label like "portrait", "group-photo", "building", \
"landscape", "event", "object"
- description: a short, evocative one-sentence description of the image \
in three languages (de, en, nl). Use the context to write something \
meaningful, not just what you see.
- placement: either "central" (image is the main content, deserves \
prominent display) or "accompanying" (image supports text, works as \
side element)
/no_think"""

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def extract_key(url: str) -> str | None:
    """Extract the filename from a full image URL to use as lookup key."""
    if not url:
        return None
    parsed = urlparse(url)
    filename = os.path.basename(parsed.path)
    return filename if filename else None


def collect_images_with_context(db) -> dict[str, dict]:
    """
    Gather all unique image URLs with their article/section context.
    Returns {url: {key, context_text}}.
    """
    images: dict[str, dict] = {}

    for article in db.articles.find({}):
        article_title = article.get("title", "")
        article_sub = article.get("subheader", "")
        article_ctx = f"Article: {article_title}"
        if article_sub:
            article_ctx += f"\nSubheader: {article_sub}"

        # Article hero image
        img = article.get("image")
        if img and img != "null":
            key = extract_key(img)
            if key:
                images[img] = {
                    "key": key,
                    "context": f"{article_ctx}\nThis is the article's hero/main image.",
                }

        # Section images
        section_ids = article.get("content", [])
        sections = list(db.sections.find({"_id": {"$in": section_ids}}))
        for section in sections:
            s_img = section.get("image")
            if not s_img or s_img == "null":
                continue
            key = extract_key(s_img)
            if not key:
                continue

            s_title = section.get("title", "")
            s_text = (section.get("text", "") or "")[:200]
            section_ctx = f"{article_ctx}\nSection: {s_title}"
            if s_text:
                section_ctx += f"\nText excerpt: {s_text}"

            # Keep the richest context if image appears in multiple places
            if s_img not in images or len(section_ctx) > len(images[s_img].get("context", "")):
                images[s_img] = {"key": key, "context": section_ctx}

    return images


def download_image(url: str) -> str | None:
    """Download image to a temp file, return the path."""
    try:
        parsed = urlparse(url)
        encoded_path = urllib.parse.quote(parsed.path, safe="/")
        safe_url = parsed._replace(path=encoded_path).geturl()
        ext = os.path.splitext(parsed.path)[1] or ".webp"
        tmp = tempfile.NamedTemporaryFile(suffix=ext, delete=False)
        urllib.request.urlretrieve(safe_url, tmp.name)
        return tmp.name
    except Exception as e:
        print(f"  ✗ Download failed: {e}", file=sys.stderr)
        return None


def validate_bbox(bbox: list[int]) -> bool:
    """Check that a bbox is [x1, y1, x2, y2] within 0-1000."""
    return (
        len(bbox) == 4
        and all(0 <= v <= 1000 for v in bbox)
        and bbox[0] < bbox[2]
        and bbox[1] < bbox[3]
    )


def ask_placement(image_path: str, context: str, model: str) -> dict:
    """Send image + context to Ollama and get placement data."""
    try:
        response = chat(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": build_prompt(context),
                    "images": [image_path],
                }
            ],
            format=ImagePlacement.model_json_schema(),
        )
        placement = ImagePlacement.model_validate_json(response.message.content)
        result = placement.model_dump()

        for key in ("tight", "subject", "safe"):
            if not validate_bbox(result[key]):
                print(f"  ⚠ Invalid {key} bbox {result[key]}, using default", file=sys.stderr)
                result[key] = DEFAULTS[key]

        return result
    except Exception as e:
        print(f"  ✗ Ollama error: {e}", file=sys.stderr)
        return dict(DEFAULTS)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(description="Generate image-placement lookup table")
    parser.add_argument("--model", default="qwen3.5", help="Ollama model name (default: qwen3.5)")
    parser.add_argument("--force", action="store_true", help="Re-generate all entries, even existing ones")
    args = parser.parse_args()

    # Load existing lookup (for incremental updates)
    existing: dict = {}
    if OUTPUT_PATH.exists() and not args.force:
        with open(OUTPUT_PATH) as f:
            existing = json.load(f)
        print(f"Loaded {len(existing)} existing entries from {OUTPUT_PATH}")

    # Connect to MongoDB
    client = MongoClient(MONGO_URI)
    db = client.get_default_database()

    images = collect_images_with_context(db)
    print(f"Found {len(images)} unique images in database")

    # Filter to only new images
    new_items = []
    for url, info in sorted(images.items(), key=lambda x: x[1]["key"]):
        if info["key"] not in existing:
            new_items.append((url, info))

    if not new_items:
        print("All images already have placements. Use --force to regenerate.")
        return

    print(f"Processing {len(new_items)} new images with model '{args.model}'...\n")

    lookup = dict(existing)

    for i, (url, info) in enumerate(new_items, 1):
        key = info["key"]
        print(f"[{i}/{len(new_items)}] {key}")

        tmp_path = download_image(url)
        if not tmp_path:
            lookup[key] = dict(DEFAULTS)
            continue

        try:
            placement = ask_placement(tmp_path, info["context"], args.model)
            lookup[key] = placement
            print(f"  → {placement['category']} / {placement['placement']}")
            print(f"    en: {placement['description']['en'][:80]}")
            print(f"    tight={placement['tight']} subject={placement['subject']} safe={placement['safe']}")
        finally:
            os.unlink(tmp_path)

            # Write output
            OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
            with open(OUTPUT_PATH, "w") as f:
                json.dump(lookup, f, indent=2, sort_keys=True)

    print(f"\nWrote {len(lookup)} entries to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
