const routes = [
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
