// vue-router type declaration
declare module 'vue-router' {
  import type { App, Component } from 'vue'

  export interface RouteLocationNormalized {
    fullPath: string
    path: string
    query: Record<string, string | string[] | undefined>
    hash: string
    name: string | symbol | null | undefined
    params: Record<string, string | string[]>
    matched: RouteRecordNormalized[]
    redirectedFrom: RouteLocationNormalized | undefined
    meta: Record<string, any>
  }

  export interface RouteLocationNormalizedLoaded extends RouteLocationNormalized {
    href: string
  }

  export interface RouteRecordNormalized {
    path: string
    name: string | symbol | undefined
    meta: Record<string, any>
    components: Record<string, Component>
  }

  export interface RouteRecordRaw {
    path: string
    name?: string | symbol
    component?: Component | (() => Promise<Component>)
    components?: Record<string, Component | (() => Promise<Component>)>
    redirect?: string | RouteLocationNormalized | ((to: RouteLocationNormalized) => string | RouteLocationNormalized)
    children?: RouteRecordRaw[]
    meta?: Record<string, any>
    beforeEnter?: NavigationGuard | NavigationGuard[]
    props?: boolean | Record<string, any> | ((to: RouteLocationNormalized) => Record<string, any>)
    alias?: string | string[]
    sensitive?: boolean
    strict?: boolean
  }

  export interface NavigationGuard {
    (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ): void | Promise<void>
  }

  export type NavigationGuardNext = (to?: string | false | RouteLocationNormalized | ((vm: any) => any) | void) => void

  export interface RouterOptions {
    history: RouterHistory
    routes: RouteRecordRaw[]
    scrollBehavior?: (to: RouteLocationNormalized, from: RouteLocationNormalized, savedPosition: { left: number; top: number } | null) => { left?: number; top?: number; el?: string | Element; behavior?: 'auto' | 'smooth' } | false | void
    linkActiveClass?: string
    linkExactActiveClass?: string
  }

  export interface RouterHistory {
    readonly base: string
    readonly location: string
    readonly state: any
    push(to: string): void
    replace(to: string): void
    go(delta: number): void
    listen(callback: (to: string, from: string, info: any) => void): () => void
    createHref(to: string): string
    destroy(): void
  }

  export interface Router {
    readonly currentRoute: { value: RouteLocationNormalizedLoaded }
    readonly options: RouterOptions
    addRoute(parentName: string | symbol, route: RouteRecordRaw): () => void
    addRoute(route: RouteRecordRaw): () => void
    removeRoute(name: string | symbol): void
    hasRoute(name: string | symbol): boolean
    getRoutes(): RouteRecordNormalized[]
    resolve(to: string | RouteLocationNormalized): RouteLocationNormalized & { href: string }
    push(to: string | RouteLocationNormalized): Promise<void | NavigationFailure>
    replace(to: string | RouteLocationNormalized): Promise<void | NavigationFailure>
    go(delta: number): void
    back(): void
    forward(): void
    beforeEach(guard: NavigationGuard): () => void
    beforeResolve(guard: NavigationGuard): () => void
    afterEach(hook: (to: RouteLocationNormalized, from: RouteLocationNormalized, failure?: NavigationFailure) => void): () => void
    onError(handler: (error: any) => void): () => void
    isReady(): Promise<void>
    install(app: App): void
  }

  export interface NavigationFailure {
    type: number
    from: RouteLocationNormalized
    to: RouteLocationNormalized
  }

  export function createRouter(options: RouterOptions): Router
  export function createWebHistory(base?: string): RouterHistory
  export function createWebHashHistory(base?: string): RouterHistory
  export function createMemoryHistory(base?: string): RouterHistory
  export function useRoute(): RouteLocationNormalizedLoaded
  export function useRouter(): Router
}
