<template>
  <v-container>
    <v-row>
      <v-col>
        <Vega />
      </v-col>
      <v-col>tools</v-col>
    </v-row>
  
</v-container>
</template>

<script>
import { defineComponent } from 'vue';

// Componentsw

import Vega from '../components/vega.vue';

export default defineComponent({
  name: 'svgView',

  components: {
    Vega
},
});
</script>
