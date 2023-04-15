<template>
    <div class="photo-container">
        <slot></slot>
        <div class="bottom-img-shadow"></div>
      </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
.photo-container {
    width: 310px;
    height: 300px;
    background-color: #ffffff00;
    position: relative;
    overflow: hidden;
  }


  .bottom-img-shadow {
    width: 100%;
    position: absolute;
    height: 2px;
    background-color: #000000cb;
    box-shadow: rgba(0, 0, 4, 12) 0px 32px 70px 40px;
    bottom: -10px;
    
  }
</style>