const os = require('os')
const path = require('path')
const fs = require('fs-extra')
const fontManager = require('font-manager')
const chalk = require('chalk')
const execa = require('execa')
const inquirer = require('inquirer')
const emoji = require('./emoji')

const skinFonts = {
  'Air-Classic': {
    names: [
      'RobotoCondensed-Regular',
      'RobotoCondensed-Light',
      'RobotoCondensed-Bold',
      'RobotoCondensed-Italic',
    ],
    files: {
      'RobotoCondensed-Regular': 'RobotoCondensed-Regular.ttf',
      'RobotoCondensed-Light': 'RobotoCondensed-Light.ttf',
      'RobotoCondensed-Bold': 'RobotoCondensed-Bold.ttf',
      'RobotoCondensed-Italic': 'RobotoCondensed-Italic.ttf',
    },
    path: 'Fonts',
    search: [
      { family: 'Roboto Condensed' },
      { family: 'Roboto Condensed', italic: true },
    ],
  },
  'Air-for-Steam': {
    names: [
      'Roboto-Regular',
      'Roboto-Medium',
      'Roboto-Bold',
      'Roboto-Italic',
      'RobotoCondensed-Regular',
    ],
    path: path.join('+Extras', 'Fonts'),
    files: {
      'Roboto-Regular': 'Roboto-Regular.ttf',
      'Roboto-Medium': 'Roboto-Medium.ttf',
      'Roboto-Bold': 'Roboto-Bold.ttf',
      'Roboto-Italic': 'Roboto-Italic.ttf',
      'RobotoCondensed-Regular': 'Roboto Condensed-Regular.ttf',
    },
    search: [
      { family: 'Roboto' },
      { family: 'Roboto', italic: true },
      { family: 'Roboto Condensed' },
    ],
  },
}

async function init (state, force = false) {
  if (!state.get('firstRun') && !force) {
    return true
  }
  console.log(chalk.green('[airforsteam] Checking that the required fonts are installed. ' + emoji(':thinking_face:')))
  if (os.type() === 'Linux') {
    console.log(chalk.green('[airforsteam] ' + emoji(':heart_eyes:') + ' Hello Linux user! Unfortunately font detection is not available for Linux at this time.'))
    console.log(chalk.green('[airforsteam] Please make sure you have the required fonts installed on your system! ' + emoji(':heart:')))
    return true
  }
  const skin = state.get('skin')
  const fontConfig = skinFonts[skin]
  let installedFonts = {}

  fontConfig.search.forEach((fontSearch) => {
    fontManager.findFontsSync(fontSearch).forEach((font) => { installedFonts[font.postscriptName] = font })
  })
  installedFonts = Object.keys(installedFonts)

  let missingFonts = false
  fontConfig.names.forEach((font) => {
    if (!installedFonts.includes(font)) {
      missingFonts = true
      console.log(chalk.red(`[airforsteam] Missing the required font '${fontConfig.files[font]}'! Please install this font.`))
    }
  })

  if (missingFonts && state.get('downloadLocation') !== '') {
    const fontLocation = path.join(state.get('downloadLocation'), fontConfig.path)
    if (!fs.existsSync(fontLocation)) {
      throw new Error('out-of-date')
    }
    await inquirer.prompt([
      {
        name: 'open',
        message: 'Would you like to open the folder containing the fonts?',
        type: 'confirm',
        default: true,
      },
    ]).then((answers) => {
      if (answers.open) {
        const viewApp = os.type() === 'Darwin' ? 'open' : 'explorer'
        execa.shellSync(`${viewApp} ${fontLocation}`)
      } else {
        console.log(chalk.green(`[airforsteam] The missing fonts can be found here:`))
        console.log(chalk.green(`[airforsteam] ${fontLocation}`))
        console.log(chalk.green(`[airforsteam]` + emoji(' :warning: ') + `Please install the fonts before enabling the skin in Steam!`) + emoji(' :warning:'))
      }
    })
  }

  if (!missingFonts) {
    console.log(chalk.green('[airforsteam] Required fonts are already installed! ' + emoji(':heart:')))
  }

  return missingFonts
}

module.exports = init
