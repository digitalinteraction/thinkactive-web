import { ROUTES } from '../constants'

import webRoutes from './webRoutes'
import tabletRoutes from './tabletRoutes'
import presentRoutes from './presentRoutes'

import WebApp from '@/apps/WebApp'
import TabletApp from '@/apps/TabletApp'
import PresentApp from '@/apps/PresentApp'
import NotFound from '@/pages/NotFoundPage'

export default [

  {
    path: '/',
    component: WebApp,
    children: webRoutes
  },
  
  {
    path: '/tablet',
    component: TabletApp,
    children: tabletRoutes
  },
  
  {
    path: '/present',
    component: PresentApp,
    children: presentRoutes
  },
  
  /* Not Found fallback */
  {
    path: '*',
    name: ROUTES.NOT_FOUND,
    component: NotFound
  }
]
