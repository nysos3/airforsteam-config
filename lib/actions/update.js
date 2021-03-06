import chalk from 'chalk'
import repoHelper from '../utils/repo-helper'
import emoji from '../utils/emoji'
import installSkin from '../utils/install-skin'

async function update (state) {
  const updateAvailable = await repoHelper.updateAvailable(state)

  if (!updateAvailable) {
    console.log(chalk.green(`[airforsteam] You're already up-to-date with the latest Air-for-Steam version, ${state.get('version')}! ` + emoji(':smile:')))
    return true
  }

  await repoHelper.download(state)

  await installSkin(state)

  state.pr()
}

export default update
