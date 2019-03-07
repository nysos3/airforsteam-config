import path from 'path'
import etl from 'etl'
import fs from 'fs-extra'
import unzipper from 'unzipper'
import axios from 'axios'
import ora from 'ora'
import chalk from 'chalk'
import emoji from './emoji'

async function init (state) {
  const repoInfo = await getInfo(state)
  state.set('setupLocation', path.join(state.get('configDir'), 'setup', state.get('skin') + '-' + repoInfo.tag_name))
  state.set('downloadLocation', path.join(state.get('configDir'), 'downloads', state.get('skin') + '-' + repoInfo.tag_name))
}

async function download (state) {
  await init(state)
  // Don't download again if already downloaded before
  if (!await updateAvailable(state) && fs.existsSync(path.resolve(state.get('downloadLocation'), 'config.ini'))) {
    return true
  }

  await fs.emptyDir(state.get('downloadLocation'))

  const progress = ora(`Downloading from ${state.get('repoInfo').html_url}`)
  progress.start()
  await axios({
    url: state.get('repoInfo').zipball_url,
    method: 'GET',
    responseType: 'stream',
  }).then(async (response) => {
    await new Promise((resolve, reject) => {
      let rootDir = ''
      response.data.pipe(unzipper.Parse())
        .pipe(etl.map(async (entry) => {
          if (rootDir === '' && entry.type === 'Directory') {
            rootDir = entry.path
            entry.autodrain()
          } else {
            const entryPath = state.get('downloadLocation') + path.sep + entry.path.replace(rootDir, '')
            if (entry.type === 'Directory') {
              await fs.ensureDir(entryPath)
              entry.autodrain()
            } else {
              const content = await entry.buffer()
              await fs.writeFile(entryPath, content)
            }
          }
        }))
        .on('finish', resolve)
        .on('error', reject)
    })
  }).then(() => {
    progress.succeed(chalk.green(`[airforsteam] Successfully downloaded ${state.get('repoInfo').tag_name}! ` + emoji(':tada:')))
  }).catch((err) => {
    progress.stop()
    throw err
  })
  state.set('downloadVersion', state.get('repoInfo').tag_name)
}

async function getVersion (state) {
  const repoInfo = await getInfo(state)

  return repoInfo.tag_name
}

async function getInfo (state, force = false) {
  if (Object.keys(state.get('repoInfo')).length !== 0 && !force) {
    return state.get('repoInfo')
  }
  if (state.get('debug')) {
    console.log(chalk.yellow('CALLING GITHUB API'))
  }
  const repo = `https://api.github.com/repos/airforsteam/${state.get('skin')}/releases/latest`
  const repoInfo = await axios.get(repo).then((response) => {
    state.set('repoInfo', response.data)
    return response.data
  })
  return repoInfo
}

async function updateAvailable (state) {
  const currentVersion = state.get('version')
  const repoInfo = await getInfo(state, true)
  const latestVersion = repoInfo.tag_name

  return (currentVersion !== latestVersion)
}

const repos = {
  init,
  download,
  getVersion,
  getInfo,
  updateAvailable,
}

export default repos
export { repos }
