<template>
     <div>
          <div id="view" style="width: 200px; height: 200px;" :v-html="state.chart.outerHTML"></div>
     </div>

    
</template>

<script setup>
import * as Plot from "@observablehq/plot";
import {reactive, createVNode} from "vue";



let penguins = [
{species: "Adelie", island: "Torgersen", culmen_length_mm: 39.1, culmen_depth_mm: 18.7, flipper_length_mm: 181, body_mass_g: 3750, sex: "MALE"},
  {species: "Adelie", island: "Torgersen", culmen_length_mm: 39.5, culmen_depth_mm: 17.4, flipper_length_mm: 186, body_mass_g: 3800, sex: "FEMALE"},
   {species: "Adelie", island: "Torgersen", culmen_length_mm: 40.3, culmen_depth_mm: 18, flipper_length_mm: 195, body_mass_g: 3250, sex: "FEMALE"},
   {species: "Adelie", island: "Torgersen", culmen_length_mm: NaN, culmen_depth_mm: NaN, flipper_length_mm: NaN, body_mass_g: NaN, sex: null},
   {species: "Adelie", island: "Torgersen", culmen_length_mm: 36.7, culmen_depth_mm: 19.3, flipper_length_mm: 193, body_mass_g: 3450, sex: "FEMALE"},
   {species: "Adelie", island: "Torgersen", culmen_length_mm: 39.3, culmen_depth_mm: 20.6, flipper_length_mm: 190, body_mass_g: 3650, sex: "MALE"},
   {species: "Adelie", island: "Torgersen", culmen_length_mm: 38.9, culmen_depth_mm: 17.8, flipper_length_mm: 181, body_mass_g: 3625, sex: "FEMALE"},
   {species: "Adelie", island: "Torgersen", culmen_length_mm: 39.2, culmen_depth_mm: 19.6, flipper_length_mm: 195, body_mass_g: 4675, sex: "MALE"},
   {species: "Adelie", island: "Torgersen", culmen_length_mm: 34.1, culmen_depth_mm: 18.1, flipper_length_mm: 193, body_mass_g: 3475, sex: null},
   {species: "Adelie", island: "Torgersen", culmen_length_mm: 42, culmen_depth_mm: 20.2, flipper_length_mm: 190, body_mass_g: 4250, sex: null},
  {species: "Adelie", island: "Torgersen", culmen_length_mm: 37.8, culmen_depth_mm: 17.1, flipper_length_mm: 186, body_mass_g: 3300, sex: null},
  {species: "Adelie", island: "Torgersen", culmen_length_mm: 37.8, culmen_depth_mm: 17.3, flipper_length_mm: 180, body_mass_g: 3700, sex: null},
  {species: "Adelie", island: "Torgersen", culmen_length_mm: 41.1, culmen_depth_mm: 17.6, flipper_length_mm: 182, body_mass_g: 3200, sex: "FEMALE"},
  {species: "Adelie", island: "Torgersen", culmen_length_mm: 38.6, culmen_depth_mm: 21.2, flipper_length_mm: 191, body_mass_g: 3800, sex: "MALE"},
  {species: "Adelie", island: "Torgersen", culmen_length_mm: 34.6, culmen_depth_mm: 21.1, flipper_length_mm: 198, body_mass_g: 4400, sex: "MALE"},
  {species: "Adelie", island: "Torgersen", culmen_length_mm: 36.6, culmen_depth_mm: 17.8, flipper_length_mm: 185, body_mass_g: 3700, sex: "FEMALE"},
  {species: "Adelie", island: "Torgersen", culmen_length_mm: 38.7, culmen_depth_mm: 19, flipper_length_mm: 195, body_mass_g: 3450, sex: "FEMALE"},
  {species: "Adelie", island: "Torgersen", culmen_length_mm: 42.5, culmen_depth_mm: 20.7, flipper_length_mm: 197, body_mass_g: 4500, sex: "MALE"},
  {species: "Adelie", island: "Torgersen", culmen_length_mm: 34.4, culmen_depth_mm: 18.4, flipper_length_mm: 184, body_mass_g: 3325, sex: "FEMALE"},
  {species: "Adelie", island: "Torgersen", culmen_length_mm: 46, culmen_depth_mm: 21.5, flipper_length_mm: 194, body_mass_g: 4200, sex: "MALE"},
  {species: "Adelie", island: "Biscoe", culmen_length_mm: 37.8, culmen_depth_mm: 18.3, flipper_length_mm: 174, body_mass_g: 3400, sex: "FEMALE"},
  {species: "Adelie", island: "Biscoe", culmen_length_mm: 37.7, culmen_depth_mm: 18.7, flipper_length_mm: 180, body_mass_g: 3600, sex: "MALE"},
  {species: "Adelie", island: "Biscoe", culmen_length_mm: 35.9, culmen_depth_mm: 19.2, flipper_length_mm: 189, body_mass_g: 3800, sex: "FEMALE"},
  {species: "Adelie", island: "Biscoe", culmen_length_mm: 38.2, culmen_depth_mm: 18.1, flipper_length_mm: 185, body_mass_g: 3950, sex: "MALE"},
  {species: "Adelie", island: "Biscoe", culmen_length_mm: 38.8, culmen_depth_mm: 17.2, flipper_length_mm: 180, body_mass_g: 3800, sex: "MALE"},
  {species: "Adelie", island: "Biscoe", culmen_length_mm: 35.3, culmen_depth_mm: 18.9, flipper_length_mm: 187, body_mass_g: 3800, sex: "FEMALE"},
  {species: "Adelie", island: "Biscoe", culmen_length_mm: 40.6, culmen_depth_mm: 18.6, flipper_length_mm: 183, body_mass_g: 3550, sex: "MALE"},
  {species: "Adelie", island: "Biscoe", culmen_length_mm: 40.5, culmen_depth_mm: 17.9, flipper_length_mm: 187, body_mass_g: 3200, sex: "FEMALE"},
  {species: "Adelie", island: "Biscoe", culmen_length_mm: 37.9, culmen_depth_mm: 18.6, flipper_length_mm: 172, body_mass_g: 3150, sex: "FEMALE"},
  {species: "Adelie", island: "Biscoe", culmen_length_mm: 40.5, culmen_depth_mm: 18.9, flipper_length_mm: 180, body_mass_g: 3950, sex: "MALE"},
  {species: "Adelie", island: "Dream", culmen_length_mm: 39.5, culmen_depth_mm: 16.7, flipper_length_mm: 178, body_mass_g: 3250, sex: "FEMALE"},
  {species: "Adelie", island: "Dream", culmen_length_mm: 37.2, culmen_depth_mm: 18.1, flipper_length_mm: 178, body_mass_g: 3900, sex: "MALE"},
  {species: "Adelie", island: "Dream", culmen_length_mm: 39.5, culmen_depth_mm: 17.8, flipper_length_mm: 188, body_mass_g: 3300, sex: "FEMALE"},
  {species: "Adelie", island: "Dream", culmen_length_mm: 40.9, culmen_depth_mm: 18.9, flipper_length_mm: 184, body_mass_g: 3900, sex: "MALE"},
  {species: "Adelie", island: "Dream", culmen_length_mm: 36.4, culmen_depth_mm: 17, flipper_length_mm: 195, body_mass_g: 3325, sex: "FEMALE"},
  {species: "Adelie", island: "Dream", culmen_length_mm: 39.2, culmen_depth_mm: 21.1, flipper_length_mm: 196, body_mass_g: 4150, sex: "MALE"},
  {species: "Adelie", island: "Dream", culmen_length_mm: 38.8, culmen_depth_mm: 20, flipper_length_mm: 190, body_mass_g: 3950, sex: "MALE"},
  {species: "Adelie", island: "Dream", culmen_length_mm: 42.2, culmen_depth_mm: 18.5, flipper_length_mm: 180, body_mass_g: 3550, sex: "FEMALE"},
  {species: "Adelie", island: "Dream", culmen_length_mm: 37.6, culmen_depth_mm: 19.3, flipper_length_mm: 181, body_mass_g: 3300, sex: "FEMALE"},
  {species: "Adelie", island: "Dream", culmen_length_mm: 39.8, culmen_depth_mm: 19.1, flipper_length_mm: 184, body_mass_g: 4650, sex: "MALE"},
  {species: "Adelie", island: "Dream", culmen_length_mm: 36.5, culmen_depth_mm: 18, flipper_length_mm: 182, body_mass_g: 3150, sex: "FEMALE"},
  {species: "Adelie", island: "Dream", culmen_length_mm: 40.8, culmen_depth_mm: 18.4, flipper_length_mm: 195, body_mass_g: 3900, sex: "MALE"},
  {species: "Adelie", island: "Dream", culmen_length_mm: 36, culmen_depth_mm: 18.5, flipper_length_mm: 186, body_mass_g: 3100, sex: "FEMALE"},
  {species: "Adelie", island: "Dream", culmen_length_mm: 44.1, culmen_depth_mm: 19.7, flipper_length_mm: 196, body_mass_g: 4400, sex: "MALE"},
  {species: "Adelie", island: "Dream", culmen_length_mm: 37, culmen_depth_mm: 16.9, flipper_length_mm: 185, body_mass_g: 3000, sex: "FEMALE"},
  {species: "Adelie", island: "Dream", culmen_length_mm: 39.6, culmen_depth_mm: 18.8, flipper_length_mm: 190, body_mass_g: 4600, sex: "MALE"},
  {species: "Adelie", island: "Dream", culmen_length_mm: 41.1, culmen_depth_mm: 19, flipper_length_mm: 182, body_mass_g: 3425, sex: "MALE"},
  {species: "Adelie", island: "Dream", culmen_length_mm: 37.5, culmen_depth_mm: 18.9, flipper_length_mm: 179, body_mass_g: 2975, sex: null},
  {species: "Adelie", island: "Dream", culmen_length_mm: 36, culmen_depth_mm: 17.9, flipper_length_mm: 190, body_mass_g: 3450, sex: "FEMALE"},
  {species: "Adelie", island: "Dream", culmen_length_mm: 42.3, culmen_depth_mm: 21.2, flipper_length_mm: 191, body_mass_g: 4150, sex: "MALE"},
  {species: "Adelie", island: "Biscoe", culmen_length_mm: 39.6, culmen_depth_mm: 17.7, flipper_length_mm: 186, body_mass_g: 3500, sex: "FEMALE"},
  {species: "Adelie", island: "Biscoe", culmen_length_mm: 40.1, culmen_depth_mm: 18.9, flipper_length_mm: 188, body_mass_g: 4300, sex: "MALE"},
  {species: "Adelie", island: "Biscoe", culmen_length_mm: 35, culmen_depth_mm: 17.9, flipper_length_mm: 190, body_mass_g: 3450, sex: "FEMALE"},
  {species: "Adelie", island: "Biscoe", culmen_length_mm: 42, culmen_depth_mm: 19.5, flipper_length_mm: 200, body_mass_g: 4050, sex: "MALE"},
  {species: "Adelie", island: "Biscoe", culmen_length_mm: 34.5, culmen_depth_mm: 18.1, flipper_length_mm: 187, body_mass_g: 2900, sex: "FEMALE"},
  {species: "Adelie", island: "Biscoe", culmen_length_mm: 41.4, culmen_depth_mm: 18.6, flipper_length_mm: 191, body_mass_g: 3700, sex: "MALE"},
  {species: "Adelie", island: "Biscoe", culmen_length_mm: 39, culmen_depth_mm: 17.5, flipper_length_mm: 186, body_mass_g: 3550, sex: "FEMALE"},
  {species: "Adelie", island: "Biscoe", culmen_length_mm: 40.6, culmen_depth_mm: 18.8, flipper_length_mm: 193, body_mass_g: 3800, sex: "MALE"},
  {species: "Adelie", island: "Biscoe", culmen_length_mm: 36.5, culmen_depth_mm: 16.6, flipper_length_mm: 181, body_mass_g: 2850, sex: "FEMALE"},
]

const state = reactive({
  chart: null
})

state.chart = Plot.plot({
  height: 600,
  grid: true,
  facet: {
    data: penguins,
    x: "sex",
    y: "species",
    marginRight: 80
  },
  marks: [
    Plot.frame(),
    Plot.dot(penguins, {
      x: "culmen_depth_mm",
      y: "culmen_length_mm",
      r: 1.5,
      fill: "#ccc",
      facet: "exclude"
    }),
    Plot.dot(penguins, {
      x: "culmen_depth_mm",
      y: "culmen_length_mm"
    })
  ]
})

console.log(state.chart.outerHTML)



</script>

<style scoped>

</style>
