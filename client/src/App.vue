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
.cat-plain {background: rgba(var(--v-theme-plain), .1); border: 2px solid rgb(var(--v-theme-plain));}
.cat-obs {background: rgba(var(--v-theme-problem), .1); border: 2px solid rgb(var(--v-theme-problem));}
.cat-hyp {background: rgba(var(--v-theme-hypothesis), .1); border: 2px solid rgb(var(--v-theme-hypothesis));}
.cat-que {background: rgba(var(--v-theme-question), .1); border: 2px solid rgb(var(--v-theme-question));}
.cat-pro {background: rgba(var(--v-theme-problem), .1); border: 2px solid rgb(var(--v-theme-problem));}
.cat-con {background: rgba(var(--v-theme-context), .1); border: 2px solid rgb(var(--v-theme-context));}
.cat-per {background: rgba(var(--v-theme-personal), .1); border: 2px solid rgb(var(--v-theme-personal));}
.cat-opi {background: rgba(var(--v-theme-opinion), .1); border: 2px solid rgb(var(--v-theme-opinion));}
.cat-cri {background: rgba(var(--v-theme-critique), .1); border: 2px solid rgb(var(--v-theme-critique));}
</style>
