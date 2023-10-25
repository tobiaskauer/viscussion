<template>
     <!--<v-row>
          <v-col>
               <v-btn size="small" class="mr-3" v-for="patina in patinas" :key="patina.key" :active="patina.active"
                    @click="select(patina.key)">
                    <v-icon v-if="patina.icon">{{ patina.icon }}</v-icon>
                    {{ patina.key }}
               </v-btn>
          </v-col>
     </v-row>
     <v-row class="ma-0">
          <v-col class="ma-0">
               <template v-if="activePatina.key == 'None'">
                    The accumulation of people's comments gives visualizations a distinct look. We call this look
                    <strong><code>Patina</code></strong>. Select a patina above to see how people commented on this
                    visualization.</template>
               <template v-if="activePatina.key == 'Activity'">Each layer indicates a comment. Areas with a thick patina have
                    the highest activity.</template>
               <template v-if="activePatina.key == 'Responses'">The faster a box moves, the more responses were written to
                    it.</template>
               <template v-if="activePatina.key == 'Category'">Filter comments by category:</template>
               <template v-if="activePatina.key == 'Popularity'"><span
                         style="border: 1px solid red; background: rgba(255,0,0,.1); font-weight: bold;  border-radius: 2px; padding: 3px;">Red
                         comments</span> are more
                    popular according to their <v-icon>mdi-heart-outline</v-icon> score.</template>
               <template v-if="activePatina.key == 'Temporal'">Replay, how the center of attention has shifted over
                    time:</template>
               <template v-if="activePatina.key == 'Relation'">Linked comments are mentioned together</template>
          </v-col>
     </v-row>-->

     <v-row>
          <v-col class="ma-2">
               <v-menu open-on-hover>
                    <template v-slot:activator="{ props }">
                         <v-row>
                              <v-col class="v-col-10"><v-btn color="white" v-bind="props" block>
                                        <v-icon v-if="activePatina.icon">{{ activePatina.icon }}</v-icon>
                                        {{ activePatina.key }}
                                   </v-btn></v-col>
                              <v-col class="v-col-2">
                                   <v-dialog width="500">
                                        <template v-slot:activator="{ props }">
                                             <v-btn icon size="x-small" v-bind="props">
                                                  <v-icon>mdi-help</v-icon></v-btn>
                                        </template>

                                        <template v-slot:default="{ isActive }">
                                             <v-card title="What's a patina?">
                                                  <v-card-text>
                                                       <p>The accumulation of people's comments gives visualizations a
                                                            distinct look.
                                                            We call this look <em>patina</em>.</p>
                                                       <p class="pt-2">Patinas are visually dynamic traces of people's
                                                            engagement with
                                                            visualizations.
                                                            Selecting a patina in the menu allows you to explore the
                                                            discourse in
                                                            various ways:</p>
                                                       <v-list lines="one">

                                                            <v-list-item v-for="(item, index) in patinas" :key="index">{{
                                                                 item.key }}:
                                                                 <em>{{ item.desc }}</em></v-list-item>
                                                       </v-list>

                                                  </v-card-text>

                                                  <v-card-actions>
                                                       <v-spacer></v-spacer>

                                                       <v-btn text="Close" @click="isActive.value = false"></v-btn>
                                                  </v-card-actions>
                                             </v-card>
                                        </template>
                                   </v-dialog>

                              </v-col>
                         </v-row>


                    </template>

                    <v-list lines="two">
                         <v-list-item v-for="(item, index) in patinas" :key="index" @click="select(item.key)">
                              <v-list-item-title>
                                   <!--<v-icon class="mr-1">{{ item.icon }}</v-icon>-->
                                   {{ item.key }}
                              </v-list-item-title>
                              <v-list-item-subtitle>{{ item.desc }}</v-list-item-subtitle>
                              <template v-slot:prepend>
                                   <v-icon :icon="item.icon"></v-icon>

                              </template>

                         </v-list-item>
                    </v-list>
               </v-menu>
          </v-col>
     </v-row>
     <v-row class="ma-0">
          <v-col class="ma-2 pa-0" style="color: white">
               <template v-if="activePatina.key == 'None'">
                    The accumulation of people's comments gives visualizations a distinct look. We call this look
                    <strong><code>Patina</code></strong>. Select a patina above to see how people commented on this
                    visualization.</template>
               <template v-if="activePatina.key == 'Activity'">Each red square indicates a comment. Areas with lots of
                    squares have the highest activity.</template>
               <template v-if="activePatina.key == 'Responses'">The faster a <span class="shork"
                         style="border: 1px solid red; background: rgba(255,0,0,.1); font-weight: bold;  border-radius: 2px; padding: 3px;">square</span>
                    moves, the more responses were written to
                    it.</template>
               <template v-if="activePatina.key == 'Category'">Filter comments by category:</template>
               <template v-if="activePatina.key == 'Popularity'"><span
                         style="border: 1px solid red; background: rgba(255,0,0,.1); font-weight: bold;  border-radius: 2px; padding: 3px;">Red
                         comments</span> are more
                    popular according to their <v-icon>mdi-heart-outline</v-icon> score.</template>
               <template v-if="activePatina.key == 'Temporal'">Replay, how the center of attention has shifted over
                    time:</template>
               <template v-if="activePatina.key == 'Relation'">Linked comments are mentioned together</template>
          </v-col>
     </v-row>
</template>

<script setup>

import { computed } from 'vue';
import { useTraceStore } from "../stores/traceStore.js";
const traceStore = useTraceStore();

const patinas = computed(() => traceStore.patinas)
const activePatina = computed(() => traceStore.activePatina)

const select = (key) => {
     traceStore.writeInteraction({
          action: "switchPatina",
          target: key
     })
     traceStore.setActivePatina(key)
}

</script>

<style scoped>
.shork {
     display: inline-block;

     animation: shork 2s ease infinite;
}

@keyframes shork {

     0%,
     100% {
          transform: translateX(0);
     }

     10%,
     30%,
     50%,
     70%,
     90% {
          transform: translateY(-5px);
     }

     20%,
     40%,
     60%,
     80% {
          transform: translateY(5px);
     }
}
</style>
