/**
 * Screen Planner Utility
 *
 * Calculates metrics for article sections and determines hero layout.
 * Uses image placement data (category, placement role) for smarter layouts.
 */

import { getPlacement } from '@/utils/focalPoint';

// =============================================================================
// Types
// =============================================================================

export interface Section {
  title?: string;
  text?: string;
  image?: string;
  imageDescription?: string;
}

export type LocalizeMode = 'strict' | 'smart' | 'paragraph';
export type LocalizeFn = (text: string, mode?: LocalizeMode) => string;

export interface SectionMetrics {
  index: number;
  section: Section;
  hasImage: boolean;
  imageAspect: number;
  imageCategory: 'portrait' | 'landscape' | 'square' | null;
  textLength: number;
  hasTitle: boolean;
  weight: number;
  placementCategory: string;
  placementRole: 'central' | 'accompanying';
}

export interface HeroData {
  title: string;
  subheader?: string;
  image?: string;
  created?: string;
}

export interface ScreenLayout {
  type: 'hero-full' | 'hero-split' | 'hero-cards';
  columns: string;
  rows: string;
  areas: string[];
  gap?: string;
}

// =============================================================================
// Constants
// =============================================================================

const WEIGHT_TEXT_LONG = 2.5;
const WEIGHT_TEXT_MEDIUM = 1.5;
const WEIGHT_TEXT_SHORT = 0.7;
const WEIGHT_TITLE = 0.3;
const WEIGHT_IMAGE_PORTRAIT = 2.0;
const WEIGHT_IMAGE_LANDSCAPE = 2.2;
const WEIGHT_IMAGE_SQUARE = 1.8;

const TEXT_LENGTH_LONG_THRESHOLD = 400;
const TEXT_LENGTH_MEDIUM_THRESHOLD = 150;

const ASPECT_PORTRAIT_THRESHOLD = 0.85;
const ASPECT_LANDSCAPE_THRESHOLD = 1.3;

// =============================================================================
// Image Preloading
// =============================================================================

export async function preloadImages(
  sections: Section[]
): Promise<Record<number, { width: number; height: number }>> {
  const dimensionsMap: Record<number, { width: number; height: number }> = {};

  const loadPromises = sections.map((section, index) => {
    const imageUrl = section.image;
    if (!imageUrl) return Promise.resolve();

    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        dimensionsMap[index] = { width: img.naturalWidth, height: img.naturalHeight };
        resolve();
      };
      img.onerror = () => resolve();
      img.src = imageUrl;
    });
  });

  await Promise.all(loadPromises);
  return dimensionsMap;
}

// =============================================================================
// Metrics Calculation
// =============================================================================

function categorizeImageAspect(
  aspectRatio: number
): 'portrait' | 'landscape' | 'square' | null {
  if (aspectRatio <= 0) return null;
  if (aspectRatio < ASPECT_PORTRAIT_THRESHOLD) return 'portrait';
  if (aspectRatio > ASPECT_LANDSCAPE_THRESHOLD) return 'landscape';
  return 'square';
}

function calculateTextWeight(textLength: number, hasTitle: boolean): number {
  let weight = 0;
  if (textLength > TEXT_LENGTH_LONG_THRESHOLD) {
    weight += WEIGHT_TEXT_LONG;
  } else if (textLength >= TEXT_LENGTH_MEDIUM_THRESHOLD) {
    weight += WEIGHT_TEXT_MEDIUM;
  } else if (textLength > 0) {
    weight += WEIGHT_TEXT_SHORT;
  }
  if (hasTitle) weight += WEIGHT_TITLE;
  return weight;
}

function calculateImageWeight(
  imageCategory: 'portrait' | 'landscape' | 'square' | null
): number {
  switch (imageCategory) {
    case 'portrait': return WEIGHT_IMAGE_PORTRAIT;
    case 'landscape': return WEIGHT_IMAGE_LANDSCAPE;
    case 'square': return WEIGHT_IMAGE_SQUARE;
    default: return 0;
  }
}

export function calculateMetrics(
  sections: Section[],
  imageDims: Record<number, { width: number; height: number }>
): SectionMetrics[] {
  return sections.map((section, index) => {
    const hasImage = Boolean(section.image);
    const hasTitle = Boolean(section.title && section.title.trim().length > 0);
    const textLength = section.text?.length ?? 0;

    let imageAspect = 0;
    let imageCategory: 'portrait' | 'landscape' | 'square' | null = null;

    if (hasImage && imageDims[index]) {
      const dims = imageDims[index];
      imageAspect = dims.width / dims.height;
      imageCategory = categorizeImageAspect(imageAspect);
    }

    const textWeight = calculateTextWeight(textLength, hasTitle);
    const imageWeight = calculateImageWeight(imageCategory);
    const placement = hasImage && section.image ? getPlacement(section.image) : null;

    return {
      index,
      section,
      hasImage,
      imageAspect,
      imageCategory,
      textLength,
      hasTitle,
      weight: textWeight + imageWeight,
      placementCategory: placement?.category || 'unknown',
      placementRole: placement?.placement || 'accompanying',
    };
  });
}

// =============================================================================
// Hero Layout
// =============================================================================

function createHeroFullLayout(): ScreenLayout {
  return { type: 'hero-full', columns: '1fr', rows: '1fr', areas: ['"hero"'], gap: '0' };
}

function createHeroSplitLayout(): ScreenLayout {
  return { type: 'hero-split', columns: '1fr 1fr', rows: '1fr', areas: ['"image content"'], gap: '0' };
}

function createHeroCardsLayout(): ScreenLayout {
  return { type: 'hero-cards', columns: '2fr 1fr', rows: '1fr', areas: ['"image content"'], gap: '1.5rem' };
}

export function determineHeroLayout(hero: HeroData): ScreenLayout {
  const hasImage = Boolean(hero.image);
  const hasSubheader = Boolean(hero.subheader && hero.subheader.length > 0);
  const titleLength = hero.title?.length || 0;

  if (!hasImage) return createHeroCardsLayout();

  if (titleLength > 60 || (hasSubheader && (hero.subheader?.length ?? 0) > 100)) {
    return createHeroSplitLayout();
  }

  const { category } = getPlacement(hero.image!);

  switch (category) {
    case 'portrait': return createHeroCardsLayout();
    case 'group-photo': return createHeroSplitLayout();
    case 'building':
    case 'landscape': return createHeroFullLayout();
    default: return createHeroFullLayout();
  }
}
