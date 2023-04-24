<template>
  <div class="sub-cht">
    <div v-for="msg in chatPart" :key="msg" class="msg"></div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    getData: Object,
    required: true,
  },
  setup(props, { emit }) {
    const chatPart = ref([]);

    for (let i = 0; i < 10; i++) {
      chatPart.value.push(i + props.getData.localId);
      console.log("i");
    }

    emit("dataToNextMove", chatPart.value[0], chatPart.value[9], props.getData.localId);
    

    return {
      chatPart,
    };
  },
};
</script>

<style lang="scss" scoped>
.msg {
  width: 200px;
  height: 85px;
  margin: 5px;
  background-color: #00fa58;
}

.sub-cht {
    border-bottom: 1px solid rgb(46, 31, 255) ;
    border-top: 1px solid rgb(46, 31, 255) ;
}
</style>
