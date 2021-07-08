const rootStyles = window.getComputedStyle(document.documentElement)

if(rootStyles.getPropertyValue('--car-image-width-large') != null && rootStyles.getPropertyValue('--car-image-width-large') !== '') {
  ready()
} else {
  document.getElementById('main-css').addEventListener('load', ready)
}

function ready(){

  const imageWidth = parseFloat(rootStyles.getPropertyValue('--car-image-width-large'))
  const aspectRatio = parseFloat(rootStyles.getPropertyValue('--car-image-aspect-ratio'))
  const imageHeight = imageWidth/aspectRatio


  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )

FilePond.setOptions({
    stylePanelAspectRatio: 1 / aspectRatio,
    imageResizeTargetWidth: imageWidth,
    imageResizeTargetHeight: imageHeight
})

FilePond.parse(document.body);
}


