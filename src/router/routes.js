const PMDRAGON_STRING = '  |  PmDragon'

const routes = [
  {
    path: '/',
    component: () => import('layouts/IndexLayout.vue'),
    children: [
      {
        name: 'register',
        path: '/register',
        meta: {
          title: 'Register' + PMDRAGON_STRING
        },
        component: () => import('pages/index/Register.vue')
      },
      {
        name: 'login',
        path: '/',
        meta: {
          title: 'Sign In' + PMDRAGON_STRING
        },
        component: () => import('pages/index/Login.vue')
      },
      {
        name: 'verify-registration',
        path: '/verify/registration/:key',
        props: true,
        meta: {
          title: 'Verify your registration' + PMDRAGON_STRING
        },
        component: () => import('pages/index/VerifyRegistration.vue')
      },
      {
        name: 'verify-collaboration',
        path: '/verify/collaboration/:key',
        props: true,
        meta: {
          title: 'Verify your participation in the new workspace' +
            PMDRAGON_STRING
        },
        component: () => import('pages/index/VerifyCollaboration.vue')
      },
      {
        name: 'verify-invitation',
        path: '/verify/invitation/:key',
        props: true,
        meta: {
          title: 'Accept invitation to new workspace' + PMDRAGON_STRING
        },
        component: () => import('pages/index/VerifyInvitation.vue')
      },
      {
        name: 'verify-password-restore',
        path: '/verify/password/restore/:key',
        props: true,
        meta: {
          title: 'Get back to PmDragon' + PMDRAGON_STRING
        },
        component: () => import('pages/index/VerifyPasswordRestore.vue')
      },
      {
        name: 'loading',
        path: '/loading',
        meta: {
          title: 'Loading workspaces...' + PMDRAGON_STRING
        },
        component: () => import('pages/index/Loading.vue')
      },
      {
        name: 'kickstart',
        path: 'kickstart',
        meta: {
          title: 'Welcome' + PMDRAGON_STRING
        },
        component: () => import('pages/index/Kickstart.vue')
      }
    ]
  },
  {
    path: '/dash',
    component: () => import('layouts/DashLayout.vue'),
    children: [
      {
        name: 'workspaces',
        path: 'workspaces',
        meta: {
          title: 'Choose Workspace' + PMDRAGON_STRING,
          requireSpace: false
        },
        component: () => import('pages/dash/Workspaces.vue')
      },
      {
        name: 'settings',
        path: 'settings',
        meta: {
          title: 'Settings' + PMDRAGON_STRING,
          requireSpace: true
        },
        component: () => import('pages/dash/Settings.vue')
      },
      {
        name: 'me',
        path: 'me',
        meta: {
          title: 'My Account' + PMDRAGON_STRING,
          requireSpace: true
        },
        component: () => import('pages/dash/Me.vue')
      },
      {
        name: 'backlog',
        path: 'backlog',
        meta: {
          title: 'Backlog' + PMDRAGON_STRING,
          requireSpace: true
        },
        component: () => import('pages/dash/Backlog.vue')
      },
      {
        name: 'board',
        path: 'board',
        meta: {
          title: 'Board' + PMDRAGON_STRING,
          requireSpace: true
        },
        component: () => import('pages/dash/Board.vue')
      },
      {
        name: 'issue',
        path: 'issue/:id',
        props: true,
        meta: {
          title: 'Issue' + PMDRAGON_STRING,
          requireSpace: true
        },
        component: () => import('pages/dash/Issue.vue')
      },
      {
        name: 'team',
        path: 'team',
        meta: {
          title: 'Team' + PMDRAGON_STRING,
          requireSpace: true
        },
        component: () => import('pages/dash/Team.vue')
      },
      {
        name: 'overview',
        path: 'overview',
        meta: {
          title: 'Overview' + PMDRAGON_STRING,
          requireSpace: true
        },
        component: () => import('pages/dash/Overview.vue')
      }
    ],
    meta: {
      requiredAuth: true
    }
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
