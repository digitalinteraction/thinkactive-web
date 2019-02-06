# Think Active Web

A web interface for creating, managing and running ThinkActive deployments. It is a [Vue](https://vuejs.org) webapp using [npm](https://www.npmjs.com/) packages, written using
[JavaScript](https://developer.mozilla.org/bm/docs/Web/JavaScript),
[Sass](https://sass-lang.com/) and [Pug](https://pugjs.org/api/getting-started.html),
linted with [ESLint](https://eslint.org/), built with
[Webpack](https://webpack.js.org/) and deployed through
[Docker](https://www.docker.com/).

## Features

* Setup and configure deployments
* Manage devices on a deployment
* Download files related to a deployment

## Work In Progress

* Tablet View – A view of a deployment to be shown on a tablet in-class
* Present View – A view of a deployment to be present by an instructor/teacher
* User Management – Add and manage users in organisations, then create deployments under them

## Project Structure

| Path | Info |
| ---- | ---- |
| `/build`  | The Webpack configuration and build scripts, generated using the [vue-cli](https://github.com/vuejs/vue-cli) |
| `/config` | Configurations for different versions of the build i.e production vs dev |
| `/src` | The actual source code for the webapp |
| `/src/api` | Files for interacting with/mocking the Gabber API |
| `/src/apps` | Wrappers for the different sub-apps, i.e web vs tablet vs present  |
| `/src/assets` | Non-JavaScript assets to be compiled into the app, included in from vue components |
| `/src/components` | Vue single file components (.vue), grouped by the type of thing they are |
| `/src/events` | Vue [event busses](https://alligator.io/vuejs/global-event-bus/) |
| `/src/layouts` | Vue components which solely layout content using `<slot>` elements |
| `/src/mixins` | Vue [mixins](https://vuejs.org/v2/guide/mixins.html) |
| `/src/pages` | Vue components that are directly routed to by the router |
| `/src/router` | The [vue-router](https://router.vuejs.org/en/) and its routes |
| `/src/store` | The [vue-store](https://vuex.vuejs.org/en/) and its modules |
| `/src/constants.js` | Cross project constant values for easy `import '@/constants.js'` |
| `/static` | Static assets that are served along side the compiled source |

The entrypoint to the app is `/src/main.js`, if you follow the dependancies from there you should work out structure of the app.

## Api Integration

The app uses an [ApiInterface](/src/api/ApiInterface) to interact with a live/mock api so they can easily be switch out for testing.
It uses the `MOCK_API` and `API_URL` config variables to decide if it is using the mock version or not.

### Master / Child Page Controllers

Each main page of the app is split into separate master / children page controllers. Within the master page controller you should maintain current state of the Vuex Store via Api requests and within the child controller you should use the Vuewx getters and setters in order to maintain state and reduce API requests.

#### Example
An example of this can be seen in `/src/pages/org/OrgRootPage.vue` which persists the state of the current organisation being accessed by the user. As the user navigates through the child routes (i.e. `/src/pages/org/OrgHomePage.vue`) the current active organisation, associated organisationMembers, organisationDevices are initially loaded by the `OrgRootPage.vue` and then added to the `/src/store/state.js`. Children then interact with the Vuex Store to add / remove / update the active data.

## Creating Api endpoints

The app uses [Vuex Mutations](https://vuex.vuejs.org/guide/mutations.html) to manage the current state of currently viewed organisational data (such as active deployments, active devices etc). Updating this data is achieved through API requests (see Api Integration) which interact with the [thinkactive.io-api project](https://openlab.ncl.ac.uk/gitlab/thinkactive.io/thinkactive.io-api).


**You must implement a mock interface and a live interface** which retrieves data from the API and then mutates the stored state in the Vuex controller.

To access the api interface use `this.$.api.functionName` in your master page controller to make the API request (see Master / Children Page Controllers). Once this data has been saved to the store, children components access the data via the Vuex store.

Creating endpoints requires you to add the function to the `ApiInterface.js` and the subclasses of `MockApi.js` and `LiveApi.js`. It is recommended that you make use of the `Generator.js` and `mock.js` to create dummy data for the `MockApi.js` interface.

Implementing endpoints in this app requires that you modify the following files:

| Path | Info |
| ---- | ---- |
| `/src/api/ApiInterface.js` | Add your custom api function here (use `this.notImplemented()` to identify unimplemented endpoints) |
| `/src/api/MockApi.js` | Add your mock function to retrieve mock data  |
| `/src/api/LiveApi.js` | Add your REST request here using `this.endpoint(REQUEST_TYPE, ENDPOINT)` |
| `/src/api/Generator.js` | Create a generator to create mock object responses for the API |
| `/src/api/mock.js` | Create a function for retrieving multiple of the generator mock objects |

Implementing Vuex getters and setters requires that you modify the following files:

| Path | Info |
| ---- | ---- |
| `/src/constants.js` | Add your Vuex store constant here |
| `/src/store/getters.js` | Add getter function here to retrieve constant |
| `/src/store/mutations.js` | Add setter function here to update constant |
| `/src/store/state.js` | Add your constant variable here |

### Example creation of Api endpoint
For an example implementation view commit [7b74a094](https://openlab.ncl.ac.uk/gitlab/thinkactive.io/thinkactive.io-web-2/commit/7b74a094961e48a41b84ec922a7dcd1ea90cd7d3)

## Deployment

The app uses Docker to deploy the app. When you set the version using `npm version ...`
it will automatically build and push a new version of the app to the docker registry.
To do this is uses the [Dockerfile](/Dockerfile) to build the web assets and then runs [Nginx](https://www.nginx.com/) to server the generated files. To tag the docker image it uses the [REGISTRY](/REGISTRY) file and the [package.json](/package.json)'s version.

## Dev commands

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm test
```

## Deployment Build

This repo uses a CI to build the web into a docker image, ready to be deployed.
Whenever a commit is pushed with an git tag it builds an image for that commit.
To tag the commit, use the `npm version ...` command which updates the package
version and commits the `package.json` tagged with the new version.

```bash
# Update the npm version
# > Make sure to run without unstaged changes
npm version # patch | minor | major | prepatch | preminor | prerelease
```

**Extras**

```bash
# If using a dist-tag i.e. beta, use `npm prerelease` to increment subversions
npm version 1.0.0-beta.1  # 1.0.0-beta.1
npm version prerelease    # 1.0.0-beta.2

# To experiment with npm version
mkdir test_dir
cd test_dir
npm init -y
npm version # ...
```

## Deployment Config

To configure the deployment, use the `CONFIG_KEYS` environment variable.
Which should be a csv of environment variables you want inserted,
the variables are inserted at `window.CONFIG.YOUR_VAR`.

You should use the [ConfigMixin](/src/mixins/ConfigMixin.js) to access variables which falls back to `process.env` (where webpack config is).

```yml
environment:
  CONFIG_KEYS: MOCK_API,API_URL
  API_URL: https://api.thinkactive.io
  MOCK_API: true
```

For more about the deployment see the [stack repo](https://openlab.ncl.ac.uk/gitlab/thinkactive.io/thinkactive.io-stack).

---

For a detailed explanation on how the project was setup, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
