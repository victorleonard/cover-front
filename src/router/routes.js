const routes = [
  {
    path: '/share/:id',
    name: 'share',
    component: () => import('pages/Share.vue')
  },
  {
    path: '/group/:groupId/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '/', name: 'group', component: () => import('pages/TrackList.vue') },
      { path: '/group/:groupId/vote', name: 'vote', component: () => import('pages/Vote.vue') },
      { path: '/group/:groupId/search', name: 'search', component: () => import('pages/Search.vue') },
      { path: '/group/:groupId/setlists', name: 'setlists', component: () => import('pages/SetLists.vue') },
      { path: '/group/:groupId/setlist/:id', name: 'setlist', component: () => import('pages/SetList.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', name: 'welcome', component: () => import('pages/Index.vue') },
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
        path: 'create-or-join',
        name: 'create-or-join',
        component: () => import('pages/CreateOrJoin.vue')
      },
      {
        path: 'group-creation',
        name: 'group-creation',
        component: () => import('pages/GroupCreation.vue')
      },
      {
        path: 'group-join',
        name: 'group-join',
        component: () => import('pages/GroupJoin.vue')
      },
      {
        path: '/group-edit/:groupId',
        name: 'group-edit',
        component: () => import('pages/GroupEdit.vue')
      },
      {
        path: 'email-confirmation',
        name: 'email-confirmation',
        component: () => import('pages/EmailConfirmation.vue')
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('pages/ForgotPassword.vue')
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('pages/ResetPassword.vue')
      },
      {
        path: 'inbox',
        name: 'inbox',
        component: () => import('layouts/MyLayoutMessage.vue'),
        children: [
          { path: '/', name: 'inbox', component: () => import('pages/Inbox.vue') },
          { path: '/message/:id', name: 'message', component: () => import('pages/Message.vue') }
        ]
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
