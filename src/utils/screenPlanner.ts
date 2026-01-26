/**
 * Screen Planner Utility
 *
 * Handles smart planning of article content into full-screen "screens"
 * based on content analysis and optimal layout determination.
 */

// =============================================================================
// Types
// =============================================================================

export interface Section {
  title?: string;
  text?: string;
  image?: string;
  imageDescription?: string;
}

export interface SectionMetrics {
  index: number;
  section: Section;
  hasImage: boolean;
  imageAspect: number;
  imageCategory: 'portrait' | 'landscape' | 'square' | null;
  textLength: number;
  hasTitle: boolean;
  weight: number;
}

export interface ScreenCell {
  id: string;
  type: 'image' | 'text' | 'caption' | 'combined' | 'filler' | 'hero-image' | 'hero-content';
  section: Section;
  gridArea: string;
}

export interface HeroData {
  title: string;
  subheader?: string;
  image?: string;
  created?: string;
}

export interface ScreenLayout {
  type:
    | 'showcase'
    | 'cinematic'
    | 'split-h'
    | 'split-v'
    | 'gallery'
    | 'mosaic'
    | 'text-full'
    // Merge templates
    | 'duo-images'
    | 'image-split-text'
    | 'micro-gallery'
    | 'quad-mix'
    // Hero templates
    | 'hero-full'
    | 'hero-split'
    | 'hero-cards';
  columns: string;
  rows: string;
  areas: string[];
  gap?: string;
}

export interface MergeGroup {
  type: 'duo-images' | 'image-split-text' | 'micro-gallery' | 'quad-mix';
  indices: number[];
  metrics: SectionMetrics[];
}

export interface PlannedScreen {
  id: number;
  sections: SectionMetrics[];
  layout: ScreenLayout;
  cells: ScreenCell[];
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

const MAX_SECTIONS_PER_SCREEN = 3;

// =============================================================================
// Image Preloading
// =============================================================================

/**
 * Preloads all images from sections and returns their dimensions.
 * @param sections - Array of content sections
 * @returns Promise resolving to a map of section index to image dimensions
 */
export async function preloadImages(
  sections: Section[]
): Promise<Record<number, { width: number; height: number }>> {
  const dimensionsMap: Record<number, { width: number; height: number }> = {};

  const loadPromises = sections.map((section, index) => {
    const imageUrl = section.image;
    if (!imageUrl) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      const img = new Image();

      img.onload = () => {
        dimensionsMap[index] = {
          width: img.naturalWidth,
          height: img.naturalHeight,
        };
        resolve();
      };

      img.onerror = () => {
        // Skip failed images, don't add to dimensions map
        resolve();
      };

      img.src = imageUrl;
    });
  });

  await Promise.all(loadPromises);

  return dimensionsMap;
}

// =============================================================================
// Metrics Calculation
// =============================================================================

/**
 * Determines the image category based on aspect ratio.
 * @param aspectRatio - Width divided by height
 * @returns Image category or null if no valid aspect ratio
 */
function categorizeImageAspect(
  aspectRatio: number
): 'portrait' | 'landscape' | 'square' | null {
  if (aspectRatio <= 0) {
    return null;
  }

  if (aspectRatio < ASPECT_PORTRAIT_THRESHOLD) {
    return 'portrait';
  }

  if (aspectRatio > ASPECT_LANDSCAPE_THRESHOLD) {
    return 'landscape';
  }

  return 'square';
}

/**
 * Calculates the weight contribution from text content.
 * @param textLength - Length of text in characters
 * @param hasTitle - Whether the section has a title
 * @returns Calculated text weight
 */
function calculateTextWeight(textLength: number, hasTitle: boolean): number {
  let weight = 0;

  if (textLength > TEXT_LENGTH_LONG_THRESHOLD) {
    weight += WEIGHT_TEXT_LONG;
  } else if (textLength >= TEXT_LENGTH_MEDIUM_THRESHOLD) {
    weight += WEIGHT_TEXT_MEDIUM;
  } else if (textLength > 0) {
    weight += WEIGHT_TEXT_SHORT;
  }

  if (hasTitle) {
    weight += WEIGHT_TITLE;
  }

  return weight;
}

/**
 * Calculates the weight contribution from an image.
 * @param imageCategory - The category of the image
 * @returns Calculated image weight
 */
function calculateImageWeight(
  imageCategory: 'portrait' | 'landscape' | 'square' | null
): number {
  switch (imageCategory) {
    case 'portrait':
      return WEIGHT_IMAGE_PORTRAIT;
    case 'landscape':
      return WEIGHT_IMAGE_LANDSCAPE;
    case 'square':
      return WEIGHT_IMAGE_SQUARE;
    default:
      return 0;
  }
}

/**
 * Calculate weight and metrics for each section.
 * @param sections - Array of content sections
 * @param imageDims - Map of section index to image dimensions
 * @returns Array of section metrics
 */
export function calculateMetrics(
  sections: Section[],
  imageDims: Record<number, { width: number; height: number }>
): SectionMetrics[] {
  return sections.map((section, index) => {
    const hasImage = Boolean(section.image);
    const hasTitle = Boolean(section.title && section.title.trim().length > 0);
    const textLength = section.text?.length ?? 0;

    // Calculate image aspect ratio and category
    let imageAspect = 0;
    let imageCategory: 'portrait' | 'landscape' | 'square' | null = null;

    if (hasImage && imageDims[index]) {
      const dims = imageDims[index];
      imageAspect = dims.width / dims.height;
      imageCategory = categorizeImageAspect(imageAspect);
    }

    // Calculate total weight
    const textWeight = calculateTextWeight(textLength, hasTitle);
    const imageWeight = calculateImageWeight(imageCategory);
    const totalWeight = textWeight + imageWeight;

    return {
      index,
      section,
      hasImage,
      imageAspect,
      imageCategory,
      textLength,
      hasTitle,
      weight: totalWeight,
    };
  });
}

// =============================================================================
// Layout Determination
// =============================================================================

/**
 * Creates a text-full layout for text-only content.
 * @returns ScreenLayout for full-screen text
 */
function createTextFullLayout(): ScreenLayout {
  return {
    type: 'text-full',
    columns: '1fr',
    rows: '1fr',
    areas: ['"content"'],
    gap: '0',
  };
}

/**
 * Creates a showcase layout for prominent image display.
 * @returns ScreenLayout for showcase
 */
function createShowcaseLayout(): ScreenLayout {
  return {
    type: 'showcase',
    columns: '1fr',
    rows: '1fr',
    areas: ['"image"'],
    gap: '0',
  };
}

/**
 * Creates a horizontal split layout.
 * @param leftRatio - Fraction for left column (e.g., 40 for 40%)
 * @param rightRatio - Fraction for right column (e.g., 60 for 60%)
 * @returns ScreenLayout for horizontal split
 */
function createSplitHLayout(leftRatio = 50, rightRatio = 50): ScreenLayout {
  return {
    type: 'split-h',
    columns: `${leftRatio}fr ${rightRatio}fr`,
    rows: '1fr',
    areas: ['"left right"'],
    gap: '1rem',
  };
}

/**
 * Creates a cinematic layout with image on top.
 * @returns ScreenLayout for cinematic view
 */
function createCinematicLayout(): ScreenLayout {
  return {
    type: 'cinematic',
    columns: '1fr',
    rows: '60fr 40fr',
    areas: ['"image"', '"text"'],
    gap: '1rem',
  };
}

/**
 * Creates a vertical split layout.
 * @returns ScreenLayout for vertical split
 */
function createSplitVLayout(): ScreenLayout {
  return {
    type: 'split-v',
    columns: '1fr',
    rows: '1fr 1fr',
    areas: ['"top"', '"bottom"'],
    gap: '1rem',
  };
}

/**
 * Creates a gallery layout for 3 items.
 * @returns ScreenLayout for gallery
 */
function createGalleryLayout(): ScreenLayout {
  return {
    type: 'gallery',
    columns: '1fr 1fr 1fr',
    rows: '1fr',
    areas: ['"item1 item2 item3"'],
    gap: '1rem',
  };
}

/**
 * Creates a mosaic layout for 3 items with one featured.
 * @returns ScreenLayout for mosaic
 */
function createMosaicLayout(): ScreenLayout {
  return {
    type: 'mosaic',
    columns: '2fr 1fr',
    rows: '1fr 1fr',
    areas: ['"featured side1"', '"featured side2"'],
    gap: '1rem',
  };
}

/**
 * Creates a duo-images layout for 2 images with captions.
 * @returns ScreenLayout for duo-images
 */
function createDuoImagesLayout(): ScreenLayout {
  return {
    type: 'duo-images',
    columns: '1fr 1fr',
    rows: '3fr 1fr',
    areas: ['"img1 img2"', '"cap1 cap2"'],
    gap: '1rem',
  };
}

/**
 * Creates an image-split-text layout with image on left, title+body stacked on right.
 * @returns ScreenLayout for image-split-text
 */
function createImageSplitTextLayout(): ScreenLayout {
  return {
    type: 'image-split-text',
    columns: '1fr 1fr',
    rows: '1fr 1fr',
    areas: ['"image title"', '"image body"'],
    gap: '1rem',
  };
}

/**
 * Creates a micro-gallery layout for 4 images in 2x2 grid.
 * @returns ScreenLayout for micro-gallery
 */
function createMicroGalleryLayout(): ScreenLayout {
  return {
    type: 'micro-gallery',
    columns: '1fr 1fr',
    rows: '1fr 1fr',
    areas: ['"img1 img2"', '"img3 img4"'],
    gap: '0.75rem',
  };
}

/**
 * Creates a quad-mix layout for 2x2 flexible content.
 * @returns ScreenLayout for quad-mix
 */
function createQuadMixLayout(): ScreenLayout {
  return {
    type: 'quad-mix',
    columns: '1fr 1fr',
    rows: '1fr 1fr',
    areas: ['"a b"', '"c d"'],
    gap: '1rem',
  };
}

// =============================================================================
// Hero Layout Creators
// =============================================================================

/**
 * Creates a hero-full layout - full bleed background with centered content overlay.
 * @returns ScreenLayout for hero-full
 */
function createHeroFullLayout(): ScreenLayout {
  return {
    type: 'hero-full',
    columns: '1fr',
    rows: '1fr',
    areas: ['"hero"'],
    gap: '0',
  };
}

/**
 * Creates a hero-split layout - image on left, content on right.
 * @returns ScreenLayout for hero-split
 */
function createHeroSplitLayout(): ScreenLayout {
  return {
    type: 'hero-split',
    columns: '1fr 1fr',
    rows: '1fr',
    areas: ['"image content"'],
    gap: '0',
  };
}

/**
 * Creates a hero-cards layout - image card and content card side by side.
 * @returns ScreenLayout for hero-cards
 */
function createHeroCardsLayout(): ScreenLayout {
  return {
    type: 'hero-cards',
    columns: '2fr 1fr',
    rows: '1fr',
    areas: ['"image content"'],
    gap: '1.5rem',
  };
}

/**
 * Determines the optimal hero layout based on content.
 * @param hero - Hero data with title, subheader, image
 * @returns Optimal hero layout
 */
export function determineHeroLayout(hero: HeroData): ScreenLayout {
  const hasImage = Boolean(hero.image);
  const hasSubheader = Boolean(hero.subheader && hero.subheader.length > 0);
  const titleLength = hero.title?.length || 0;

  // No image - use split with placeholder or cards
  if (!hasImage) {
    return createHeroCardsLayout();
  }

  // Long title or subheader - use split for more text space
  if (titleLength > 60 || (hasSubheader && (hero.subheader?.length ?? 0) > 100)) {
    return createHeroSplitLayout();
  }

  // Default - full bleed hero
  return createHeroFullLayout();
}

/**
 * Determines the optimal grid layout based on content analysis.
 * @param items - Array of section metrics to layout
 * @returns Optimal screen layout configuration
 */
export function determineLayout(items: SectionMetrics[]): ScreenLayout {
  const itemCount = items.length;

  if (itemCount === 0) {
    return createTextFullLayout();
  }

  if (itemCount === 1) {
    const item = items[0];

    // Text-only content
    if (!item.hasImage) {
      return createTextFullLayout();
    }

    // Short text with image - showcase (full bleed)
    if (item.textLength < TEXT_LENGTH_MEDIUM_THRESHOLD) {
      return createShowcaseLayout();
    }

    // Portrait image - horizontal split (40/60)
    if (item.imageCategory === 'portrait') {
      return createSplitHLayout(40, 60);
    }

    // Landscape image - cinematic layout
    if (item.imageCategory === 'landscape') {
      return createCinematicLayout();
    }

    // Square image - default to split-h
    return createSplitHLayout(50, 50);
  }

  if (itemCount === 2) {
    const [first, second] = items;
    const bothHaveImages = first.hasImage && second.hasImage;

    if (bothHaveImages) {
      // Both portrait images - horizontal split
      if (
        first.imageCategory === 'portrait' &&
        second.imageCategory === 'portrait'
      ) {
        return createSplitHLayout(50, 50);
      }

      // Both landscape images - vertical split
      if (
        first.imageCategory === 'landscape' &&
        second.imageCategory === 'landscape'
      ) {
        return createSplitVLayout();
      }
    }

    // Default for 2 items - horizontal split
    return createSplitHLayout(50, 50);
  }

  // 3 items
  if (itemCount === 3) {
    const hasLandscape = items.some((item) => item.imageCategory === 'landscape');
    const allHaveImages = items.every((item) => item.hasImage);

    // If there's a landscape image, use mosaic with it as featured
    if (hasLandscape && allHaveImages) {
      return createMosaicLayout();
    }

    // Default to gallery for 3 items
    return createGalleryLayout();
  }

  // Fallback for unexpected item counts
  return createGalleryLayout();
}

// =============================================================================
// Cell Generation
// =============================================================================

/**
 * Generates cells for text-full layout.
 * @param items - Section metrics
 * @returns Array of screen cells
 */
function generateTextFullCells(items: SectionMetrics[]): ScreenCell[] {
  if (items.length === 0) return [];

  return [
    {
      id: `cell-${items[0].index}-text`,
      type: 'text',
      section: items[0].section,
      gridArea: 'content',
    },
  ];
}

/**
 * Generates cells for showcase layout.
 * @param items - Section metrics
 * @returns Array of screen cells
 */
function generateShowcaseCells(items: SectionMetrics[]): ScreenCell[] {
  if (items.length === 0) return [];

  return [
    {
      id: `cell-${items[0].index}-image`,
      type: 'image',
      section: items[0].section,
      gridArea: 'image',
    },
  ];
}

/**
 * Generates cells for split-h layout.
 * @param items - Section metrics
 * @returns Array of screen cells
 */
function generateSplitHCells(items: SectionMetrics[]): ScreenCell[] {
  const cells: ScreenCell[] = [];

  if (items.length >= 1) {
    const firstItem = items[0];
    if (firstItem.hasImage) {
      cells.push({
        id: `cell-${firstItem.index}-image`,
        type: 'image',
        section: firstItem.section,
        gridArea: 'left',
      });
    } else {
      cells.push({
        id: `cell-${firstItem.index}-text`,
        type: 'text',
        section: firstItem.section,
        gridArea: 'left',
      });
    }
  }

  if (items.length >= 2) {
    const secondItem = items[1];
    cells.push({
      id: `cell-${secondItem.index}-content`,
      type: secondItem.hasImage ? 'combined' : 'text',
      section: secondItem.section,
      gridArea: 'right',
    });
  } else if (items.length === 1 && items[0].textLength > 0) {
    // Single item with text - put text on right
    cells.push({
      id: `cell-${items[0].index}-text`,
      type: 'text',
      section: items[0].section,
      gridArea: 'right',
    });
  }

  return cells;
}

/**
 * Generates cells for cinematic layout.
 * @param items - Section metrics
 * @returns Array of screen cells
 */
function generateCinematicCells(items: SectionMetrics[]): ScreenCell[] {
  if (items.length === 0) return [];

  const item = items[0];
  const cells: ScreenCell[] = [];

  if (item.hasImage) {
    cells.push({
      id: `cell-${item.index}-image`,
      type: 'image',
      section: item.section,
      gridArea: 'image',
    });
  }

  if (item.textLength > 0 || item.hasTitle) {
    cells.push({
      id: `cell-${item.index}-text`,
      type: 'text',
      section: item.section,
      gridArea: 'text',
    });
  }

  return cells;
}

/**
 * Generates cells for split-v layout.
 * @param items - Section metrics
 * @returns Array of screen cells
 */
function generateSplitVCells(items: SectionMetrics[]): ScreenCell[] {
  const cells: ScreenCell[] = [];

  if (items.length >= 1) {
    cells.push({
      id: `cell-${items[0].index}-content`,
      type: items[0].hasImage ? 'combined' : 'text',
      section: items[0].section,
      gridArea: 'top',
    });
  }

  if (items.length >= 2) {
    cells.push({
      id: `cell-${items[1].index}-content`,
      type: items[1].hasImage ? 'combined' : 'text',
      section: items[1].section,
      gridArea: 'bottom',
    });
  }

  return cells;
}

/**
 * Generates cells for gallery layout.
 * @param items - Section metrics
 * @returns Array of screen cells
 */
function generateGalleryCells(items: SectionMetrics[]): ScreenCell[] {
  const gridAreas = ['item1', 'item2', 'item3'];

  return items.slice(0, 3).map((item, idx) => ({
    id: `cell-${item.index}-content`,
    type: item.hasImage ? 'combined' : 'text',
    section: item.section,
    gridArea: gridAreas[idx],
  }));
}

/**
 * Generates cells for mosaic layout.
 * @param items - Section metrics
 * @returns Array of screen cells
 */
function generateMosaicCells(items: SectionMetrics[]): ScreenCell[] {
  if (items.length === 0) return [];

  // Find the landscape image for featured spot
  const landscapeIndex = items.findIndex(
    (item) => item.imageCategory === 'landscape'
  );
  const featuredItem = landscapeIndex >= 0 ? items[landscapeIndex] : items[0];
  const sideItems = items.filter((item) => item !== featuredItem).slice(0, 2);

  const cells: ScreenCell[] = [
    {
      id: `cell-${featuredItem.index}-featured`,
      type: 'image',
      section: featuredItem.section,
      gridArea: 'featured',
    },
  ];

  if (sideItems.length >= 1) {
    cells.push({
      id: `cell-${sideItems[0].index}-side`,
      type: sideItems[0].hasImage ? 'combined' : 'text',
      section: sideItems[0].section,
      gridArea: 'side1',
    });
  }

  if (sideItems.length >= 2) {
    cells.push({
      id: `cell-${sideItems[1].index}-side`,
      type: sideItems[1].hasImage ? 'combined' : 'text',
      section: sideItems[1].section,
      gridArea: 'side2',
    });
  }

  return cells;
}

/**
 * Generates cells for duo-images layout.
 * @param items - Section metrics (expects 2 items with images)
 * @returns Array of screen cells
 */
function generateDuoImagesCells(items: SectionMetrics[]): ScreenCell[] {
  const cells: ScreenCell[] = [];

  if (items.length >= 1) {
    cells.push({
      id: `cell-${items[0].index}-img`,
      type: 'image',
      section: items[0].section,
      gridArea: 'img1',
    });
    cells.push({
      id: `cell-${items[0].index}-cap`,
      type: 'caption',
      section: items[0].section,
      gridArea: 'cap1',
    });
  }

  if (items.length >= 2) {
    cells.push({
      id: `cell-${items[1].index}-img`,
      type: 'image',
      section: items[1].section,
      gridArea: 'img2',
    });
    cells.push({
      id: `cell-${items[1].index}-cap`,
      type: 'caption',
      section: items[1].section,
      gridArea: 'cap2',
    });
  }

  return cells;
}

/**
 * Generates cells for image-split-text layout.
 * @param items - Section metrics (expects image item followed by text item)
 * @returns Array of screen cells
 */
function generateImageSplitTextCells(items: SectionMetrics[]): ScreenCell[] {
  const cells: ScreenCell[] = [];

  // Find the image item and text item
  const imageItem = items.find((item) => item.hasImage);
  const textItem = items.find((item) => !item.hasImage && item.textLength > 0);

  if (imageItem) {
    cells.push({
      id: `cell-${imageItem.index}-image`,
      type: 'image',
      section: imageItem.section,
      gridArea: 'image',
    });
  }

  if (textItem) {
    // Split into title and body areas
    cells.push({
      id: `cell-${textItem.index}-title`,
      type: 'text',
      section: { title: textItem.section.title },
      gridArea: 'title',
    });
    cells.push({
      id: `cell-${textItem.index}-body`,
      type: 'text',
      section: { text: textItem.section.text },
      gridArea: 'body',
    });
  } else if (imageItem) {
    // Use image's caption/description as text
    cells.push({
      id: `cell-${imageItem.index}-title`,
      type: 'text',
      section: { title: imageItem.section.title },
      gridArea: 'title',
    });
    cells.push({
      id: `cell-${imageItem.index}-body`,
      type: 'text',
      section: { text: imageItem.section.imageDescription || imageItem.section.text },
      gridArea: 'body',
    });
  }

  return cells;
}

/**
 * Generates cells for micro-gallery layout.
 * @param items - Section metrics (expects 3-4 items with images)
 * @returns Array of screen cells
 */
function generateMicroGalleryCells(items: SectionMetrics[]): ScreenCell[] {
  const gridAreas = ['img1', 'img2', 'img3', 'img4'];

  return items.slice(0, 4).map((item, idx) => ({
    id: `cell-${item.index}-img`,
    type: 'image' as const,
    section: item.section,
    gridArea: gridAreas[idx],
  }));
}

/**
 * Generates cells for quad-mix layout.
 * @param items - Section metrics (expects 3-4 items of any type)
 * @returns Array of screen cells
 */
function generateQuadMixCells(items: SectionMetrics[]): ScreenCell[] {
  const gridAreas = ['a', 'b', 'c', 'd'];

  return items.slice(0, 4).map((item, idx) => ({
    id: `cell-${item.index}-content`,
    type: item.hasImage ? 'combined' as const : 'text' as const,
    section: item.section,
    gridArea: gridAreas[idx],
  }));
}

// =============================================================================
// Hero Cell Generators
// =============================================================================

/**
 * Generates cells for hero-full layout.
 * @param hero - Hero data
 * @returns Array of screen cells for hero
 */
export function generateHeroFullCells(hero: HeroData): ScreenCell[] {
  return [
    {
      id: 'hero-main',
      type: 'hero-content',
      section: {
        title: hero.title,
        text: hero.subheader,
        image: hero.image,
      },
      gridArea: 'hero',
    },
  ];
}

/**
 * Generates cells for hero-split layout.
 * @param hero - Hero data
 * @returns Array of screen cells for hero
 */
export function generateHeroSplitCells(hero: HeroData): ScreenCell[] {
  return [
    {
      id: 'hero-image',
      type: 'hero-image',
      section: { image: hero.image },
      gridArea: 'image',
    },
    {
      id: 'hero-content',
      type: 'hero-content',
      section: {
        title: hero.title,
        text: hero.subheader,
      },
      gridArea: 'content',
    },
  ];
}

/**
 * Generates cells for hero-cards layout.
 * @param hero - Hero data
 * @returns Array of screen cells for hero
 */
export function generateHeroCardsCells(hero: HeroData): ScreenCell[] {
  const cells: ScreenCell[] = [];

  if (hero.image) {
    cells.push({
      id: 'hero-image',
      type: 'hero-image',
      section: { image: hero.image },
      gridArea: 'image',
    });
  }

  cells.push({
    id: 'hero-content',
    type: 'hero-content',
    section: {
      title: hero.title,
      text: hero.subheader,
    },
    gridArea: 'content',
  });

  return cells;
}

/**
 * Generates hero cells based on layout type.
 * @param hero - Hero data
 * @param layout - The hero layout configuration
 * @returns Array of screen cells for hero
 */
export function generateHeroCells(hero: HeroData, layout: ScreenLayout): ScreenCell[] {
  switch (layout.type) {
    case 'hero-full':
      return generateHeroFullCells(hero);
    case 'hero-split':
      return generateHeroSplitCells(hero);
    case 'hero-cards':
      return generateHeroCardsCells(hero);
    default:
      return generateHeroFullCells(hero);
  }
}

/**
 * Creates a planned screen for the hero.
 * @param hero - Hero data
 * @returns PlannedScreen for hero
 */
export function planHeroScreen(hero: HeroData): PlannedScreen {
  const layout = determineHeroLayout(hero);
  const cells = generateHeroCells(hero, layout);

  return {
    id: 0,
    sections: [],
    layout,
    cells,
  };
}

// =============================================================================
// Filler Injection
// =============================================================================

/**
 * Extracts all unique grid area names from a layout's areas definition.
 * @param layout - The screen layout configuration
 * @returns Array of grid area names
 */
function extractGridAreas(layout: ScreenLayout): string[] {
  const areaSet = new Set<string>();

  for (const areaRow of layout.areas) {
    // Parse area names from format like '"img1 img2"' or '"featured side1"'
    const cleaned = areaRow.replace(/['"]/g, '').trim();
    const names = cleaned.split(/\s+/);
    names.forEach((name) => {
      if (name && name !== '.') {
        areaSet.add(name);
      }
    });
  }

  return Array.from(areaSet);
}

/**
 * Creates a filler cell for an empty grid area.
 * @param area - The grid area name
 * @returns A filler screen cell
 */
function createFillerCell(area: string): ScreenCell {
  return {
    id: `filler-${area}`,
    type: 'filler',
    section: {} as Section,
    gridArea: area,
  };
}

/**
 * Injects filler cells for any grid areas not covered by content cells.
 * @param cells - Existing content cells
 * @param layout - The screen layout configuration
 * @returns Array of cells with fillers added for empty areas
 */
function injectFillers(cells: ScreenCell[], layout: ScreenLayout): ScreenCell[] {
  const expectedAreas = extractGridAreas(layout);
  const filledAreas = new Set(cells.map((c) => c.gridArea));

  const fillers = expectedAreas
    .filter((area) => !filledAreas.has(area))
    .map((area) => createFillerCell(area));

  return [...cells, ...fillers];
}

/**
 * Generates cells with grid areas based on layout type.
 * @param items - Section metrics to generate cells for
 * @param layout - The screen layout configuration
 * @returns Array of screen cells with proper grid areas
 */
export function generateCells(
  items: SectionMetrics[],
  layout: ScreenLayout
): ScreenCell[] {
  let cells: ScreenCell[];

  switch (layout.type) {
    case 'text-full':
      cells = generateTextFullCells(items);
      break;
    case 'showcase':
      cells = generateShowcaseCells(items);
      break;
    case 'split-h':
      cells = generateSplitHCells(items);
      break;
    case 'cinematic':
      cells = generateCinematicCells(items);
      break;
    case 'split-v':
      cells = generateSplitVCells(items);
      break;
    case 'gallery':
      cells = generateGalleryCells(items);
      break;
    case 'mosaic':
      cells = generateMosaicCells(items);
      break;
    case 'duo-images':
      cells = generateDuoImagesCells(items);
      break;
    case 'image-split-text':
      cells = generateImageSplitTextCells(items);
      break;
    case 'micro-gallery':
      cells = generateMicroGalleryCells(items);
      break;
    case 'quad-mix':
      cells = generateQuadMixCells(items);
      break;
    default:
      cells = generateTextFullCells(items);
  }

  // Inject fillers for any empty grid areas
  return injectFillers(cells, layout);
}

// =============================================================================
// Merge Detection
// =============================================================================

const SHORT_TEXT_THRESHOLD = 100;

/**
 * Checks if a section qualifies as an "image with short text" for duo-images.
 * @param metric - Section metrics to check
 * @returns True if section has image with short text
 */
function isImageWithShortText(metric: SectionMetrics): boolean {
  return metric.hasImage && metric.textLength < SHORT_TEXT_THRESHOLD;
}

/**
 * Checks if a section is text-only with substantial content.
 * @param metric - Section metrics to check
 * @returns True if section is text-only
 */
function isTextOnly(metric: SectionMetrics): boolean {
  return !metric.hasImage && metric.textLength > 0;
}

/**
 * Checks if a section is image-only or image with minimal text.
 * @param metric - Section metrics to check
 * @returns True if section is primarily an image
 */
function isImagePrimary(metric: SectionMetrics): boolean {
  return metric.hasImage && metric.textLength < 50;
}

/**
 * Detects merge opportunities in a sequence of sections.
 * Returns merge groups that should be rendered together with special layouts.
 * @param metrics - Array of section metrics to analyze
 * @returns Array of merge groups with their indices and recommended layout
 */
export function detectMergeOpportunities(metrics: SectionMetrics[]): MergeGroup[] {
  const groups: MergeGroup[] = [];
  const consumed = new Set<number>();

  for (let i = 0; i < metrics.length; i++) {
    if (consumed.has(i)) continue;

    const current = metrics[i];

    // Pattern: 3-4 consecutive images → micro-gallery
    if (isImagePrimary(current)) {
      const imageRun: SectionMetrics[] = [current];
      let j = i + 1;
      while (j < metrics.length && isImagePrimary(metrics[j]) && imageRun.length < 4) {
        imageRun.push(metrics[j]);
        j++;
      }

      if (imageRun.length >= 3) {
        groups.push({
          type: 'micro-gallery',
          indices: imageRun.map((m) => m.index),
          metrics: imageRun,
        });
        imageRun.forEach((m) => consumed.add(m.index));
        continue;
      }
    }

    // Pattern: 2 images with short text → duo-images
    if (
      isImageWithShortText(current) &&
      i + 1 < metrics.length &&
      isImageWithShortText(metrics[i + 1])
    ) {
      groups.push({
        type: 'duo-images',
        indices: [current.index, metrics[i + 1].index],
        metrics: [current, metrics[i + 1]],
      });
      consumed.add(current.index);
      consumed.add(metrics[i + 1].index);
      continue;
    }

    // Pattern: Image followed by text-only → image-split-text
    if (current.hasImage && i + 1 < metrics.length && isTextOnly(metrics[i + 1])) {
      groups.push({
        type: 'image-split-text',
        indices: [current.index, metrics[i + 1].index],
        metrics: [current, metrics[i + 1]],
      });
      consumed.add(current.index);
      consumed.add(metrics[i + 1].index);
      continue;
    }

    // Pattern: 3-4 mixed content items → quad-mix
    // Only if none of the items are already consumed by previous patterns
    if (i + 2 < metrics.length && !consumed.has(metrics[i + 1].index) && !consumed.has(metrics[i + 2].index)) {
      const mixRun: SectionMetrics[] = [current];
      let j = i + 1;
      while (j < metrics.length && mixRun.length < 4 && !consumed.has(metrics[j].index)) {
        mixRun.push(metrics[j]);
        j++;
      }

      // Use quad-mix if we have 3-4 items with varied content
      const hasImages = mixRun.some((m) => m.hasImage);
      const hasText = mixRun.some((m) => m.textLength > 0);
      if (mixRun.length >= 3 && hasImages && hasText) {
        groups.push({
          type: 'quad-mix',
          indices: mixRun.map((m) => m.index),
          metrics: mixRun,
        });
        mixRun.forEach((m) => consumed.add(m.index));
        continue;
      }
    }
  }

  return groups;
}

/**
 * Gets the layout for a merge group type.
 * @param type - The merge group type
 * @returns The corresponding screen layout
 */
function getLayoutForMergeType(type: MergeGroup['type']): ScreenLayout {
  switch (type) {
    case 'duo-images':
      return createDuoImagesLayout();
    case 'image-split-text':
      return createImageSplitTextLayout();
    case 'micro-gallery':
      return createMicroGalleryLayout();
    case 'quad-mix':
      return createQuadMixLayout();
  }
}

// =============================================================================
// Screen Planning
// =============================================================================

/**
 * Groups sections into screens based on cumulative weight and merge opportunities.
 * @param metrics - Array of section metrics
 * @param maxWeight - Maximum total weight per screen (default: 4.5)
 * @returns Array of planned screens with layouts and cells
 */
export function planScreens(
  metrics: SectionMetrics[],
  maxWeight = 4.5
): PlannedScreen[] {
  const screens: PlannedScreen[] = [];
  let screenId = 0;

  // First, detect merge opportunities
  const mergeGroups = detectMergeOpportunities(metrics);
  const consumedByMerge = new Set<number>();

  // Create screens for merge groups
  for (const group of mergeGroups) {
    const layout = getLayoutForMergeType(group.type);
    const cells = generateCells(group.metrics, layout);

    screens.push({
      id: screenId++,
      sections: group.metrics,
      layout,
      cells,
    });

    group.indices.forEach((idx) => consumedByMerge.add(idx));
  }

  // Process remaining sections with weight-based grouping
  const remainingMetrics = metrics.filter((m) => !consumedByMerge.has(m.index));
  let currentScreenSections: SectionMetrics[] = [];
  let currentWeight = 0;

  const finalizeScreen = () => {
    if (currentScreenSections.length === 0) return;

    const layout = determineLayout(currentScreenSections);
    const cells = generateCells(currentScreenSections, layout);

    screens.push({
      id: screenId++,
      sections: [...currentScreenSections],
      layout,
      cells,
    });

    currentScreenSections = [];
    currentWeight = 0;
  };

  for (const metric of remainingMetrics) {
    const wouldExceedWeight = currentWeight + metric.weight > maxWeight;
    const wouldExceedCount =
      currentScreenSections.length >= MAX_SECTIONS_PER_SCREEN;

    // Start new screen if adding this section would exceed limits
    if (
      currentScreenSections.length > 0 &&
      (wouldExceedWeight || wouldExceedCount)
    ) {
      finalizeScreen();
    }

    currentScreenSections.push(metric);
    currentWeight += metric.weight;
  }

  // Finalize the last screen
  finalizeScreen();

  // Sort screens by the minimum section index to maintain order
  screens.sort((a, b) => {
    const aMin = Math.min(...a.sections.map((s) => s.index));
    const bMin = Math.min(...b.sections.map((s) => s.index));
    return aMin - bMin;
  });

  // Re-assign screen IDs after sorting
  screens.forEach((screen, idx) => {
    screen.id = idx;
  });

  return screens;
}
