<template>
  <div class="input-container">
    <div class="content">
      <span>
        <selected-file-modal  @sendmesimg="sendMsg" ></selected-file-modal>

        <!-- @notready="messageisNotReady = true"
        :notready="messageisNotReady"
        @sendmesimg="sendMessage" -->
      </span>

      <input v-model="value" placeholder="Write a message..." />

      <span class="material-symbols-outlined"> keyboard_voice </span>
      <button  @click="send">
        <span class="material-symbols-outlined"> send </span>
      </button>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import SelectedFileModal from './SelectedFileModal.vue';
export default {
  components: { SelectedFileModal },
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
    send(text, img) {
      if (!img) {
        this.sendMsg(this.value)
        this.value = ''
      } else {
        this.sendMsg(text, img)
      }
    },

  },
};
</script>

<style lang="scss" scoped>
 $custom-c2: rgb(32, 32, 32);;
.input-container {
  width: 100%;
  padding: 0px 10px 0px 6px;
  backdrop-filter: blur(8px);
  background-color:  $custom-c2;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  bottom: 0;
  align-items: center;
  box-sizing: border-box;

  span {
    font-size: 1.9rem;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
    cursor: pointer;

    &:hover {
      color: rgb(169, 169, 169);
    }
  }

  .content {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    max-width: inherit;
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
      color: rgb(68, 134, 255);
      flex-shrink: 0;
      -webkit-user-select: none; /* Safari */
      -ms-user-select: none; /* IE 10 and IE 11 */
      user-select: none; /* Standard syntax */

      &:hover {
        
      }

      
    }
  }
}
</style>
