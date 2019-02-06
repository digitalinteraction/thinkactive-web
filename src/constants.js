
export const MOCK = {
  SPEED: process.env.NODE_ENV === 'test' ? 1 : 300,
  SHOULD_FAIL: false,
  LOGGED_IN: true,
  ANIMALS: [
    'deer', 'boar', 'giraffe', 'dog', 'octopus', 'cow', 'horse', 'elephant', 'badger', 'bear', 'duck', 'goat', 'hedgehog', 'rhinoceros', 'kangaroo', 'panda', 'ladybird', 'parrot', 'fox', 'owl', 'penguin', 'antelope', 'bee', 'buffalo', 'tiger', 'pig', 'lion', 'donkey', 'hippopotamus', 'crocodile', 'zebra', 'hamster', 'wolf', 'frog', 'monkey', 'koala', 'sheep', 'puma', 'reindeer', 'snake', 'hen', 'cat', 'snail', 'camel', 'bunny', 'squirrel', 'walrus', 'mouse'
  ],
  COLOURS: [
    'red', 'blue', 'green', 'orange', 'purple', 'yellow'
  ],
  FOODS: [
    { id: 1, name: '01-apple', group: 0, energy: 1, fat: 0, sugar: 0 },
    { id: 15, name: '15-steak', group: 2, energy: 2, fat: 1, sugar: 1 },
    { id: 7, name: '07-tomato', group: 1, energy: 1, fat: 2, sugar: 2 }

  ],
  QUESTIONS: [
    { id: 1, level: 1, text: 'Can you find a food from the Dairy group?', questionFoodGroup: [ 1, 1, 1, 0, 1 ], questionState: [ 0, 0, 1, 0, 1, 0 ], answerType: 0, answerReq: 0, answerContents: 'group=3', resultFoodGroup: [ 1, 1, 1, 1, 1 ], resultState: [ 1, 1, 1, 1, 1, 1 ] },
    { id: 2, level: 2, text: 'My bones feel weak... what could I eat to help?', questionFoodGroup: [ 1, 1, 1, 0, 1 ], questionState: [ 0, 0, 1, 0, 1, 0 ], answerType: 0, answerReq: 0, answerContents: 'group=3', resultFoodGroup: [ 1, 1, 1, 1, 1 ], resultState: [ 1, 1, 1, 1, 1, 1 ] },
    { id: 4, level: 1, text: 'What food might come from the Protein food group?', questionFoodGroup: [ 1, 1, 0, 1, 1 ], questionState: [ 0, 0, 1, 0, 1, 0 ], answerType: 0, answerReq: 0, answerContents: 'group=2', resultFoodGroup: [ 1, 1, 1, 1, 1 ], resultState: [ 1, 1, 1, 1, 1, 1 ] },
    { id: 5, level: 2, text: 'My muscles feel weak... what could I eat to help?', questionFoodGroup: [ 1, 1, 1, 0, 1 ], questionState: [ 0, 0, 1, 0, 1, 0 ], answerType: 0, answerReq: 0, answerContents: 'group=2', resultFoodGroup: [ 1, 1, 1, 1, 1 ], resultState: [ 1, 1, 1, 1, 1, 1 ] },
    { id: 6, level: 1, text: 'I wonder what food could be from the carbohydrate group?', questionFoodGroup: [ 0, 1, 1, 1, 0 ], questionState: [ 0, 1, 1, 0, 1, 0 ], answerType: 0, answerReq: 0, answerContents: 'energy=2', resultFoodGroup: [ 1, 1, 1, 1, 1 ], resultState: [ 1, 1, 1, 1, 1, 1 ] },
    { id: 7, level: 2, text: 'I am low on energy... what could I eat to help?', questionFoodGroup: [ 0, 1, 1, 1, 0 ], questionState: [ 0, 1, 1, 0, 1, 0 ], answerType: 0, answerReq: 0, answerContents: 'energy=2', resultFoodGroup: [ 1, 1, 1, 1, 1 ], resultState: [ 1, 1, 1, 1, 1, 1 ] },
    { id: 8, level: 3, text: 'I feel sick, maybe I have eaten too much of something...', questionFoodGroup: [ 2, 1, 1, 1, 2 ], questionState: [ 0, 1, 1, 1, 0, 1 ], answerType: 0, answerReq: 0, answerContents: 'group=4,group=0', resultFoodGroup: [ 1, 1, 1, 1, 1 ], resultState: [ 1, 1, 1, 1, 1, 1 ] }
  ]
}

// Question Format:
// FoodGroups Indexes: 0 = Carbs, 1 = Fruit and Veg, 2 = Protein, 3 = Dairy, 4 = Fat
// State Indexes: 0 = Happy/Stressed, 1 = Strong/Weak, 2 = Tired/Refreshed, 3 = Low/High Energy, 4 = Ill/Healthy, 5 = Hungry/Full
// Answer Type: 0 = Food
// Answer Req: 0 = Has Any, 1 = Has All
// Anwer Contents: depends on above, e.g. Type = Food, Req = Has, Content = "energy=2" measn the answer needs to be a food card with high energy.
// Results: The state/foodgroup after a 'correct' answer

export const COLOUR_MAP = {
  red: '#f13a46',
  blue: '#2172c3',
  green: '#48a078',
  orange: '#fc6c01',
  purple: '#a36d90',
  yellow: '#f76e8e'
}

export const MUTATIONS = {
  LOGGED_IN: 'LOGGED_IN',
  LOGGED_OUT: 'LOGGED_OUT',
  DEPLOYMENTS: 'DEPLOYMENTS',
  ORGS: 'ORGS',
  CHALLENGES: 'CHALLENGES',
  START_NEW_DEPLOYMENT: 'START_NEW_DEPLOYMENT',
  UPDATE_NEW_DEPLOYMENT: 'UPDATE_NEW_DEPLOYMENT',
  CLEAR_NEW_DEPLOYMENT: 'CLEAR_NEW_DEPLOYMENT',
  DEPLOYMENT_USERS: 'DEPLOYMENT_USERS',
  DEPLOYMENT_USER_JOINED: 'DEPLOYMENT_USER_JOINED',
  DEPLOYMENT_USER_LEFT: 'DEPLOYMENT_USER_LEFT'
}

export const ROUTES = {
  HOME: 'Home',
  LOGIN: 'Login',
  FORGOTTEN_PASSWORD: 'ForgottenPassword',
  RESET_PASSWORD: 'ResetPassword',
  NOT_FOUND: 'NotFound',
  DASH_HOME: 'DashHome',
  ORG_HOME: 'OrgHome',
  ORG_INVITE: 'OrgInvite',
  NEW_DEPLOYMENT: 'NewDeployment',
  NEW_DEPLOYMENT_DEVICES: 'NewDeploymentDevices',
  DEPLOYMENT: 'Deployment',
  DEPLOYMENT_CHALLENGES: 'DeploymentChallenges',
  DEPLOYMENT_NEW_CHALLENGE: 'DeploymentNewChallenge',
  DEPLOYMENT_EDIT_CHALLENGE: 'DeploymentEditChallenge',
  DEPLOYMENT_USERS: 'DeploymentUsers',
  DEPLOYMENT_FILES: 'DeploymentFiles',
  DEPLOYMENT_VIEWS: 'DeploymentViews',
  DEPLOYMENT_DATA: 'DeploymentData',
  DEPLOYMENT_ADD_USER: 'DeploymentAddUser',
  DEPLOYMENT_EDIT_USER: 'DeploymentEditUser',
  JOIN: 'JoinOrg',
  TABLET_HOME: 'TabletHome',
  TABLET_ERROR: 'TabletError',
  PRESENT_HOME: 'PresentHome',
  DEVICE_SYNC: 'DeviceSync',
  DEVICE_DETAIL: 'Device',
  FOOD_DETAIL: 'Food'
}

export const NATIVE_EVENTS = {
  SET_DEPLOYMENT_USERS: 'SetDeploymentUsers',
  DEVICE_SCANNED: 'DeviceScanned',
  FOOD_SCANNED: 'FoodScanned',
  REQUEST_DATA: 'RequestData',
  REQUEST_DATA_FAILED: 'RequestDataFailed',
  RECIEVED_DATA: 'RecievedData',
  FORCE_TABLET_HOME: 'ForceTabletHome',
  DEVICE_JOINED: 'DeviceJoined',
  DEVICE_LEFT: 'DeviceLeft',
  QUESTION_SET: 'QuestionSet',
  EXIT_TABLET: 'ExitTablet',
  DISPLAY_TOAST: 'displayToast',
  VIBRATE_DEVICE: 'VibrateDevice'
}

export const SYNC_EVENTS = {
  START_SYNC: 'StartSync',
  SYNC_COMPLETED: 'SyncCompleted',
  FOOD_QUESTION_COMPLETED: 'FoodQuestionCompleted',
  PROCEED_TO_PROFILE: 'ProceedToProfile'
}

export const TABLET_ERROR = {
  UNKNOWN_USER: 'unknown_user',
  SYNC_FAILED: 'sync_failed',
  FETCH_FAILED: 'fetch_failed'
}

export const TABLET_COLOUR = {
  AMBIENT: 'Ambient',
  FAILING: 'Failing',
  PASSING: 'Passing'
}
