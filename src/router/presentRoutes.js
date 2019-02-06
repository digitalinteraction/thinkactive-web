import { ROUTES } from '@/constants'

import PresentHome from '@/pages/present/PresentHomePage'

export default [
  {
    path: ':deployment_id',
    name: ROUTES.PRESENT_HOME,
    component: PresentHome
  }
]
