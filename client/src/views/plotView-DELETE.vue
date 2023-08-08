<template>
  <v-container>
    <v-row>
      <v-col>
        <Plot />
      </v-col>
      <v-col>tools</v-col>
    </v-row>
  
</v-container>
</template>

<script>
import { defineComponent } from 'vue';

// Componentsw

import Plot from '../components/plot.vue';

export default defineComponent({
  name: 'svgView',

  components: {
    Plot
},
});
</script>
