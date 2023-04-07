<template>
  <div class="img-wrap">
    <img :src="src" />
  </div>
</template>

<script>
export default {
  props: {
    src: String,
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
    width: 100%;
    border-radius: 3px;
    min-height: 100%;
    object-fit: cover;
  }
}
</style>
