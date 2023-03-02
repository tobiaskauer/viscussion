import { ref, onMounted, onUnmounted } from 'vue'
export function createAvatar(props) {
    let trace  = props.trace
    let image = props.image
    let width = props.width
    let avatar = {}
    
    let zoomFactor = width/trace.width
    let aspectRatio = trace.height / trace.width
    
    avatar.height = width * aspectRatio
    avatar.zoom = zoomFactor * image.width 

    avatar.x = trace.x / image.width * 107 //this should be 100 but css is a wild language
    avatar.y = trace.y / image.height * 107

    avatar.width = width
    avatar.url = props.image.url
    return avatar
}

//ideally createAvatar would be part of an <Avatar> Component :/ TODO