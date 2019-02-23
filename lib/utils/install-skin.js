const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const ora = require('ora')
const walkDirSync = require('./walk')
const config = require('./config')
const emoji = require('./emoji')

async function installSkin (state) {
  console.log(chalk.green('[airforsteam] Prepping skin for install by applying configuration.'))
  const squareAvatarsDisplay = state.get('squareAvatars') ? 'Yes' : 'No'
  console.log(chalk.green(`[airforsteam] Theme: ${state.get('theme')}. Color: ${state.get('color')}. Square Avatars: ${squareAvatarsDisplay}.`))

  const directoryToConfigure = (state.editExisting) ? state.get('installLocation') : state.get('downloadLocation')
  state.set('installLocation', path.resolve(state.get('steamSkinFolder'), 'Air-for-Steam'))

  // setup the setupLocation
  let progress = ora(`Copying skin to temporary directory for configuration...`)
  progress.start()
  await fs.emptyDir(state.get('setupLocation'))
  await fs.copy(directoryToConfigure, state.get('setupLocation')).finally(() => { progress.stop() })

  // apply Theme files
  await applyThemeFiles(state)

  // apply Square Avatars if selected
  await applySquareAvatarFiles(state)

  // apply options to Air-for-Steam's config.ini
  applyConfig(state)

  // Install!
  progress = ora(`Installing skin to: ${state.get('installLocation')}`)
  progress.start()
  await fs.emptyDir(state.get('installLocation'))
  await fs.copy(state.get('setupLocation'), state.get('installLocation'))
    .then(() => {
      if (state.get('downloadVersion') !== '') {
        state.set('version', state.get('downloadVersion'))
      }
      progress.succeed(chalk.green(`[airforsteam] Successfully installed ${state.get('version')}! ` + emoji(':tada:')))
    }).catch((err) => {
      progress.stop()
      throw err
    })

  // cleanup tmp local files
  await fs.remove(state.get('setupLocation'))

  // update state
  state.set('firstRun', false)

  // persist state to config
  config.persist(state)

  // notify user of necessary actions remaining
  if (state.get('version') === '') {
    console.log(chalk.yellow('Don\'t forget to enable the Air-for-Steam skin in Steam > Settings > Interface > Skin'))
  } else {
    console.log(chalk.yellow('Please restart Steam!'))
  }
}
function applyConfig (state) {
  const skinConfigFile = path.resolve(state.get('setupLocation'), 'config.ini')
  const colorFile = `/${state.get('color')}.styles`
  const themeFile = `/_${state.get('theme').toLowerCase()}.styles`
  let colorApplied = false
  let themeApplied = false
  const skinConfig = fs.readFileSync(skinConfigFile, 'utf-8')
    .split('\n')
    .map((line) => {
      line = line.trimRight()
      // only care about theme/color options
      const isValidLine = line.includes('resource/themes/') || line.includes('resource/colors/')
      const isConfiguredLine = isValidLine && (line.includes(colorFile) || line.includes(themeFile))
      const isDisabledLine = /^[\s]*\/\/[\s]*include.*/.test(line)

      if (state.get('debug')) {
        console.log(line)
        console.log(`valid: ${isValidLine}, configured: ${isConfiguredLine}, disabled: ${isDisabledLine}`)
      }

      // ignore lines we don't need to modify
      if (!isValidLine) {
        return line
      }

      // disable lines that don't meet user config
      if (!isConfiguredLine && !isDisabledLine) {
        return disableLine(line)
      }

      // enable lines that do meet user config
      if (isConfiguredLine) {
        (isValidLine && line.includes(themeFile)) ? themeApplied = true : colorApplied = true
        if (isDisabledLine) {
          return enableLine(line)
        }
      }

      return line
    })

  if (!colorApplied) {
    console.error(chalk.red(`Invalid color option: ${state.get('color')}`))
  }

  if (!themeApplied) {
    console.error(chalk.red(`Invalid theme option: ${state.get('theme')}`))
  }

  if (!colorApplied || !themeApplied) {
    process.exit(1)
  }
  fs.writeFileSync(skinConfigFile, skinConfig.join('\r\n'))
}

function disableLine (line) {
  return line.replace(/^(\s*)*(include)/, (match, p1, p2) => `${p1}//${p2}`)
}

function enableLine (line) {
  return line.replace(/(\/\/)(.*include.*)/, (match, p1, p2) => p2)
}

async function applyThemeFiles (state) {
  // e.g. +Extras/Themes/Dark
  const subDirectory = path.join(state.get('airDirectories').themes, state.get('theme'))
  const directory = path.resolve(state.get('setupLocation'), subDirectory)

  if (!fs.existsSync(directory)) {
    throw new Error('out-of-date')
  }

  const progress = ora(`Copying files from ${subDirectory}`)
  progress.start()

  const files = walkDirSync(directory)
  const writes = []

  files.forEach((from) => {
    const to = from.replace(subDirectory + path.sep, '')
    writes.push(fs.copyFile(from, to))
  })
  await Promise.all(writes)
    .then(() => {
      progress.succeed(chalk.green(`[airforsteam] Successfully applied files from ${subDirectory}! ` + emoji(':tada:')))
    })
    .catch((err) => {
      progress.stop()
      throw err
    })
}

async function applySquareAvatarFiles (state) {
  if (!state.get('squareAvatars')) {
    return
  }
  // e.g. +Extras/Square Avatars/Dark
  const subDirectory = path.join(state.get('airDirectories').squareAvatars, state.get('theme'))
  const directory = path.resolve(state.get('setupLocation'), subDirectory)

  if (!fs.existsSync(directory)) {
    throw new Error('out-of-date')
  }

  const progress = ora(`Copying files from ${subDirectory}`)
  progress.start()

  const files = walkDirSync(directory)
  const writes = []

  files.forEach((from) => {
    const to = from.replace(subDirectory + path.sep, 'Graphics/')
    writes.push(fs.copyFile(from, to))
  })
  writes.push(fs.remove(path.join(directory, 'Graphics', 'avatarBorderNotificationDesktop.tga')))
  writes.push(fs.remove(path.join(directory, 'Graphics', 'avatarBorderNotificationOverlay.tga')))
  await Promise.all(writes)
    .then(() => {
      progress.succeed(chalk.green(`[airforsteam] Successfully applied files from ${subDirectory}! ` + emoji(':tada:')))
    })
    .catch((err) => {
      progress.stop()
      throw err
    })
}

module.exports = installSkin
