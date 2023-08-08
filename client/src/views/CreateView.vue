<template>
  <createForm />
</template>

<script>
import { defineComponent } from 'vue';

// Components
import createForm from '../components/createForm.vue';

export default defineComponent({
  name: 'CreateView',

  components: {
    createForm,
  },
});
</script>
