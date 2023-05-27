<template>
  <div>
     <div v-for="msg in $store.state.previewChat.msgs " :key="msg.id" class="in-loading-msg-prewie"></div>
  </div>
</template>

<script setup>
import store from "@/store/store";



</script>

<style lang="scss" scoped>

.in-loading-msg-prewie {
    width: 300px;
    height: 400px;
    background-color: #fff;
}

</style>
