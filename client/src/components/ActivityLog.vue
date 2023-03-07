<template>
    <v-row >
      <v-col class="v-col-8" ref="list">
      <TransitionGroup tag="ul" name="list">
        <li v-for="(trace, index) in props.traces" :key="'tracelog-'+trace.id">
          <v-card color="surface">
            
            <v-card-text class="pa-0">
              <v-row>
                <v-col style="background: red" class="v-col-2">
                  <Avatar v-id="avatar.width" :image="props.image" :trace="trace" :width="avatar.width" />
                </v-col>
                <v-col class="v-col-10 pl-5 pt-5" >
                  <strong>new avatar</strong> Anonymous Penguin created a trace <Timeago :datetime="trace.createdAt" />
                </v-col>
          </v-row>
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
const list = ref(null)


onMounted(() => {
  avatar.width = getWidth()
})

const getWidth = (() => {
  console.log("resize")
  let width = list.value.$el.clientWidth * .16666666
  return width
})

window.onresize = function() {
  avatar.width = getWidth()
}

</script>

<style scoped>
li {
  list-style: none;
  margin-bottom: 10px;
}
</style>
