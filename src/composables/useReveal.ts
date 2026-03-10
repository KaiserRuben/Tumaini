import { onMounted, onUnmounted, type Ref, ref } from 'vue'

/**
 * Adds `.is-visible` class to elements with `.reveal` or `.reveal-stagger`
 * when they scroll into view. Supports staggered delays via `data-index`.
 *
 * Uses a MutationObserver to pick up dynamically added elements
 * (e.g. after async data loads).
 */
export function useReveal(containerRef: Ref<HTMLElement | null>) {
  let intersectionObserver: IntersectionObserver | null = null
  let mutationObserver: MutationObserver | null = null

  function observeElements() {
    if (!containerRef.value || !intersectionObserver) return
    const els = containerRef.value.querySelectorAll('.reveal:not(.is-visible), .reveal-stagger:not(.is-visible)')
    els.forEach((el) => intersectionObserver!.observe(el))
  }

  onMounted(() => {
    if (!containerRef.value) return

    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const index = el.dataset.index
            if (index) {
              el.style.transitionDelay = `${Number(index) * 100}ms`
            }
            el.classList.add('is-visible')
            intersectionObserver?.unobserve(el)
          }
        })
      },
      { threshold: 0.15 }
    )

    // Initial scan
    observeElements()

    // Watch for new elements added to the DOM (async data, v-if, v-for)
    mutationObserver = new MutationObserver(() => {
      observeElements()
    })
    mutationObserver.observe(containerRef.value, {
      childList: true,
      subtree: true
    })
  })

  onUnmounted(() => {
    intersectionObserver?.disconnect()
    mutationObserver?.disconnect()
  })
}

/**
 * Simple ref-based reveal for a single element
 */
export function useElementReveal() {
  const elRef = ref<HTMLElement | null>(null)
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!elRef.value) return
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer?.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(elRef.value)
  })

  onUnmounted(() => observer?.disconnect())

  return { elRef, isVisible }
}
