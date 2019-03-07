<template>
<v-container
  fluid
  fill-height
>
  <v-layout
    align-center
    justify-center
  >
    <v-flex
      xs12
    >
      <v-card class="elevation-12">
        <v-toolbar
          dark
          color="primary"
        >
          <v-toolbar-title>Options</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-select
              v-model="theme"
              :items="cliState.availableThemes"
              :error-messages="errors.theme"
              label="Theme"
            />
            <v-select
              v-model="color"
              :items="colors"
              :error-messages="errors.color"
              label="Color"
            />
            <v-select
              v-model="squareAvatars"
              :items="[{ text: 'Yes', value: true }, { text: 'No', value: false }]"
              :error-messages="errors.squareAvatars"
              label="Square Avatars"
            />
            <v-text-field
              v-model="steamSkinFolder"
              label="Steam Skin Folder"
              type="text"
              append-outer-icon="fas fa-folder-open"
              :error-messages="errors.steamSkinFolder"
              @click:append-outer="selectSteamSkinFolder"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            :loading="installing"
            @click="install"
          >
            {{ cliState.firstRun ? 'Install' : 'Update' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { remote } from 'electron'
import os from 'os'
import path from 'path'
import fs from 'fs'
import { getConfigHome } from 'platform-folders'

export default {
  data: () => ({
    errors: {
      theme: [],
      color: [],
      squareAvatars: [],
      steamSkinFolder: [],
    },
    installing: false,
  }),
  computed: {
    ...mapState(['cliState']),
    colors () {
      const availableColors = JSON.parse(JSON.stringify(this.cliState.availableColors))

      if (this.theme !== 'Dark') {
        delete availableColors.spotify
        delete availableColors.deepblue
        delete availableColors['kdeplasma5-darkbreeze']
        delete availableColors.pixeldark
      }

      return Object.keys(availableColors).map((value) => {
        const text = `${value}: ${availableColors[value]}`

        return {
          text,
          value,
        }
      })
    },
    theme: {
      get () {
        return this.cliState.theme
      },
      set (val) {
        return this.updateTheme(val)
      },
    },
    color: {
      get () {
        return this.cliState.color
      },
      set (val) {
        return this.updateColor(val)
      },
    },
    squareAvatars: {
      get () {
        return this.cliState.squareAvatars
      },
      set (val) {
        return this.updateSquareAvatars(val)
      },
    },
    steamSkinFolder: {
      get () {
        return this.cliState.steamSkinFolder
      },
      set (val) {
        return this.updateSteamSkinFolder(val)
      },
    },
  },
  methods: {
    ...mapMutations(['updateTheme', 'updateColor', 'updateSquareAvatars', 'updateSteamSkinFolder']),
    ...mapActions(['installSkin']),
    selectSteamSkinFolder () {
      let defaultPath = JSON.parse(JSON.stringify(this.steamSkinFolder))
      if (defaultPath === '') {
        if (os.type() === 'Darwin') {
          defaultPath = path.resolve(getConfigHome(), 'Steam', 'Steam.AppBundle', 'Steam', 'Contents', 'MacOS', 'skins')
        } else if (os.type() === 'Windows_NT') {
          defaultPath = 'C:\\Program Files (x86)\\Steam\\skins'
        } else if (os.type() === 'Linux') {
          defaultPath = path.resolve(os.userInfo().homedir, '.steam/skins')
        }

        if (!fs.existsSync(defaultPath)) {
          defaultPath = ''
        }
      }
      remote.dialog.showOpenDialog({ properties: ['openDirectory'], defaultPath }, (filePaths) => {
        if (filePaths && filePaths.length > 0) {
          this.steamSkinFolder = filePaths[0]
        }
      })
    },
    async install () {
      this.errors.theme = []
      this.errors.color = []
      this.errors.squareAvatars = []
      this.errors.steamSkinFolder = []
      let hasError = false
      if (!Object.keys(this.cliState.availableColors).includes(this.cliState.color)) {
        this.errors.color = ['Invalid!']
        hasError = true
      }
      if (!this.cliState.availableThemes.includes(this.cliState.theme)) {
        this.errors.theme = ['Invalid!']
        hasError = true
      }
      if (![true, false].includes(this.cliState.squareAvatars)) {
        this.errors.squareAvatars = ['Invalid!']
        hasError = true
      }
      if (!fs.existsSync(this.steamSkinFolder)) {
        this.errors.steamSkinFolder = ['Invalid!']
        hasError = true
      }
      if (hasError) {
        return false
      }
      this.installing = true
      await this.installSkin()

      let response = 'Please restart Steam!'

      if (this.cliState.firstRun) {
        response = 'Don\'t forget to enable the Air-for-Steam skin in Steam > Settings > Interface > Skin'
      }
      this.installing = false
      this.$nextTick(() => {
        alert(response)
      })
    },
  },
}
</script>

<style>

</style>
