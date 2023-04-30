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
      user-select: none; /* supported by Chrome and Opera */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      width: auto;
    }
    @media screen and (max-width: 550px) {
      img {
        height: 120px;
      }
    }
  }
  
</style>