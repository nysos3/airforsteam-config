import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import extend from 'xtend'
import appData from './app-data'

function init (state) {
  if (JSON.stringify(read(state)) === '{}' || JSON.stringify(read(state)) === '') {
    // configFile doesn't exist. assume first run of cli
    state.set('firstRun', true)
    // write firstRun to config file, to treat as first run
    // in the event that the first run is not completed successfully
    write(state, { firstRun: true })
  } else {
    // configFile exists, merge into state
    load(state)
  }
}

function determineLocation (state) {
  const configDir = appData('airforsteam-cli')
  if (state.get('configDir') !== '') {
    return
  }
  state.set('configDir', configDir)
  state.set('configFile', path.resolve(configDir, 'config.json'))
}

// read & return the contents of the config file
function read (state) {
  // populate state with configDir && configFile vars
  determineLocation(state)

  fs.ensureDirSync(state.get('configDir'))
  if (!fs.existsSync(state.get('configFile'))) {
    return {}
  }
  try {
    return JSON.parse(fs.readFileSync(state.get('configFile')))
  } catch (e) {
    return {}
  }
}

function readAnonymous (state) {
  let config = JSON.stringify(read(state))
    .split(appData('airforsteam-cli'))
    .join('CONFIG_DIR_REMOVED_FOR_PRIVACY')
  if (state.get('installLocation') !== '') {
    config = config.split(state.get('installLocation'))
      .join('INSTALL_DIR_REMOVED_FOR_PRIVACY')
  }

  return config
}

// merge the config file into state
function load (state) {
  const currentConfig = read(state)
  Object.keys(currentConfig).map((key) => { state.set(key, currentConfig[key]) })
}

// save non-ephemeral state values to config file
function persist (state) {
  const currentConfig = read(state)
  const stateToPersist = {
    firstRun: state.get('firstRun'),
    version: state.get('version'),
    downloadLocation: state.get('downloadLocation'),
    installLocation: state.get('installLocation'),
    setupLocation: state.get('setupLocation'),
    steamSkinFolder: state.get('steamSkinFolder'),
    squareAvatars: state.get('squareAvatars'),
    theme: state.get('theme'),
    color: state.get('color'),
    // todo update list
  }

  const combinedConfig = extend(currentConfig, stateToPersist)
  const ret = write(state, combinedConfig)
  console.log(chalk.green(`[airforsteam] Config saved to ${state.get('configFile')}`))
  return ret
}

function write (state, data) {
  return fs.writeFileSync(state.get('configFile'), JSON.stringify(data, null, 2))
}

const config = {
  init,
  read,
  readAnonymous,
  load,
  persist,
  write,
}

export default config
export { config }
