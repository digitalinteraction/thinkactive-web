import { ROUTES } from '@/constants'

import Home from '@/pages/HomePage'
// import Holder from '@/pages/HolderPage'
import Login from '@/pages/auth/LoginPage'
import ForgottenPassword from '@/pages/auth/ForgottenPasswordPage'
import ResetPassword from '@/pages/auth/ResetPasswordPage'

import DashRoot from '../pages/dash/DashRootPage'
import DashHome from '../pages/dash/DashHomePage'

import OrgRoot from '../pages/org/OrgRootPage'
import OrgHome from '../pages/org/OrgHomePage'
import JoinOrg from '../pages/org/JoinOrgPage'
import OrgInvite from '../pages/org/OrgInvitePage'

import Deployment from '../pages/deployment/DeploymentPage'
import DeploymentTabs from '../pages/deployment/DeploymentTabsPage'
import DeploymentFiles from '../pages/deployment/DeploymentFilesPage'
import DeploymentInfo from '../pages/deployment/DeploymentInfoPage'
import DeploymentViews from '../pages/deployment/DeploymentViewsPage'
import DeploymentData from '../pages/deployment/DeploymentDataPage'

import DeploymentUsers from '../pages/deployment/users/DeploymentUsersPage'
import DeploymentAddUser from '../pages/deployment/users/DeploymentAddUserPage'
import DeploymentEditUser from '../pages/deployment/users/DeploymentEditUserPage'

import DeploymentChallenges from '../pages/deployment/challenges/DeploymentChallengesPage'
import DeploymentNewChallenge from '../pages/deployment/challenges/DeploymentNewChallengePage'
import DeploymentEditChallenge from '../pages/deployment/challenges/DeploymentEditChallengePage'

import NewDeployment from '../pages/org/NewDeploymentPage'
import NewDeploymentInfo from '../pages/org/NewDeploymentInfoPage'
import NewDeploymentDevices from '../pages/org/NewDeploymentDevicesPage'

export default [

  /* Base Routes */
  {
    path: '',
    name: ROUTES.HOME,
    component: Home
  },

  /* Auth Routes */
  {
    path: '/login',
    name: ROUTES.LOGIN,
    component: Login
  },
  {
    path: '/login/forgot',
    name: ROUTES.FORGOTTEN_PASSWORD,
    component: ForgottenPassword
  },
  {
    path: '/login/reset/:code',
    name: ROUTES.RESET_PASSWORD,
    component: ResetPassword
  },

  /* Org Routes */
  {
    path: '/dash',
    component: DashRoot,
    meta: {
      crumb: 'Dash',
      crumbIcon: 'home',
      holderFor: ROUTES.DASH_HOME
    },
    children: [
      {
        path: '',
        name: ROUTES.DASH_HOME,
        component: DashHome
      },
      {
        path: 'org/:org_id',
        component: OrgRoot,
        meta: {
          crumb: 'Organisation',
          holderFor: ROUTES.ORG_HOME
        },
        children: [
          {
            path: '',
            name: ROUTES.ORG_HOME,
            component: OrgHome
          },
          {
            path: 'invite',
            name: ROUTES.ORG_INVITE,
            component: OrgInvite
          },
          {
            path: 'deployment/new',
            component: NewDeployment,
            meta: {
              holderFor: ROUTES.NEW_DEPLOYMENT
            },
            children: [
              {
                path: '',
                name: ROUTES.NEW_DEPLOYMENT,
                component: NewDeploymentInfo,
                meta: {
                  crumb: 'New Deployment'
                }
              },
              {
                path: 'devices',
                name: ROUTES.NEW_DEPLOYMENT_DEVICES,
                component: NewDeploymentDevices,
                meta: {
                  crumb: 'New Deployment - Devices'
                }
              }
            ]
          },
          {
            path: 'deployment/:deployment_id',
            component: Deployment,
            meta: {
              holderFor: ROUTES.DEPLOYMENT,
              crumb: 'Deployment'
            },
            children: [
              {
                path: '',
                component: DeploymentTabs,
                children: [
                  {
                    path: '',
                    name: ROUTES.DEPLOYMENT,
                    component: DeploymentInfo
                  },
                  {
                    path: 'users',
                    name: ROUTES.DEPLOYMENT_USERS,
                    component: DeploymentUsers
                  },
                  {
                    path: 'challenges',
                    name: ROUTES.DEPLOYMENT_CHALLENGES,
                    component: DeploymentChallenges,
                    meta: {
                      crumb: 'Challenges'
                    }
                  },
                  {
                    path: 'files',
                    name: ROUTES.DEPLOYMENT_FILES,
                    component: DeploymentFiles
                  },
                  {
                    path: 'view',
                    name: ROUTES.DEPLOYMENT_VIEWS,
                    component: DeploymentViews
                  },
                  {
                    path: 'data',
                    name: ROUTES.DEPLOYMENT_DATA,
                    component: DeploymentData
                  }
                ]
              },
              {
                path: 'users/:user_device_id/edit',
                name: ROUTES.DEPLOYMENT_EDIT_USER,
                component: DeploymentEditUser,
                meta: {
                  crumb: 'Edit User'
                }
              },
              {
                path: 'users/add',
                name: ROUTES.DEPLOYMENT_ADD_USER,
                component: DeploymentAddUser,
                meta: {
                  crumb: 'Add User'
                }
              },
              {
                path: 'challenges/add',
                name: ROUTES.DEPLOYMENT_NEW_CHALLENGE,
                component: DeploymentNewChallenge,
                meta: {
                  crumb: 'New Challenge'
                }
              },
              {
                path: 'challenges/:challenge_id',
                name: ROUTES.DEPLOYMENT_EDIT_CHALLENGE,
                component: DeploymentEditChallenge,
                meta: {
                  crumb: 'Edit Challenge'
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/join/org/:code',
    name: ROUTES.JOIN,
    component: JoinOrg
  }
]
