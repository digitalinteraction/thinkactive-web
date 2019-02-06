import { ROUTES } from '@/constants'

import TabletHome from '../pages/tablet/TabletHomePage'
import TabletError from '../pages/tablet/TabletErrorPage'
import DeviceSync from '../pages/tablet/DeviceSyncPage'
import Device from '../pages/tablet/DevicePage'
import Holder from '../pages/HolderPage'
import Food from '../pages/tablet/TabletFoodPage'

export default [
  
  /* Tablet Routes */
  {
    path: ':deployment_id',
    component: Holder,
    children: [
      {
        path: '',
        name: ROUTES.TABLET_HOME,
        component: TabletHome
      },
      {
        path: 'sync/:deployment_user_id',
        name: ROUTES.DEVICE_SYNC,
        component: DeviceSync
      },
      {
        path: 'device/:deployment_user_id',
        name: ROUTES.DEVICE_DETAIL,
        component: Device
      },
      {
        path: 'food/:food_id',
        name: ROUTES.FOOD_DETAIL,
        component: Food
      },
      {
        path: 'error/:error_type',
        name: ROUTES.TABLET_ERROR,
        component: TabletError
      },
      {
        path: '*',
        component: TabletError
      }
    ]
  }
]
