<template>
  <div ref="msg"  :class="{ 'my-item': isMy }"  class="item">
   
  <profile-image :profilePhotoUrl="profilePhotoUrl"></profile-image>
   
    <div
     v-on:click.right="visible  = true"
      @touchend="stop"
      @touchstart="start"
      @touchmove="stop"
      @contextmenu.prevent="messageActions"
      class="item-body"
    >
      <p class="user-name">{{ message.userName }}</p>
      <div class="image-container" v-if="photoURL">
        <img :src="`https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/847px-Red_Apple.jpg`" />
      </div>
      <p :ref="message.id" class="item_body_text">{{ message.text }}</p>
    </div>
    <message-actions-modal :removeMsg="removeMessage" :msgRef="msgRef" v-if="visible" @closed="visible = false" :visible="visible" :profileurl="profilePhotoUrl" :message="message"></message-actions-modal> 
  </div>
</template>

<script>
import { ref } from "vue";
import { getStorage, getDownloadURL } from "firebase/storage";
import store from "@/store/store";
import { doc, updateDoc, deleteField } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import ProfileImage from "./ProfileImage.vue";
import MessageActionsModal from './MessageActionsModal.vue';


export default {
  components: { MessageActionsModal, ProfileImage },

  props: {
    message: Object,
    isMy: Boolean,
    removeMessage: Function,
    required: true,
    
  },


  data() {
    return {
      ableTodelete: this.message.userId === store.state.user.user.uid,
      profilePhotoUrl: this.message.userPhotoURl?this.message.userPhotoURl: '',
      removeMessage: this.removeMessage,
      isMy: this.isMy
      
    };
  },


 
  setup(props) {
    
   const auth = getAuth()
    
    const myTimeout = ref(null)
    
    function open() {
      visible.value = true
    }
    function start () {
      myTimeout.value = setTimeout(open, 600) 
    }

    function stop() {
      clearTimeout(myTimeout.value)
    }

    const visible = ref(false)


    return {
      // photoSrc,
      stop,
      open,
      start,
      auth,
      visible
    };
  },
};
</script>

<style lang="scss" scoped>
$crazy_color: #8db2fa;

.message-ations {
  position: absolute;
  width: 120px;
  height: auto;
  right: -10px;
  bottom: 0px;
  border-radius: 5px;
  overflow: hidden;
  z-index: 30;
  backdrop-filter: blur(5px);
  background-color: #323232d7;

  li {
    width: 100%;
    box-sizing: border-box;
    cursor: pointer;
    color: white;
    padding: 5px;
    &:hover {
      background-color: #8f8f8f9b;
    }
  }
}

.item {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
  width: 65%;
  position: relative;
  display: flex;

  
  .item-body {
    
    left: 0px;
    .item_body_text {
      text-align: left;
      font-size: 0.9rem;
      margin-top: 15px;
    }
    .user-name {
      font-size: 1rem;
      position: absolute;
      font-weight: 500;
      top: 5px;
      left: 13px;
      color: $crazy_color;
    }
    word-break: break-all;
    padding: 13px;
    color: white;
    background: rgb(24, 24, 24);
    display: flex;
    margin-bottom: 15px;
    flex-wrap: wrap;
    position: relative;
    right: 0px;
    margin-left: 10px;
    border-radius: 10px;
    width: 70%;
  }

  .image-container {
    margin-top: 15px;
    width: 100%;
    background-color: rgb(76, 76, 76);

    img {
      max-width: 100%;
      min-width: 100%;
    }
  }

  .time {
    font-size: 0.6rem;
    color: gray;
  }
}




.my-item {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
  width: 65%;
  position: relative;
  left:30% ;
  display: flex;
  flex-direction:row-reverse;
  
  
  .item-body {
    
    right: 0px;
    .item_body_text {
      text-align:left;
      font-size: 0.9rem;
      margin-top: 0px;
    }
    .user-name {
     display: none;
     
    }
    word-break: break-all;
    padding: 13px;
    color: white;
    background: rgb(73, 119, 197);
    display: flex;
    margin-bottom: 15px;
    flex-wrap: wrap;
    position: relative;
    right: 0px;
    margin-left: 10px;
    border-radius: 10px;
    
    min-width: 100px;
    max-width: 70%;
  }
  
  .image-container {
    width: 100%;
    background-color: rgb(76, 76, 76);
    
    img {
      max-width: 100%;
      min-width: 100%;
    }
  }
  
  .time {
    font-size: 0.6rem;
    color: gray;
  }
  





}

</style>
