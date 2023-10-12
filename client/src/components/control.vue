<template>
     <v-container>
          <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
               <v-tab value="Images">Images ({{ images.length }})</v-tab>
               <v-tab value="Traces">Traces ({{ traces.length }})</v-tab>
               <!--<v-tab value="Interactions">Interactions ({{ interactions.length }})</v-tab>-->
               <v-tab value="Sessions">Sessions ({{ sessions.length }})</v-tab>
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
                                        <template v-else-if="head.key == 'visible'">
                                             <v-btn size="small" @click="toggleVisibility(image)">
                                                  <span v-if="image[head.key]">hide</span>
                                                  <span v-else>show</span>
                                             </v-btn>

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
               <v-window-item value="Interactions">
                    <!--<v-checkbox v-model="filterTobi" label="filter Tobi's sessions"></v-checkbox>-->

                    <v-table v-if="interactions">
                         <thead>
                              <tr>
                                   <th v-for="head in interactionHeaders" :key="'th-' + head.key"
                                        :style="`width: ${head.width}%`">
                                        {{
                                             head.key }}
                                   </th>
                              </tr>
                         </thead>
                         <tbody>
                              <tr v-for="interaction in interactions" :key="interaction.id">
                                   <td v-for="head in interactionHeaders" :key="'td-' + head.key"
                                        :style="`width: ${head.width}%`">
                                        <template v-if="head.key == 'createdAt'">
                                             <v-tooltip :text="interaction.createdAt">
                                                  <template v-slot:activator="{ props }">
                                                       <Timeago v-bind="props" :datetime="interaction.createdAt" />
                                                  </template>
                                             </v-tooltip>
                                        </template>
                                        <template v-else>
                                             <div style="max-width: 200px;">{{ interaction[head.key] }}</div>
                                        </template>

                                   </td>
                              </tr>
                         </tbody>
                    </v-table>
               </v-window-item>
               <v-window-item value="Sessions">
                    <v-table v-if="sessions">
                         <thead>
                              <tr>
                                   <th v-for="head in sessionHeaders" :key="'th-' + head.key"
                                        :style="`width: ${head.width}%`">
                                        {{
                                             head.key }}
                                   </th>
                              </tr>
                         </thead>
                         <tbody>
                              <tr v-for="session in sessions" :key="session.id">
                                   <td v-for="head in sessionHeaders" :key="'td-' + head.key"
                                        :style="`width: ${head.width}%`">
                                        <template v-if="head.key == 'interactions'">
                                             {{ session.interactions.length }}
                                        </template>
                                        <template v-else-if="head.key == 'duration'">
                                             {{ session.duration }} mins
                                        </template>
                                        <template v-else-if="head.key == 'hoverEmbeddedTrace'">
                                             {{ session.interactions.filter(interaction => interaction.action
                                                  == 'hoverEmbeddedTrace').length }}
                                        </template>
                                        <template v-else-if="head.key == 'hoverSeparatedTrace'">
                                             {{ session.interactions.filter(interaction => interaction.action
                                                  == 'hoverSeparatedTrace').length }}
                                        </template>

                                        <template v-else-if="head.key == 'changePath'">
                                             {{ session.interactions.filter(interaction => interaction.action
                                                  == 'changePath').length }}
                                        </template>
                                        <template v-else-if="head.key == 'switchPatina'">
                                             {{ session.interactions.filter(interaction => interaction.action
                                                  == 'switchPatina').length }}
                                        </template>
                                        <template v-else-if="head.key == 'expandTrace'">
                                             {{ session.interactions.filter(interaction => interaction.action
                                                  == 'expandTrace').length }}
                                        </template>
                                        <template v-else-if="head.key == 'submitTrace'">
                                             {{ session.interactions.filter(interaction => interaction.action
                                                  == 'submitTrace').length }}
                                        </template>
                                        <template v-else-if="head.key == 'upvote'">
                                             {{ session.interactions.filter(interaction => interaction.action
                                                  == 'upvote').length }}
                                        </template>
                                        <template v-else>
                                             <div style="max-width: 200px;">{{ session[head.key] }}</div>
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

onMounted(() => {
     traceStore.fetchAllInteractions()
})

const interactions = computed(() => {
     return traceStore.interactions
          .sort((a, b) => { return new Date(b.createdAt) - new Date(a.createdAt) })
})



const interactionHeaders = [
     { key: 'session', width: 15 },
     { key: 'image', width: 15 },
     { key: 'createdAt', width: 15 },
     { key: 'patina', width: 15 },
     { key: 'action', width: 15 },
     { key: 'target', width: 15 },
]


let tab = ref("Sessions")

const sessions = computed(() => {
     let interactions = traceStore.interactions
     let sessions = []
     interactions.forEach(interaction => {
          interaction.createdAt = new Date(interaction.createdAt)
          let sessionExists = sessions.find(session => session.id == interaction.session)
          if (!sessionExists) {
               sessions.push({ id: interaction.session, interactions: [interaction] })
          } else {
               sessionExists.interactions.push(interaction)
          }
     })

     sessions.forEach(session => {
          session.interactions.sort((a, b) => b.createdAt - a.createdAt)
          session.duration = Math.floor((session.interactions[0].createdAt - session.interactions[session.interactions.length - 1].createdAt) / 1000 / 60)
     })
     console.log(sessions)
     return sessions
})
const sessionHeaders = [
     { key: 'id', width: 15 },
     { key: 'interactions', width: 15 },
     { key: 'duration', width: 15 },
     { key: 'hoverEmbeddedTrace', width: 15 },
     { key: 'hoverSeparatedTrace', width: 15 },
     { key: 'changePath', width: 15 },
     { key: 'switchPatina', width: 15 },

     { key: 'expandTrace', width: 15 },
     { key: 'upvote', width: 15 },
     { key: 'submitTrace', width: 15 },
]

const images = computed(() => imageStore.getAllImages)
const imageHeaders = [
     { key: 'id', width: 5 },
     { key: 'url', width: 20 },
     { key: 'title', width: 60 },
     { key: 'visible', width: 15 },
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

const toggleVisibility = (image) => {
     imageStore.toggleVisibility(image.id, image.visible)
}

onMounted(() => {
     imageStore.fetchAllImages()
     traceStore.fetchAllTraces()
})


</script>

<style scoped></style>