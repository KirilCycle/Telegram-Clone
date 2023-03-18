<template>
  <div class="wrap">
    <router-view></router-view>
  </div>
</template>

<script>



export default {
  name: 'App',
  components: {
   
  }
}
</script>

<style>

.wrap {
  width: 100vw;
  height: 100vh;
  background-color: #1e1e1e;
}
* {
  margin: 0px;
  bottom: 0px;
  padding: 0px;
}

#app {
  padding: 0px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  
}
</style>
