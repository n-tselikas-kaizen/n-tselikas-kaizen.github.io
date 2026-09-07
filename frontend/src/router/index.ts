import { createRouter, createWebHistory } from 'vue-router'

/** Which bottom-nav tab stays highlighted for this route — mirrors the prototype's `albumsFlow` grouping. */
export type NavGroup = 'albums' | 'marketplace' | 'social' | 'demo-tools'

declare module 'vue-router' {
  interface RouteMeta {
    navGroup: NavGroup
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/modules/albums/views/HomeView.vue'),
      meta: { navGroup: 'albums' },
    },
    {
      path: '/how-to-play',
      name: 'how-to-play',
      component: () => import('@/modules/albums/views/HowToPlayView.vue'),
      meta: { navGroup: 'albums' },
    },
    {
      path: '/albums/:albumId',
      name: 'album',
      component: () => import('@/modules/albums/views/AlbumView.vue'),
      props: true,
      meta: { navGroup: 'albums' },
    },
    {
      path: '/albums/:albumId/packs',
      name: 'pack',
      component: () => import('@/modules/packs/views/PackView.vue'),
      props: true,
      meta: { navGroup: 'albums' },
    },
    {
      path: '/albums/:albumId/listings',
      name: 'listings',
      component: () => import('@/modules/listings/views/ListingsView.vue'),
      props: true,
      meta: { navGroup: 'albums' },
    },
    {
      path: '/albums/:albumId/trade',
      name: 'trade',
      component: () => import('@/modules/trading/views/TradeView.vue'),
      props: true,
      meta: { navGroup: 'albums' },
    },
    {
      path: '/achievements',
      name: 'achievements',
      component: () => import('@/modules/achievements/views/AchievementsView.vue'),
      meta: { navGroup: 'albums' },
    },
    {
      path: '/marketplace',
      name: 'marketplace',
      component: () => import('@/modules/marketplace/views/MarketplaceView.vue'),
      meta: { navGroup: 'marketplace' },
    },
    {
      path: '/social',
      name: 'social',
      component: () => import('@/modules/social/views/SocialView.vue'),
      meta: { navGroup: 'social' },
    },
    {
      path: '/demo-tools',
      name: 'demo-tools',
      component: () => import('@/modules/demo-tools/views/DemoToolsView.vue'),
      meta: { navGroup: 'demo-tools' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/modules/common/views/NotFoundView.vue'),
      meta: { navGroup: 'albums' },
    },
  ],
})

export default router
