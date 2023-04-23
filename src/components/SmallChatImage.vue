<template>
  <div v-if="type === 'img'" class="img-wrap">
    <img :src="src" />
  </div>
  <video class="video-wrap" v-else>
    <source :src="src" type="video/mp4">
  </video>
</template>

<script>
export default {
  props: {
    src: String,
    type: String,
  },
  data() {
    return {
      src: this.src,
    };
  },
};
</script>

<style lang="scss" scoped>
.img-wrap {
  height: 35px;
  width: 35px;
  border-radius: 3px;

  img {
    max-width: 100%;
    border-radius: 3px;
    min-height: 100%;
    object-fit: cover;
  }
}

.video-wrap {
  height: 35px;
  width: 35px;
  border-radius: 3px;

  source {
    width: 100%;
    border-radius: 3px;
    min-height: 100%;
    object-fit: cover;
  }

}
</style>
