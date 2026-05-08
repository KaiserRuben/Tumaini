/**
 * Image placement lookup — vision-model-generated metadata for smart cropping.
 *
 * Each image has:
 * - Three bboxes [x1, y1, x2, y2] on a 0–1000 scale:
 *     tight:   smallest area around the main subject (thumbnails, cards)
 *     subject: all important content (hero banners)
 *     safe:    must stay visible at any crop (full-bleed backgrounds)
 * - category:    "portrait", "group-photo", "building", "landscape", etc.
 * - description: one-sentence summary
 * - placement:   "central" (deserves prominent display) or "accompanying" (supports text)
 */

import placementData from '../data/image-placement.json'

export type Bbox = [number, number, number, number]
export type BboxLevel = 'tight' | 'subject' | 'safe'

export interface ImageDescription {
  de: string
  en: string
  nl: string
}

export interface ImagePlacement {
  tight: Bbox
  subject: Bbox
  safe: Bbox
  category: string
  description: ImageDescription
  placement: 'central' | 'accompanying'
}

const lookup = placementData as unknown as Record<string, ImagePlacement>

const DEFAULTS: ImagePlacement = {
  tight: [350, 250, 650, 750],
  subject: [0, 100, 1000, 900],
  safe: [200, 150, 800, 850],
  category: 'unknown',
  description: { de: '', en: '', nl: '' },
  placement: 'accompanying',
}

/**
 * Extract filename from a full image URL.
 */
function extractKey(url: string): string {
  try {
    return new URL(url).pathname.split('/').pop() || url
  } catch {
    return url.split('/').pop() || url
  }
}

/** Get full placement data for an image. */
export function getPlacement(imageUrl: string): ImagePlacement {
  if (!imageUrl) return DEFAULTS
  return (lookup[extractKey(imageUrl)] as ImagePlacement) ?? DEFAULTS
}

/** Get a specific bbox level. */
export function getBbox(imageUrl: string, level: BboxLevel = 'subject'): Bbox {
  return getPlacement(imageUrl)[level]
}

/**
 * CSS `object-position` centered on a bbox level.
 *
 *   <img :style="{ objectPosition: getObjectPosition(url) }" />
 *   <img :style="{ objectPosition: getObjectPosition(url, 'tight') }" />
 */
export function getObjectPosition(imageUrl: string, level: BboxLevel = 'subject'): string {
  const [x1, y1, x2, y2] = getBbox(imageUrl, level)
  const cx = ((x1 + x2) / 2) / 10
  const cy = ((y1 + y2) / 2) / 10
  return `${cx.toFixed(1)}% ${cy.toFixed(1)}%`
}

/** CSS `background-position` — same as object-position, for bg-image elements. */
export function getBackgroundPosition(imageUrl: string, level: BboxLevel = 'subject'): string {
  return getObjectPosition(imageUrl, level)
}

/** Whether the image has real placement data (vs defaults). */
export function hasPlacement(imageUrl: string): boolean {
  if (!imageUrl) return false
  return extractKey(imageUrl) in lookup
}

/** Get the image category (e.g. "portrait", "group-photo", "building"). */
export function getCategory(imageUrl: string): string {
  return getPlacement(imageUrl).category
}

/** Get trilingual description for an image. */
export function getDescription(imageUrl: string): ImageDescription {
  return getPlacement(imageUrl).description
}

/** Get placement role: "central" or "accompanying". */
export function getPlacementRole(imageUrl: string): 'central' | 'accompanying' {
  return getPlacement(imageUrl).placement
}
