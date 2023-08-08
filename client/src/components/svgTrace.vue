<template>
     
          <svg width="1000" height="1000">     
               <circle
                    v-for="(point,i) in points"
                    :key="'point-'+i"
                    :class="(i%2==0) ? 'even' : 'odd'"
                    fill="black"
                    r="2"

                    :cx="point.x"
                    :cy="point.y"
                    />
          </svg>

    
</template>

<script setup>
import * as d3 from 'd3'

const random = d3.randomNormal(200, 40), 
     sqrt3 = Math.sqrt(3),
     //points0 = d3.range(300).map(function() { return [random() + sqrt3, random()]; }),
     points0 = d3.range(300).map(() => {return {x: random() + sqrt3, y: random(), class: "even"}}),
     points1 = d3.range(300).map(() => {return {x: random() + sqrt3, y: random(), class: "odd"}}),
     points = d3.merge([points0, points1])
</script>

<style scoped>
     .container {
          background: white;
     }

     circle {
          mix-blend-mode: multiply;

     }

     circle.even {

          -webkit-filter:
               drop-shadow( 0px 0px 10px rgba(255, 0, 0, 1));
     }

    
     circle.odd {
          -webkit-filter:
          drop-shadow( 0px 0px 10px rgba(0, 0, 255, 1));
     }

     @mixin ripple($duration, $delay) {
    opacity: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: '';
    height: 100%;
    width: 100%;
    background: #0460CC;
    border-radius: 100%;
    animation-name: ripple;
    animation-duration: $duration;
    animation-delay: $delay;
    animation-iteration-count: infinite;
    animation-timing-function: cubic-bezier(.65,0,.34,1);
    z-index: -1;
}

     
</style>
