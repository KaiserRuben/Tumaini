/* eslint-disable */
// Script-context (no top-level export) so `*.vue` wildcard registers globally.
// Module augmentations belong in shims-augment.d.ts (a module file). Mixing the
// two here causes either the wildcard or the augmentation to be ignored.
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
