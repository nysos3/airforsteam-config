<template>
<v-app>
  <v-toolbar app>
    <v-toolbar-title class="headline text-uppercase">
      <span>Air-for-Steam</span> &nbsp;
      <span class="font-weight-light">Configuration</span>
    </v-toolbar-title>
    <v-spacer />
    <v-btn
      flat
      href="https://github.com/nysos3/airforsteam-cli/releases/latest"
      target="_blank"
    >
      <span class="mr-2">Latest Release</span>
    </v-btn>
  </v-toolbar>

  <v-content>
    <the-home />
  </v-content>
</v-app>
</template>

<script>
import TheHome from './components/TheHome'

export default {
  name: 'App',
  components: {
    TheHome,
  },
  data () {
    return {
      //
    }
  },
}
</script>
