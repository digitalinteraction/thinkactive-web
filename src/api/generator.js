import { MOCK } from '@/constants'
import moment from 'moment-mini'

function mocked (type, obj) {
  obj._mocktype = type
  return obj
}

function pickOneFrom (items) {
  return items[Math.floor(Math.random() * items.length)]
}

function pickBetween (from, to) {
  return from + Math.floor(Math.random() * (to - from))
}

function pickDateBetween (from, to) {
  return new Date(pickBetween(from.getTime(), to.getTime()))
}

function genChallengeDate (index, plus = 0) {
  let now = new Date()
  if (index === 1) {
    now.setHours(plus, 0, 0, 0)
  } else {
    let change = index % 2 ? -48 : 24
    now.setHours(change + plus)
  }
  return now
}

function hexDigit () {
  return Math.round(Math.random() * 15).toString(16)
}

function todayWithHour (hour) {
  let now = new Date()
  now.setHours(hour, 0, 0, 0)
  return now
}

export function genEnvelope (success, data, messages = []) {
  return {
    meta: { success, messages }, data
  }
}

/** Generate a User */
export function genUser () {
  return mocked('User', {
    username: 'geoff-testington',
    firstName: 'Geoff',
    lastName: 'Testington',
    email: 'geoff@example.com'
  })
}

/** Generate a Deployment */
export function genDeployment (newId, orgId = 1) {
  newId = parseInt(newId)
  return mocked('Deployment', {
    id: newId,
    name: `Deployment ${newId}`,
    location: 'Some Location',
    pointOfContact: 'Some Person',
    organisationId: parseInt(orgId),
    baselineFrom: moment().subtract(7 - newId, 'days').toDate(),
    baselineTo: moment().subtract(5 - newId, 'days').toDate(),
    activityFrom: moment().add(14 + newId, 'days').toDate(),
    activityTo: moment().add(21 + newId, 'days').toDate()
  })
}

/** Generate an Organisation */
export function genOrg (newId) {
  newId = parseInt(newId)
  return mocked('Org', {
    id: newId,
    name: `Organisation ${newId}`
  })
}

/** Generate a Device */
export function genDevice () {
  return mocked('Device', {
    macAddress: genMacAddr()
  })
}

/** Generate a user_device */
export function genUserDevice (newId, deploymentId = 1) {
  newId = parseInt(newId)
  return mocked('UserDevice', {
    id: newId,
    animal: MOCK.ANIMALS[newId % MOCK.ANIMALS.length],
    colour: MOCK.COLOURS[newId % MOCK.COLOURS.length],
    macAddress: genMacAddr(),
    deploymentId
  })
}

/** Generate a challenge */
export function genChallenge (newId, deploymentId = 1) {
  newId = parseInt(newId)
  return mocked('Challenge', {
    id: newId,
    deploymentId,
    name: `Challenge ${newId}`,
    message: `Thats about a 1/4 of the distance to the moon`,
    mode: pickOneFrom([ 'EVERYONE', 'GROUP' ]),
    metric: pickOneFrom([ 'TOTAL', 'AVERAGE' ]),
    target: pickBetween(10000, 100000),
    // message: '',
    // mode: 'GROUP',
    // metric: 'AVERAGE',
    // target: 50000000,
    start: genChallengeDate(newId),
    end: genChallengeDate(newId, 24),
    deletedAt: null
  })
}

/** Generate a site stats */
export function genSiteStats () {
  return mocked('UsageStats', {
    steps: 142011, users: 1209, deployments: 9, instructors: 6
  })
}

/** Generate a username (not guaranteed to be unique) */
export function genUserName () {
  return pickOneFrom(MOCK.COLOURS) + ' ' + pickOneFrom(MOCK.ANIMALS)
}

/** Generate a mac address, e.g. 9d:ec:88:30:1f:54 */
export function genMacAddr () {
  return Array(6).fill()
    .map(() => hexDigit() + hexDigit())
    .join(':')
}

/** Generate a step data */
export function genStepsData () {
  let samples = []
  for (let i = 0; i < 10; i++) {
    samples.push(genSampleData())
  }

  return {
    samples,
    batteryLevel: 63,
    epochInterval: 1000,
    lastBlockSynced: 42,
    lastRTC: 124,
    lastSyncTime: new Date()
  }
}

export function genSampleData () {
  return {
    steps: pickBetween(0, 100),
    batteryLevel: pickBetween(50, 70),
    recordedOn: pickDateBetween(
      new Date('2018-02-01T00:00:00'),
      new Date('2018-02-07T23:59:59')
    )
  }
}

// const unitMap = {
//   SECOND: 60,
//   MINUTE:
// }

export function genStepsDataBetween (from, to, interval, unit, deploymentUserIds = [1]) {
  let samples = {}

  deploymentUserIds.forEach(id => {
    let date = moment(from)
    let output = {}
    while (date.isBefore(to)) {
      output[date.format('X')] = pickBetween(0, 5000)
      date = date.add(interval, unit)
    }
    samples[id] = output
  })

  return samples
}

/** Generates step data from 8.00 to 6.00 for the current day */
export function genDailyStepsData (interval = 60, deploymentUserIds = [1]) {
  let now = todayWithHour(8).getTime() / 1000
  let end = todayWithHour(18).getTime() / 1000

  let secondsInDay = 24 * 60 * 60

  let samples = {}
  let stepRange = 5000 * (interval / secondsInDay)

  deploymentUserIds.forEach(id => {
    samples[id] = {}

    for (let time = now; time < end; time += interval) {
      samples[id][time] = pickBetween(0, stepRange)
    }
  })

  return samples
}

/** Generate a food item */
export function genFood (newId) {
  return MOCK.FOODS[newId % MOCK.FOODS.length]
}

/** Generate a question */
export function genQuestion (newId) {
  return MOCK.QUESTIONS[newId % MOCK.QUESTIONS.length]
}

/** Generate All Questions */
export function genAllQuestions () {
  return MOCK.QUESTIONS
}

/** Generate a DeploymentUserState */
export function genDeploymentUserState (deploymentUserId) {
  console.log('generating User State')
  return {
    deploymentUserId: deploymentUserId,
    id: 1, // generate by db
    lastQuestionId: 1,
    questionAttemptNumber: 1,
    questionAnsweredCorrectly: true,
    active: true
  }
}
