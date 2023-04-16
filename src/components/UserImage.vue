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
    min-height: 300px;
  }


  .bottom-img-shadow {
    width: 100%;
    position: absolute;
    height: 3px;
    background-color: rgb(0, 0, 0);
    box-shadow: rgba(0, 0, 7, 1) 0px 32px 90px 80px;
    bottom: -3px;
    
    
  }
</style>