import path from 'path'
import extend from 'xtend'
import debug from './debug'

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
  availableColors: {
    sky: 'Material Blue',
    sea: 'Material Teal',
    breeze: 'Material Light Blue',
    slate: 'Material Blue Grey',
    truffle: 'Dark Brown',
    gunmetal: 'Black',
    silver: 'Material Grey',
    grass: 'Material Green',
    rose: 'Material Pink',
    cinnabar: 'Material Red',
    lavender: 'Material Indigo',
    lilac: 'Material Deep Purple (Kinda)',
    deeppurple: 'Material Deep Purple (For real)',
    steamblue: 'Steam Blue (Recommended for Blue Theme)',
    youtubered: 'YouTube Red',
    numix: 'Contributed by Markus-Deviant (markus-deviant.deviantart.com), Numix Project by Satyajit (satya164.deviantart.com)',
    happyorange: 'Contributed by Xanoxis',
    emerald: 'Contributed by Jarlave',
    google: 'Contributed by CorruptComputer',
    materialblue: 'Contributed by iavenjqasdf',
    spotify: 'Spotify Green. Contributed by Mamulokki',
    deepblue: 'Contributed by Absolute Zero',
    'kdeplasma5-darkbreeze': 'Contributed by plata',
    pixeldark: 'Contributed by snowtyler',
    nord: 'Contributed by freeek3',
  },
  availableThemes: ['Dark', 'Blue', 'Light'],
}

function init (state, userOptions) {
  Object.keys(userOptions).forEach((key) => {
    state.set(key, userOptions[key])
  })

  return state
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

export default state
