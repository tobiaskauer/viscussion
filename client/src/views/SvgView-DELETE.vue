<template>
  <v-container>
    <v-row>
      <v-col style="border: 1px solid black">
        <svgTrace />
      </v-col>
      <v-col>tools</v-col>
    </v-row>
  
</v-container>
</template>

<script>
import { defineComponent } from 'vue';

// Componentsw
import svgTrace from '../components/svgTrace.vue';

export default defineComponent({
  name: 'svgView',

  components: {
    svgTrace,
  },
});
</script>
