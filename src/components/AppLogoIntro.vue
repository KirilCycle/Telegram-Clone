<template>
    <div class="app-intro">
        <img :src="src">
    </div>
</template>

<script>
    export default {
        props: {
            src: String
        }
    }
</script>

<style lang="scss" scoped>
.app-intro {
    width: 100%;
    height: auto;
    img {
      height: 170px;
      width: auto;
    }
    @media screen and (max-width: 550px) {
      img {
        height: 120px;
      }
    }
  }
  
</style>