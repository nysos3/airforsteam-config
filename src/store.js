import Vue from 'vue'
import Vuex from 'vuex'
import initState from '../lib/utils/state'
import config from '../lib/utils/config'
import { ipcRenderer } from 'electron'

const cliState = initState({})
config.init(cliState)
const cliStateProps = {
  firstRun: cliState.get('firstRun'),
  version: cliState.get('version'),
  repoInfo: cliState.get('repoInfo'),
  steamSkinFolder: cliState.get('steamSkinFolder'),
  squareAvatars: cliState.get('squareAvatars'),
  theme: cliState.get('theme'),
  color: cliState.get('color'),
  availableColors: cliState.get('availableColors'),
  availableThemes: cliState.get('availableThemes'),
}
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cliState: cliStateProps,
  },
  mutations: {
    updateColor (state, color) {
      state.cliState.color = color
      cliState.set('color', color)
    },
    updateTheme (state, theme) {
      state.cliState.theme = theme
      cliState.set('theme', theme)
    },
    updateSquareAvatars (state, squareAvatars) {
      state.cliState.squareAvatars = squareAvatars
      cliState.set('squareAvatars', squareAvatars)
    },
    updateSteamSkinFolder (state, steamSkinFolder) {
      state.cliState.steamSkinFolder = steamSkinFolder
      cliState.set('steamSkinFolder', steamSkinFolder)
    },
  },
  actions: {
    installSkin ({ state }) {
      return new Promise((resolve, reject) => {
        ipcRenderer.on('skin-installed', (event, arg) => {
          resolve()
        })
        ipcRenderer.on('skin-install-failed', (event, arg) => {
          reject(arg)
        })
        ipcRenderer.send('install-skin', JSON.parse(JSON.stringify(state.cliState)))
      })
    },
  },
})
