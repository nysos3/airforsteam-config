import repoHelper from '../utils/repo-helper'
import installSkin from '../utils/install-skin'

async function reinstallSkin (state) {
  await repoHelper.download(state)

  await installSkin(state)
}

export default reinstallSkin
