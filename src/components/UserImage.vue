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
    height: 30px;
    background-color: #ff343400;
    box-shadow: rgba(0, 0, 2, 10) 0px 32px 70px 40px;
    bottom: -30px;
    
  }
</style>