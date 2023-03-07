<template>
  <v-dialog
      v-model="props.display"
      persistent
      width="50%"
      min-width="340px"
      
    >
            
                  <v-card color="surface" height="auto" >  

                    <v-toolbar density="compact"><span class="text-h6 pl-4">Add a new trace</span><v-spacer /><v-btn size="small" @click="close">close</v-btn></v-toolbar>
                    
     <v-card-text>
          <v-row>
            <v-col class="v-col-6" ref="avatar" >
               <Avatar :image="props.image" :trace="trace" width="300" />
            </v-col>
            <v-col class="v-col-auto">
               <v-form>
                    <v-text-field
                    block
                    v-model="input.name"
                    label="Your name (optional)"
      ></v-text-field>
      <v-textarea block v-model="input.comment" label="Your comment (optional)"></v-textarea>
      What best describes your trace? (optional)
      <v-chip-group v-model="input.category" multiple selected-class="text-deep-purple-accent-4">
      <v-chip v-for="category in categories" :key="category.key" :value="category.key">{{ category.name }}</v-chip>
    </v-chip-group>

               </v-form>
            </v-col>
            
          </v-row>
     </v-card-text>
     <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="close">close</v-btn>
          <v-btn @click="writeTrace">Submit</v-btn>
     </v-card-actions>
          
     
        
                  </v-card>
            </v-dialog>
    
</template>

<script setup>

import { reactive, onMounted, ref, watch, computed, onUnmounted } from 'vue'
import { useTraceStore } from "../stores/traceStore.js";
import Avatar from './Avatar.vue'

const traceStore = useTraceStore()
const props = defineProps(['display','trace', 'image'])
const emit = defineEmits(['close'])
const close = (() => {
     emit('close')
})

const categories = computed(() => traceStore.getCategories)


let input = reactive({
     name: "",
     comment: "",
     category: [],
})


const writeTrace = (() => {
     traceStore.writeTrace({
          category: input.category.join(","),
          text: input.comment,
          image: props.image.id,
          x: props.trace.x,
          y: props.trace.y,
          width: props.trace.width,
          height: props.trace.height,
     })
     close()

     
})

</script>

<style scoped>
.outer {
     -ms-flex: 0 0 300px;
    flex: 0 0 300px;
}
</style>
