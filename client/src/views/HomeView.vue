<template>
  <overview />
</template>

<script>
import { defineComponent } from 'vue';

// Components
import overview from '../components/overview.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    overview,
  },
});
</script>
