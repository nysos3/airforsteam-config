const path = require('path')
const extend = require('xtend')
const debug = require('./debug')

const defaults = {
  firstRun: false,
  skin: 'Air-for-Steam',
  update: false,
  editExisting: false,
  outputConfig: false,
  reInstall: false,
  debug: false,
  configDir: '',
  configFile: '',
  version: '',
  repoInfo: {},
  downloadLocation: '',
  installLocation: '',
  steamSkinFolder: '',
  setupLocation: '',
  downloadVersion: '',
  airDirectories: {
    fonts: path.join('+Extras', 'Fonts'), // also update ../utils/font-helper.js for font detection
    squareAvatars: path.join('+Extras', 'Square Avatars'),
    themes: path.join('+Extras', 'Themes'),
  },
  squareAvatars: false,
  theme: 'Dark',
  color: 'sky',
}

function init (state, userOptions) {
  return new Promise((resolve, reject) => {
    Object.keys(userOptions).forEach((key) => {
      state.set(key, userOptions[key])
    })

    return resolve(state)
  })
}

function state (userOptions) {
  const realState = extend(defaults)

  function get (key) {
    if (!realState.hasOwnProperty(key)) {
      throw new Error(`invalid property '${key}'`)
    }
    return realState[key]
  }

  function set (key, value) {
    if (get('debug')) {
      debug('set key', key, 'to value', value)
    }

    if (realState.hasOwnProperty(key)) {
      realState[key] = value
    } else {
      throw new Error(`invalid property '${key}'`)
    }
  }

  function pr () {
    if (get('debug')) {
      debug(all())
    }
  }

  function all () {
    return realState
  }

  const state = {
    get: get,
    set: set,
    all,
    pr,
  }

  return init(state, userOptions)
}
module.exports = state
