<template>
  <div class="input-container">
    <div class="content">
      <span>
        <span class="material-symbols-outlined"> attach_file </span>
      </span>
      
     
      <input v-model="value" placeholder="Write a message..." />

      <button @click="() =>sendMsg(value)">
        <span class="material-symbols-outlined">
          send
          </span>
      </button>
      <span class="material-symbols-outlined">
        keyboard_voice
        </span>
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
  padding: 0px 10px 0px 0px;
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
    position: relative;
    box-sizing: border-box;
    width: 100%;
    max-width: inherit;
    background-color: rgba(125, 125, 125, 0.406);
    justify-content: center;
    align-items: center;
    flex-direction: row;
    justify-content: space-around;
    display: flex;
    height: 90%;
   

    input {
      width: 100%;
      max-width: 100%;
      height: 100%;
      font-size: 1rem;
      background-color: #ffffff00;
      color: white;
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
