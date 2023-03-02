<template>
  <ImageView />
</template>

<script>
import { defineComponent } from 'vue';

// Components
import ImageView from '../components/viewContainer.vue';

export default defineComponent({
  name: 'imageView',

  components: {
    ImageView,
  },
});
</script>
