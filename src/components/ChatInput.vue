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
 position: fixed;
  width: 100%;
  margin: 0px;


  padding: 0px 10px 0px 10px;
  background-color: #1f1e1ee6;
  backdrop-filter: blur(8px);
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  bottom: 0;
  align-items: center;
  box-sizing: border-box;


  .content {
    
    box-sizing: border-box;
    width: 100%;
    background-color: red;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    justify-content: space-around;
    display: flex;
    height: 90%;
   

    input {
      width: 100%;
      height: 100%;
      background-color: #ffffff75;
    }

    button {
      width: 35px;
      height: 35px;
      background-color: #585858;
      flex-shrink: 0;
    }



  }
}
</style>
