<template></template>

<script setup>


import { reactive, onMounted, computed, watch, onUnmounted } from 'vue'
const traceStore = useTraceStore();
const imageStore = useImageStore();
const props = defineProps(['id'])

onMounted(() => {
     console.log(props.id)
     imageStore.fetchImage(props.id)
     traceStore.fetchTraces(props.id);
})


const newTrace = reactive({
     displayForm: false,



})

const openTraceform = (exportTrace) => {

     Object.keys(exportTrace).forEach(key => { newTrace[key] = exportTrace[key] })
     newTrace.displayForm = true
     console.log(newTrace)

}

const image = computed(() => {
     return imageStore.getImage
})

const traces = computed(() => {
     return traceStore.getTraces
})

const snackbar = reactive({
     display: false,
     message: null
})

/*const newTrace = computed(() => {     
     return traceStore.getNewTrace
})*/

/*watch(newTrace, newTrace => {
     snackbar.display = true
     snackbar.message = "Trace #"+newTrace.id+" has been recorded." 
})*/


const highlight = computed(() => {
     return traceStore.getHighlight
})
</script>

<style scoped>
h2 {
     display: inline;
}
</style>
