import Vue from 'vue'
import { NATIVE_EVENTS } from '../constants'
import { genStepsData } from '../api/generator'
import { getConfig } from '../mixins/ConfigMixin'

/*

## Interface Definition ##
> All events pass a payload object which can have multiple keys

SetDeploymentUsers {
  deploymentUsers: [
    { id: Number, macAddress: String }
  ]
}

DeviceScanned { deploymentUserId: Number }
  => When a device QR code is scanned

FoodScanned { foodId: Number }
  => When a food QR code is scanned

RequestData { deploymentUserId: Number, macAddress: String }
  => When the webapp is requesting data for a specific user

RecievedData { batteryLevel: Number, stepData: StepData[] }
  => When the android app has sent device data

ForceTabletHome {}
  => Forces the tablet screen to go back home

DeviceJoined { macAddress: String }
  => When a device has become in range of the tablet

DeviceLeft { macAddress: String }
  => When a device leaves the range of the tablet

StepData = { recordedOn: String, steps: Number }

 */

// Create a client, a vue instance which provides an EventEmitter
const client = new Vue()

// Register a plugin to install the client onto all vue things under $native
Vue.use((Vue, options) => {
  Vue.prototype.$native = client
})

// Export the client so this file can serve as a singleton via import
export default client

// The number of active devices (debug)
export let numActiveDevices = 0

// Custom keyboard controls for development
export const debugControls = {
  '1': e => {
    if (numActiveDevices >= 30) return
    client.$emit(NATIVE_EVENTS.DEVICE_JOINED, {
      deploymentUserId: ++numActiveDevices
    })
  },

  '2': e => {
    if (numActiveDevices <= 0) return
    client.$emit(NATIVE_EVENTS.DEVICE_LEFT, {
      deploymentUserId: numActiveDevices--
    })
  },

  '3': e => {
    client.$emit(NATIVE_EVENTS.DEVICE_SCANNED, {
      deploymentUserId: 1
    })
  },

  '4': e => {
    client.$emit(NATIVE_EVENTS.FOOD_SCANNED, {
      foodId: 1
    })
  },

  '5': e => {
    client.$emit(NATIVE_EVENTS.FORCE_TABLET_HOME)
  },

  '6': e => {
    client.$emit(NATIVE_EVENTS.QUESTION_SET, {
      questionId: 1
    })
  },

  '7': e => {
    client.$emit(NATIVE_EVENTS.EXIT_TABLET)
  },

  '8': e => {
    client.$emit(NATIVE_EVENTS.REQUEST_DATA_FAILED)
  }
}

// A debug key handler to mock the events
function keyHandler (e) {
  debugControls[e.key] && debugControls[e.key](e)
}

// Remove (if added) and add the debug key handler
window.removeEventListener('keydown', keyHandler)
window.addEventListener('keydown', keyHandler)

if (getConfig('MOCK_API')) {
  // Mock the REQUEST_DATA event by waiting and generating data
  client.$on(NATIVE_EVENTS.REQUEST_DATA, ({ deploymentUserId }) => {
    const mock = () => client.$emit(NATIVE_EVENTS.RECIEVED_DATA, genStepsData())
    setTimeout(mock, 3000)
  })
}

// Listen for android events and pass them to the event listener
window.onAndroidEvent = function (name, payload = '{}') {
  try {
    if (typeof name !== 'string' || !Object.values(NATIVE_EVENTS).includes(name)) {
      throw new Error(`invalid event name '${name}'`)
    }
    // payload = JSON.parse(payload)
    let parsedPayload = JSON.parse(payload)
    if (typeof parsedPayload !== 'object') {
      throw new Error('payload is not an object')
    }
    client.$emit(name, parsedPayload)
  } catch (error) {
    console.warn('window#onAndroidEvent', error)
    alert(`window#onAndroidEvent - ${error.message}`)
  }
}

// Ensure the native namespace is there
if (!window.ThinkActiveApplication) {
  console.warn('Native Bridge object does not exist, expected "window.ThinkActiveApplication"')
} else {
  // If these events are recieved, call a method on ThinkActiveApplication
  const eventsToProxy = [
    NATIVE_EVENTS.REQUEST_DATA,
    NATIVE_EVENTS.SET_DEPLOYMENT_USERS,
    NATIVE_EVENTS.DISPLAY_TOAST,
    NATIVE_EVENTS.VIBRATE_DEVICE
  ]

  eventsToProxy.forEach(eventName => {
    if (window.ThinkActiveApplication[eventName]) {
      console.debug(`Added native proxy: window.ThinkActiveApplication#${eventName}`)
      client.$on(eventName, payload => {
        window.ThinkActiveApplication[eventName](JSON.stringify(payload))
      })
    } else {
      console.warn(`Native method does not exist, expected "window.ThinkActiveApplication#${eventName}"`)
    }
  })
}

// DEBUG: Log any events that occur
Object.keys(NATIVE_EVENTS).forEach(key => {
  client.$on(NATIVE_EVENTS[key], payload => {
    console.debug(NATIVE_EVENTS[key], payload)
  })
})
