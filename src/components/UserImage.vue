<template>
    <div class="photo-container">
        <img :src="$store.state.chat?.selectedUser?.photoURL" />
        <h2>Sexy pro</h2>
        <h3>{{ $store.state.chat?.selectedUser?.email }}</h3>
        <div class="bottom-img-shadow"></div>
      </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
.photo-container {
    width: 100%;
    height: 330px;
    background-color: #ffffff00;
    position: relative;
    overflow: hidden;
  
    img {
      background: #46464600;
      min-width: 100%;
      max-width: 100%;
      min-height: 100%;
      max-height: 100%;
    }
    h3 {
      color: #c8c8c8;
      position: absolute;
      bottom: 3px;
      left: 7px;
      z-index: 50;
      font-size: 1rem;
    }
    h2 {
      color: #ffffff;
      z-index: 50;
      position: absolute;
      bottom: 23px;
      left: 7px;
      font-size: 1.5rem;
    }
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