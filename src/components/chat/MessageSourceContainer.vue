<template>
  <div class="source-wrp">
    <img v-if="source.type === 'img'" :src="source.src" />
    <video class="video-player" v-else :src="source.src" controls></video>
  </div>
</template>

<script>
export default {
  props: { source: Object },
};
</script>

<style lang="scss" scoped>
.source-wrp {
  width: 100%;
  max-width: 380px;
  position: relative;
  height: 400px;
  

  @media (max-width: 350px) {
    .source-wrp {
      max-width: 320px;
    }
  }

  img {
    border-radius: 10px 10px 0px 0px;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    width: 100%;
  }

  video {
    border-radius: 10px 10px 0px 0px;
    width: max-content;
    height: 100%;
    width: 100%;
  }

  .video-player:hover {
    cursor: pointer;
  }

  .video-player::-webkit-media-controls {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  .video-player:hover::-webkit-media-controls {
    opacity: 1;
  }

  .video-player::-webkit-media-controls-start-playback-button {
    display: none;
  }

  .video-player:hover::-webkit-media-controls-start-playback-button {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
