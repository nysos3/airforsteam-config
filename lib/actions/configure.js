import os from 'os'
import path from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { getConfigHome } from 'platform-folders'
import emoji from '../utils/emoji'
import installSkin from '../utils/install-skin'
import repoHelper from '../utils/repo-helper'

async function configure (state) {
  // download from airforsteam github
  await repoHelper.download(state)
  // get options from the user
  await askForTheme(state)
  await askForColor(state)

  if (!state.get('editExisting')) {
    await askForInstallPath(state)
  }

  // install skin with selected options
  await installSkin(state)

  state.pr()
}

function askForTheme (state) {
  return inquirer.prompt([
    {
      name: 'theme',
      message: `Select a theme:`,
      type: 'list',
      choices: state.get('availableThemes'),
      default: state.get('theme'),
    },
    {
      name: 'squareAvatars',
      message: `Do you want square avatars?`,
      type: 'list',
      choices: ['Yes', 'No'],
      default: (state.get('squareAvatars')) ? 'Yes' : 'No',
    },
  ]).then((answers) => {
    state.set('theme', answers.theme)
    state.set('squareAvatars', (answers.squareAvatars === 'Yes'))
  })
}

function askForColor (state) {
  const availableColors = state.get('availableColors')

  if (state.get('theme') !== 'Dark') {
    delete availableColors.spotify
    delete availableColors.deepblue
    delete availableColors['kdeplasma5-darkbreeze']
    delete availableColors.pixeldark
  }

  const padLength = Object.keys(availableColors).reduce((a, b) => {
    return a.length > b.length ? a : b
  }).length + 4

  let defaultColor = ''
  const colorChoices = Object.keys(availableColors).map((color) => {
    const description = availableColors[color]
    const colorDisplayText = `${color}:`.padEnd(padLength, ' ') + description

    if (color === state.get('color')) {
      defaultColor = colorDisplayText
    }

    return colorDisplayText
  })

  return inquirer.prompt([
    {
      name: 'color',
      message: `Select a color! preview: https://goo.gl/photos/cbUrMoKkugFDCt7F8`,
      type: 'list',
      choices: colorChoices,
      default: defaultColor,
      pageSize: process.stdout.rows - 2,
      filter: function (val) {
        return val.split(':')[0]
      },
    },
  ]).then((answers) => {
    state.set('color', answers.color)
  })
}

async function askForInstallPath (state) {
  let defaultLocation = state.get('steamSkinFolder')

  if (defaultLocation === '') {
    if (os.type() === 'Darwin') {
      defaultLocation = path.resolve(getConfigHome(), 'Steam', 'Steam.AppBundle', 'Steam', 'Contents', 'MacOS', 'skins')
    } else if (os.type() === 'Windows_NT') {
      defaultLocation = 'C:\\Program Files (x86)\\Steam\\skins'
    } else if (os.type() === 'Linux') {
      defaultLocation = path.resolve(os.userInfo().homedir, '.steam/skins')
    }

    if (!fs.existsSync(defaultLocation)) {
      defaultLocation = ''
    }
  }

  const answers = await inquirer.prompt([{
    name: 'steamSkinFolder',
    type: 'input',
    message: `Steam Skin Folder:`,
    itemType: 'directory',
    default: defaultLocation,
  }])

  if (!fs.existsSync(answers.steamSkinFolder)) {
    console.log(chalk.red('[airforsteam]' + emoji(' :anguished: ') + 'It looks like the path you supplied does not exist! Please try again.'))

    return askForInstallPath(state)
  } else {
    state.set('steamSkinFolder', answers.steamSkinFolder)
  }
}

export default configure
