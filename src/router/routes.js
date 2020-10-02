const routes = [
  {
    path: '/group/:groupId/',
    name: 'group',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '/', name: 'trackList', component: () => import('pages/TrackList.vue') },
      { path: '/search', name: 'search', component: () => import('pages/Search.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: 'connect',
        name: 'connect',
        component: () => import('pages/Connect.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/Register.vue')
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('pages/Profile.vue')
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('pages/Home.vue')
      },
      {
        path: 'group-creation',
        name: 'group-creation',
        component: () => import('pages/GroupCreation.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
