<template>
  <svgTrace />
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
