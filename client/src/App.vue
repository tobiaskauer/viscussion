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

<style scoped>
  a {
    font-weight: bold;
    color: white;
    text-decoration: none;
  }
</style>

<style>
.plain {background: rgba(var(--v-theme-plain), 1)}
.observation {background: rgba(var(--v-theme-problem), 1)}
.hypothesis {background: rgba(var(--v-theme-hypothesis), 1)}
.question {background: rgba(var(--v-theme-question), 1)}
.problem {background: rgba(var(--v-theme-problem), 1)}
.context {background: rgba(var(--v-theme-context), 1)}
.personal {background: rgba(var(--v-theme-personal), 1)}
.optinion {background: rgba(var(--v-theme-opinion), 1)}
</style>
