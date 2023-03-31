<template>
  <div class="input-container">
    <div class="content">
      <span>
        <span class="material-symbols-outlined"> attach_file </span>
      </span>
      <input v-model="value" placeholder="Write a message..." />

      <button @click="() =>sendMsg(value)">enter</button>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
export default {
  props: {
    sendMsg: Function,
    required: true,
  },

  data() {
    return {
      value: "",
      sendMsg: this.sendMsg,
    };
  },
  methods: {
    send() {
        this.sendMsg(this.value)
    },
  },
};
</script>

<style lang="scss" scoped>
.input-container {
  width: 100%;
  height: 40px;
  position: fixed;
  bottom: 0px;
  background-color: #202020;
  padding: 5px 10px 5px 10px;

  .content {
    margin: 0% auto;
    height: 40px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    justify-content: center;
    align-items: center;
    span {
      overflow: hidden;
      height: 100%;
      flex-shrink: 0;
    }

    input {
      width: 100px;
      height: 100%;
      background-color: #fff;
    }

    button {
      width: 35px;
      display: flex;
      flex-shrink: 0;
      background-color: red;
      height: 100%;
    }
  }
}
</style>
