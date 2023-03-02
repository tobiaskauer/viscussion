<template>
  <v-app>
    <v-app-bar app color="primary" >
      <v-toolbar-title>viscussion.</v-toolbar-title>

</v-app-bar>
    <v-main>
      <v-container>
        <router-view/>
      </v-container>
      
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
