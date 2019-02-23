const chalk = require('chalk')
const confirmFontsInstalled = require('../utils/font-helper')
const repoHelper = require('../utils/repo-helper')
const emoji = require('../utils/emoji')
const configure = require('./configure')

async function setup (state) {
  const latestVersion = await repoHelper.getVersion(state)
  console.log(chalk.green(`[airforsteam] Looks like this is your first time using this tool! Welcome! ` + emoji(':smile:')))
  console.log(chalk.green(`[airforsteam] We'll start by downloading the latest version, ${latestVersion}.`))

  // download from airforsteam github
  await repoHelper.download(state)

  // confirm user has installed required fonts
  await confirmFontsInstalled(state)

  // interactively get desired configuration from user
  // this also applies the selected configurations
  await configure(state)
}

module.exports = setup
