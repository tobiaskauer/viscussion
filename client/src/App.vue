<template>
  <v-app>
    <v-app-bar app color="primary" >
      <v-toolbar-title><router-link to="/">viscussion</router-link></v-toolbar-title>

</v-app-bar>
    <v-main>
        <router-view/>
    </v-main>
    <v-footer>Footer</v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
}
</script>
