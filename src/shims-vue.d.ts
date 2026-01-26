/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Augment Vue component instance with router properties
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: any
    $route: any
  }
}
