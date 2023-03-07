<template>
    <v-row >
      <v-col class="v-col-8">
      <TransitionGroup tag="ul" name="list">
        <li v-for="(trace, index) in props.traces" :key="'tracelog-'+trace.id">
          <v-card color="surface">
            
            <v-card-text class="pa-0">
            <Avatar v-if="avatar.width" :image="props.image" :trace="trace" :width="avatar.width" />
            
            <strong>new avatar</strong> Anonymous Penguin created a trace <Timeago :datetime="trace.createdAt" />
            
            </v-card-text>
          </v-card>
        </li>
      </TransitionGroup>
    </v-col>
    </v-row>  
</template>

<script setup>
//import original from '../assets/chess.webp'
import { UNREF } from '@vue/compiler-core';
import { reactive, onMounted, computed, ref, watch, nextTick, onUnmounted } from 'vue'
import Avatar from './Avatar.vue'
const props = defineProps(['image', 'traces'])

const clipWidth = 120 //TODO: make this reactive and bind it to the containerWidth of the avatarcontainer

const avatar = reactive({width: null})
const avatarContainer = ref([])


onMounted(() => {
  let container = avatarContainer.value
  if(container) {
    let listItem = container[0]
    if(listItem) {
      let element = listItem.$el
      if(element) console.log(element)
    }
  }
  
  /*if(avatarContainer.value) {
    console.log(avatarContainer.value[2])
  }*/
  
})

const getWidth = ((container) => {
  console.log(container)
})


</script>

<style scoped>
li {
  list-style: none;
  margin-bottom: 10px;
}
</style>
