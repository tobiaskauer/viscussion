<template>
     <v-container>
          <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
               <v-tab value="Images">Images ({{ images.length }})</v-tab>
               <v-tab value="Traces">Traces ({{ traces.length }})</v-tab>
               <!--<v-tab value="Interactions">Interactions ({{ interactions.length }})</v-tab>-->
               <v-tab value="Sessions">Sessions ({{ sessions.length }})</v-tab>
               <v-tab value="Coding">Open Coding</v-tab>
          </v-tabs>
          <v-window v-model="tab">
               <v-window-item value="Images">
                    <v-table v-if="images">
                         <thead>
                              <tr>
                                   <th v-for="head in imageHeaders" :key="'th-' + head.key"
                                        :style="`width: ${head.width}%`">
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
                                   <th v-for="head in traceHeaders" :key="'th-' + head.key"
                                        :style="`width: ${head.width}%`">
                                        {{
               head.key }}
                                   </th>
                              </tr>
                         </thead>
                         <tbody>
                              <tr v-for="trace in traces" :key="trace.id">
                                   <td v-for="head in traceHeaders" :key="'td-' + head.key"
                                        :style="`width: ${head.width}%`">
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

               <v-window-item value="Coding">
                    <v-table v-if="coding">
                         <thead>
                              <tr>
                                   <th v-for="head in codingHeaders" :key="'th-' + head.key"
                                        :style="`width: ${head.width}%`">
                                        {{
               head.key }}
                                   </th>
                              </tr>
                         </thead>
                         <tbody>
                              <tr v-for="trace in coding" :key="trace.id">
                                   <td v-for="head in codingHeaders" :key="'td-' + head.key"
                                        :style="`width: ${head.width}%`">
                                        <template v-if="head.key == 'image'">
                                             <a :href="trace.image.url" target="_blank"><img :src="trace.image.url"
                                                       width="200" /></a>
                                        </template>

                                        <template v-else-if="head.key == 'avatar'">
                                             <Avatar v-if="trace.anchors && trace.anchors.length > 0"
                                                  :image="trace.image" :trace="trace.anchors" />
                                        </template>
                                        <template v-else>
                                             <div style="max-width: 200px;">{{ trace[head.key] }}</div>
                                        </template>

                                   </td>
                              </tr>
                         </tbody>
                    </v-table>
               </v-window-item> </v-window>
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


let tab = ref("Coding")

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
          let durationMs = session.interactions[0].createdAt.valueOf() - session.interactions[session.interactions.length - 1].createdAt.valueOf()
          session.duration = Math.round(durationMs / 60000)
     })

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

const coding = computed(() => {
     let traces = traceStore.getAllTraces
     let manualTraces = [233, 234, 235, 236, 238, 239, 240, 241, 242, 243, 245, 246, 247, 248, 249, 250, 252, 253, 251, 254, 255, 256, 257, 258, 260, 261, 262, 263, 264, 265, 259, 266, 269, 271, 272, 273, 270, 275, 276, 277, 278, 279, 280, 281, 282, 284, 286, 287, 288, 290, 292, 294, 295, 296, 297, 299, 300, 301, 302, 303, 305, 306, 307, 308, 310, 311, 312, 313, 314, 315, 316, 317, 318, 283, 304, 319, 320, 321, 274, 268, 267, 322, 323, 324, 325, 326, 328, 327, 330, 331, 332, 333, 329, 334, 335, 336, 293, 337, 338, 339, 349, 351, 352, 353, 354, 355, 356, 357, 359, 360, 361, 362, 363, 364, 365, 366, 367, 369, 370, 371, 373, 374, 375, 377, 378, 380, 382, 383, 384, 376, 385, 386, 368, 388, 389, 390, 387, 392, 372, 394, 395, 397, 399, 350, 400, 401, 402, 403, 404, 405, 406, 407, 408, 379, 409, 410, 358, 411, 412, 348, 413, 396, 391, 415, 393, 414, 416, 244, 381, 417, 418, 419, 424, 425, 428, 426, 427, 431, 433, 434, 435, 436, 437, 438, 439, 440, 441, 444, 447, 451, 453, 455, 457, 458, 445, 459, 460, 461, 462, 454, 442, 448, 452, 449, 463, 464, 430, 446, 450, 465, 443, 466, 432, 429, 456, 467, 1876, 1877, 1878, 1879, 1880, 1881, 1882, 1883, 1884, 1885, 1886, 1887, 1888, 1889, 1890, 1891, 1892, 1893, 1894, 1895, 1896, 1898, 1899, 1900, 1901, 1902, 1903, 1897, 1905, 1906, 1907, 1908, 1909, 1910, 1911, 1904, 1912, 1913, 1914, 1915, 1916, 1917, 1918, 1919, 1920, 1921, 1922, 1923]
     let filteredTraces = traces.filter(trace => manualTraces.includes(trace.id))
     filteredTraces.forEach(trace => {
          trace.image = images.value.find(image => image.id == trace.image) // translate image id to full image object
     })

     return filteredTraces
})

const codingHeaders = [
     { key: 'id', width: 5 },
     { key: 'avatar', width: 10 },
     { key: 'text', width: 10 },
     { key: 'category', width: 10 },
     { key: 'image', width: 10 },
]

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