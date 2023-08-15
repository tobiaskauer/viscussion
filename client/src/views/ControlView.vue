<template>
  <control />
</template>

<script>
import { defineComponent } from 'vue';

// Components
import control from '../components/control.vue';

export default defineComponent({
  name: 'ControlView',

  components: {
    control,
  },
});
</script>
