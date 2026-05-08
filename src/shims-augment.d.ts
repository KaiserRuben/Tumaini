// Module file (top-level `export {}`) so `declare module` blocks MERGE with
// the existing module declarations instead of replacing them.
export {}

// Augment Vue component instance with router properties.
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: any
    $route: any
  }
}
