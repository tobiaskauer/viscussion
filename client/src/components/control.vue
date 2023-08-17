<template>
     <v-container>

          <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
               <v-tab value="Images">Images</v-tab>
               <v-tab value="Traces">Traces</v-tab>
          </v-tabs>
          <v-window v-model="tab">
               <v-window-item value="Images">
                    <v-table v-if="images">
                         <thead>
                              <tr>
                                   <th v-for="head in imageHeaders" :key="'th-' + head.key" :style="`width: ${head.width}%`">
                                        {{
                                             head.key }}
                                   </th>
                              </tr>
                         </thead>
                         <tbody>
                              <tr v-for="image in images" :key="image.id">
                                   <td v-for="head in imageHeaders" :key="'td-' + head.key">
                                        <template v-if="head.key == 'url'"><v-img :src="image.url" /></template>
                                        <template v-else-if="head.key == 'delete'">
                                             <v-btn size="small"
                                                  @click="deleteImage(image)"><v-icon>mdi-delete-outline</v-icon>delete</v-btn>
                                        </template>
                                        <template v-else>{{ image[head.key] }}</template>

                                   </td>
                              </tr>
                         </tbody>
                    </v-table>
               </v-window-item>

               <v-window-item value="Traces">
                    <v-table v-if="traces">
                         <thead>
                              <tr>
                                   <th v-for="head in traceHeaders" :key="'th-' + head.key" :style="`width: ${head.width}%`">
                                        {{
                                             head.key }}
                                   </th>
                              </tr>
                         </thead>
                         <tbody>
                              <tr v-for="trace in traces" :key="trace.id">
                                   <td v-for="head in traceHeaders" :key="'td-' + head.key" :style="`width: ${head.width}%`">
                                        <template v-if="head.key == 'anchors'">
                                             {{ trace.anchors.length }}
                                             <!--<Avatar :image="trace.image" :trace="trace.anchors" width="300" />-->
                                        </template>

                                        <template v-else-if="head.key == 'delete'">
                                             <v-btn size="small"
                                                  @click="deleteTrace(trace)"><v-icon>mdi-delete-outline</v-icon>delete</v-btn>
                                        </template>
                                        <template v-else>
                                             <div style="max-width: 200px;">{{ trace[head.key] }}</div>
                                        </template>

                                   </td>
                              </tr>
                         </tbody>
                    </v-table>

               </v-window-item>
          </v-window>
     </v-container>
</template>

<script setup>
import { useImageStore } from "../stores/imgStore.js";
import { useTraceStore } from "../stores/traceStore.js";
import Avatar from './Avatar.vue'
import { reactive, onMounted, computed, ref } from 'vue'
const traceStore = useTraceStore();
const imageStore = useImageStore();

let tab = ref("Traces")

const images = computed(() => imageStore.getAllImages)
const imageHeaders = [
     { key: 'id', width: 5 },
     { key: 'url', width: 20 },
     { key: 'title', width: 60 },
     { key: 'delete', width: 15 },
]
const deleteImage = (image) => {
     imageStore.deleteImage(image.id)
}
/*const imageHeaders = computed(() => {
     if (!images.value) return null
     console.log(images.value)
     return Object.keys(images[0])
})*/

const traces = computed(() => traceStore.getAllTraces)
const traceHeaders = [
     { key: 'id', width: 5 },
     //{ key: 'anchors', width: 10 },
     { key: 'text', width: 10 },
     { key: 'category', width: 10 },
     { key: 'anchors', width: 10 },
     { key: 'author', width: 10 },
     { key: 'image', width: 10 },
     { key: 'score', width: 10 },
     { key: 'createdAt', width: 10 },
     { key: 'delete', width: 10 }
]
const deleteTrace = (trace) => {
     traceStore.deleteTrace(trace.id)
}


onMounted(() => {
     imageStore.fetchAllImages()
     traceStore.fetchAllTraces()
})


</script>

<style scoped></style>
