import { onMounted, onUnmounted, type Ref, ref } from 'vue'

/**
 * Adds `.is-visible` class to elements with `.reveal` or `.reveal-stagger`
 * when they scroll into view. Supports staggered delays via `data-index`.
 */
export function useReveal(containerRef: Ref<HTMLElement | null>) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!containerRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const index = el.dataset.index
            if (index) {
              el.style.transitionDelay = `${Number(index) * 100}ms`
            }
            el.classList.add('is-visible')
            observer?.unobserve(el)
          }
        })
      },
      { threshold: 0.15 }
    )

    const els = containerRef.value.querySelectorAll('.reveal, .reveal-stagger')
    els.forEach((el) => observer!.observe(el))
  })

  onUnmounted(() => {
    observer?.disconnect()
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
