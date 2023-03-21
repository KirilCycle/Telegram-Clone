<template>
  <div v-if="user" class="nav-container">
    <p>{{preatyName}}</p>
    <p>{{number}}</p>
    <button @click="number++" >+</button>
  </div>
</template>

<script>
import store from "@/store/store";

export default {
  data() {
    return {
      user: store.state.user.user,
      number: 1
    };
  },
  computed: {
    preatyName() {
        console.log('comp meth invoked')
        return this.user.email + ' '  + this.user.displayName
     }
  },

};
</script>

<style lang="scss" scoped>
.nav-container {
  width: 100%;
  height: 60px;
  position: fixed;
  bottom: 0px;
  background-color: #151515;

}
</style>
