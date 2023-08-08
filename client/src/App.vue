<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-toolbar-title><router-link to="/">viscussion</router-link></v-toolbar-title>

    </v-app-bar>
    <v-main>
      <router-view />
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
.cat-plain {
  //background: rgba(var(--v-theme-plain), .1);
  //border: 2px solid rgb(var(--v-theme-plain));
  background: rgba(0, 0, 255, .1);

}

.cat-new {
  background: rgba(var(--v-theme-new), .1);
  border: 2px solid rgb(var(--v-theme-new));
}

.cat-obs {
  background: rgba(var(--v-theme-observation), .1);
  border: 2px solid rgb(var(--v-theme-observation));
}

.cat-hyp {
  background: rgba(var(--v-theme-hypothesis), .1);
  border: 2px solid rgb(var(--v-theme-hypothesis));
}

.cat-que {
  background: rgba(var(--v-theme-question), .1);
  border: 2px solid rgb(var(--v-theme-question));
}

.cat-con {
  background: rgba(var(--v-theme-context), .1);
  border: 2px solid rgb(var(--v-theme-context));
}

.cat-per {
  background: rgba(var(--v-theme-personal), .1);
  border: 2px solid rgb(var(--v-theme-personal));
}

.cat-opi {
  background: rgba(var(--v-theme-opinion), .1);
  border: 2px solid rgb(var(--v-theme-opinion));
}

.cat-cri {
  background: rgba(var(--v-theme-critique), .1);
  border: 2px solid rgb(var(--v-theme-critique));
}

.cat-plain,
.cat-new,
.cat-obs,
.cat-hyp,
.cat-que,
.cat-con,
.cat-per,
.cat-opi,
.cat-cri {
  border: none;
}
</style>
