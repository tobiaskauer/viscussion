<template>
  <v-container fluid style="background: #ddd">
    <v-container>
      <v-row>
        <v-col class="v-col-4 offset-1">
          <!--<h1>Let's talk <span style="text-decoration:line-through;"> about</span> <span style="font-weight: 900; font-style: italic;"> with</span> data visualization.</h1>-->
          <!--<h1>Data visualization is a canvas. <span style="font-weight: 900; font-style: italic;"><br>Let's paint a picture.</span></h1>-->
          <img src="@/assets/userstudy.png" style="width: 100%" />
        </v-col>
        <v-col class="v-col-7">

          <p style="font-size: 1.3em">
            <strong>Discursive Patinas: Anchoring Discussions in Data Visualization</strong><br>
            <span style="font-size: 0.8em;">IEEE Transactions on
              Visualization and Computer Graphics (VIS'24)</span>
          </p>

          <p>
            <a class="mr-3" href="https://arxiv.org/abs/2407.17994"><v-btn size="small" variant="outlined"><v-icon start
                  icon="mdi-download"></v-icon>Full Paper</v-btn></a>
            <a class="mr-3" href="https://github.com/tobiaskauer/viscussion"><v-btn size="small"
                variant="outlined"><v-icon start icon="mdi-code"></v-icon>GitHub Repository</v-btn></a>
            <a href="https://github.com/tobiaskauer/viscussion"><v-btn size="small" variant="outlined"><v-icon start
                  icon="mdi-play"></v-icon>Recorded Talk</v-btn></a>
          </p>

          <p class="my-3">The way we discuss visualisations influences how people understand, contextualise and argue
            about data. This prototype offers a way to create, explore, and engage in discussions integrated into data
            visualizations.
          </p>
          <v-row align="top">
            <v-col class="avatar">
              <v-img :src="tobi" aspect-ratio="1:1" width="50%" class="mx-auto" />
              <div><span>Tobias Kauer</span><br /><a href="https://visualinteractivedata.github.io/">University of
                  Edinburgh</a>,<br><a href="https://uclab.fh-potsdam.de/">Urban Complexity Lab Potsdam</a></div>
            </v-col>
            <v-col class="avatar">
              <v-img :src="derya" aspect-ratio="1:1" width="50%" class="mx-auto" />
              <div><span><a href="https://gotdairyya.github.io/">Derya Akbaba</a></span><br><a
                  href="https://liu.se/en">Linköping University</a></div>
            </v-col>
            <v-col class="avatar">
              <v-img :src="marian" aspect-ratio="1:1" width="50%" class="mx-auto" />
              <div><span><a href="https://mariandoerk.de/">Marian Dörk</a></span><br><a
                  href="https://uclab.fh-potsdam.de/">Urban Complexity Lab Potsdam</a></div>
            </v-col>
            <v-col class="avatar">
              <v-img :src="ben" aspect-ratio="1:1" width="50%" class="mx-auto" />
              <div><span><a href="https://aviz.fr/~bbach/homepage/index-homepage.html">Benjamin Bach</a></span><br><a
                  href="https://www.inria.fr/en">INRIA</a>,<br><a
                  href="https://visualinteractivedata.github.io/">University of Edinburgh</a></div>
            </v-col>
          </v-row>




        </v-col>
      </v-row>
    </v-container>
  </v-container>
  <v-container>
    <h1 class="mb-5">View viscussions</h1>
    <v-row v-if="images">
      <v-col class="v-col-3" v-for="image in images" :key="image.id">
        <router-link :to="'/view/' + image.id">
          <v-hover>
            <template v-slot:default="{ isHovering, props }">
              <v-card v-bind="props" :color="isHovering ? 'primary' : undefined">
                <!--<v-img :src="image.url" contain></v-img>-->
                <div style="overflow:hidden">

                  <img :src="image.url" style="width: 100%;" />
                  <!--<tracedImage :image="image" :traces="image.traces" :touchable="false" />-->
                </div>

                <v-card-item>
                  <v-card-text>
                    <strong>{{ image.title }}</strong>
                    (
                    <Timeago :datetime="image.createdAt" />)

                    <!--<p>{{ images.traces.length }} traces in the </p>-->
                    <p v-if="image.traces">{{ image.traces.length }} recorded traces</p>
                  </v-card-text>
                </v-card-item>
              </v-card>
            </template>
          </v-hover>
        </router-link>
      </v-col>
    </v-row>
    <!--<v-row>
      <v-col class="v-col-3">
        <router-link to="create">
          <v-btn>
            <v-icon start icon="mdi-plus"></v-icon>
            Add new
          </v-btn>
        </router-link>
      </v-col>

    </v-row>-->
  </v-container>
</template>

<script setup>
import { useImageStore } from "../stores/imgStore.js";
import { useTraceStore } from "../stores/traceStore.js";

import tobi from '@/assets/tobi.png'
import derya from '@/assets/derya.png'
import marian from '@/assets/marian.jpg'
import ben from '@/assets/ben.png'



import { onMounted, computed, } from 'vue'
const traceStore = useTraceStore();
const imageStore = useImageStore();


const images = computed(() => {
  let images = imageStore.getAllImages
  let traces = traceStore.getAllTraces
  if (!images || !traces) return false
  images = images.filter(image => image.visible)

  images.forEach(image => {
    image.traces = traces.filter(trace => trace.image == image.id)
  })
  return images
})


onMounted(() => {
  imageStore.fetchAllImages()
  traceStore.fetchAllTraces()
  traceStore.fetchTraces(null) //reset existing traces
})
</script>

<style>
.avatar img {
  border-radius: 100%;
}

.avatar {
  text-align: center;
  font-size: 0.8em;
}


.avatar span {
  font-weight: bold;
  font-size: 1.2em;
}
</style>