<template>
    <TransitionGroup tag="ul" name="list" ref="list">
        <li v-for="(trace, index) in props.traces" :key="'tracelog-'+trace.id">
          <v-card color="surface">
            
            <v-card-text class="pa-0">
              <v-row no-gutters="">
                <v-col class="v-col-4 ma-0 pa-3">
                  <Avatar v-if="avatar.width" :image="props.image" :trace="trace" :width="avatar.width" />
                </v-col>
                <v-col class="v-col-8 pl-5 pa-3" >
                  

                    <div class="mb-2">
                      <h5>Anonymous Penguin</h5> (<Timeago :datetime="trace.createdAt" />)
                    </div>
                    
                    <p v-if="trace.text">{{ trace.text }}</p>
                    <p v-else>This area is interesting to me!</p>

                                  
                

                </v-col>
          </v-row>
            </v-card-text>
          </v-card>
        </li>
      </TransitionGroup>
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
  let width = Math.round(list.value.$el.clientWidth * .33333)
  return width
})

window.onresize = function() {
  avatar.width = getWidth()
}

</script>

<style scoped>
h5 {
  display: inline;
}
li {
  list-style: none;
  margin-bottom: 10px;
}
</style>
