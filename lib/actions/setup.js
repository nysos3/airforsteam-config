import chalk from 'chalk'
import confirmFontsInstalled from '../utils/font-helper'
import repoHelper from '../utils/repo-helper'
import emoji from '../utils/emoji'
import configure from './configure'

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

export default setup
