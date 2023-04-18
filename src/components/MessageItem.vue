<template>
  <div ref="msg" :class="{ 'my-item': isMy }" class="item">
     
       
    <!-- <profile-image :visible="next?.userId.includes(message?.userId)" :profilePhotoUrl="profilePhotoUrl"></profile-image> -->


    <div
      v-on:click.right="(e) => handleSelectMsg(e)"
      @touchend="stop"
      @touchstart="(e) => start(e, handleTouch)"
      @touchmove="(e) => touchMoveHandle(e)"
      @contextmenu.prevent="messageActions"
      class="item-body"
    >
      <!-- <div class="user-name">
        <p>{{ message.userName }}</p>
      </div> -->
      <div class="img-wrp" v-if="message.imageRef">
        <img :src="message.imageRef" />
      </div>
      <div class="image-container" v-if="photoURL">
        <img
          :src="`https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/847px-Red_Apple.jpg`"
        />
      </div>

      <div class="reply-block" v-if="message.replyData">
        <div v-if="message.replyData.img">
          <small-chat-image :src="message.replyData.img"></small-chat-image>
        </div>

        <h3>{{ message.replyData.from }}</h3>
        <p>{{ message.replyData.text }}</p>
      </div>

      <div class="item_body_text">
        <p :ref="message.id">{{ message.text }}</p>
        <label>{{ time }}</label>
      </div>
      <div class="emoji-c">
        <div v-for="em in message.emj" :key="em.id">
        
          {{em.em}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import store from "@/store/store";
import { getAuth } from "firebase/auth";
import ProfileImage from "./ProfileImage.vue";
import MessageActionsModal from "./MessageActionsModal.vue";
import SmallChatImage from "./SmallChatImage.vue";

export default {
  components: { MessageActionsModal, ProfileImage, SmallChatImage },

  props: {
    message: Object,
    isMy: Boolean,
    next: Object,
    removeMessage: Function,
    required: true,
  },

  data() {
    return {
      ableTodelete: this.message.userId === store.state.user.user.uid,
      profilePhotoUrl: this.message.userPhotoURl
        ? this.message.userPhotoURl
        : "",
      removeMessage: this.removeMessage,
      isMy: this.isMy,
      next: this.next,
    };
  },

  computed: {
    time() {
      let date = new Date(this.message?.createdAt.seconds * 1000);

      let hours = date.getHours();

      let minutes = +date.getMinutes();

      return `${hours}:${minutes}`;
    },
  },

  methods: {
    handleTouch(e) {
      console.log("TOCUB");

      store.commit("message/setReplyMsgRef", this.$refs.msg);
      // store.commit('message/setClickCoords', {
      //   x: e.clientX,
      //   y: e.clientY
      // } )

      store.commit("message/setSelectdMsg", this.message);

      console.log(store.state.message.selectedMsgData, "SELECTED");

      store.commit("message/setVisible", true);

      
    },
    handleSelectMsg(e) {
      store.commit("message/setReplyMsgRef", this.$refs.msg);
      store.commit("message/setClickCoords", {
        x: e.clientX,
        y: e.clientY,
      });

      store.commit("message/setSelectdMsg", this.message);
      store.commit("message/setVisible", true);

      console.log(store.state.message.selectedMsgData, "SELECTED");

      //

      // store.commit('message/setReplyTarget',
      //  {
      //    text: this.message.text,
      //    from: this.message.userName,
      //   ...( this.message.imageRef?  {  img:  this.message.imageRef } : {} )

      //  }
      // )

      console.log(store.state.message, "FROM REDUX");
    },
  },

  setup(props) {
    const auth = getAuth();

    const myTimeout = ref(null);

    function start(e, execute) {
      myTimeout.value = setTimeout(() => execute(e), 600);
    }

    function stop() {
      clearTimeout(myTimeout.value);
    }

    const msg = ref(null);

    const pivotTouch = ref(30);

    function touchMoveHandle(e) {
      clearTimeout(myTimeout.value);

      let elementwidth = msg.value.offsetWidth;

      let elementPosition = msg.value.clientX;
      // msg.value.style.transform = `translateX(${ msg.value.offsetWidth  }px)`
      console.log(elementPosition);
    }

    const visible = ref(false);

    return {
      // photoSrc,
      stop,
      touchMoveHandle,
      msg,
      open,
      start,
      auth,
      visible,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';
.img-wrp {
  max-width: 100%;
  min-width: 90%;
  min-height: 340px ;

  img {
    border-radius: 5px;
    width: 100%;
    height: 100%;
  }
}

%no-select {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}

.item {
  min-width: 150px;
  max-width: 900px;
  width: 500px;
  position: relative;
  display: flex;

  .reply-block {
    max-width: 93%;
    max-height: 38px;
    display: flex;
    flex-direction: column;
    margin-left: 7px;
    padding-left: 2px;
    overflow: hidden;
    height: min-content;
    border-left: #fff 3px solid;
    h3 {
      font-size: 0.9rem;
      line-height: normal;
    }
    p {
      color: #d7d7d7;
      font-size: 0.8rem;
    }
  }

  .item-body {
    width: 100%;

    left: 0px;
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-top: 0px;
    padding-left: 6px;
    padding-right: 35px;

    .item_body_text {
      font-size: 0.9rem;
      margin-top: 0px;
      padding-left: 6px;
      padding-right: 35px;
      p {
        font-weight: 200;
      }
    }

    padding: 8px;
    background:  $content-main;
    color:  $text-main;
    margin-bottom: 7px;
    flex-wrap: wrap;
    position: relative;
    right: 0px;
    margin-left: 10px;
    display: inline-block;
    max-width: 500px;
    word-break: break-all;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    border-top-left-radius: 20px;
    width: max-content;
    min-width: 80px;
    max-width: 70%;
  }

  .image-container {
    margin-top: 100%;
    width: 100%;
    background-color: rgb(76, 76, 76);

    img {
      max-width: 100%;
      min-width: 100%;
    }
  }

  label {
    font-size: 0.7rem;
    position: absolute;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
    right: 8px;
    color: rgb(223, 222, 222);
    bottom: 4px;
  }
}

.dark .item { 
  .item-body{
    background:  $content-main-l;
    color:  $text-main-l;
  }
}

.dark .my-item { 
  .item-body{
    background:  $main;
    color:  white;
  }

}

@media (pointer: coarse) {
  //tch sreen
  .my-item {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }

  .item {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }
}

.my-item {
  transform: translateX(0px);
  transition: transform 0.2s ease-out;
  max-width: 600px;
  position: relative;
  width: max-content;
  display: flex;

  .item-body{
    right: 0px;
    padding-right: 10px;
    .item_body_text {
      text-align: left;
      font-size: 0.9rem;
      margin-top: 0px;
      padding-left: 6px;
      padding-right: 35px;
    }
    .user-name {
      display: none;
    }
    padding: 8px;
    color: white;
    background: rgb(84, 175, 213);
    margin-bottom: 7px;
    position: relative;

    display: inline-block;
    max-width: 500px;
    word-break: break-all;

    right: 0px;
    margin-left: 10px;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    width: auto;
    line-height: 19px;

    p {
    }
  }
  .reply-block {
    max-width: 93%;
    max-height: 38px;
    display: flex;
    flex-direction: column;
    margin-left: 7px;
    padding-left: 2px;
    overflow: hidden;
    height: min-content;
    border-left: #fff 3px solid;
    h3 {
      font-size: 0.9rem;
      line-height: normal;
    }
    p {
      color: #d7d7d7;
      font-size: 0.8rem;
    }
  }

  .image-container {
    width: 100%;
    background-color: rgb(76, 76, 76);

    img {
      max-width: 100%;
      min-width: 100%;
    }
  }

  label {
    font-size: 0.7rem;
    margin-left: 10px;
    color: rgb(223, 222, 222);
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }
  .time {
  }
}

@media (max-width: 1115px) {
  .my-item {
    right: 0%;
  }
}

@media (max-width: 910px) {
  .my-item {
    width: min-content;
    display: flex;
    max-width: 500px;
    .item-body {
      right: 0px;
      .item_body_text {
        text-align: left;
        font-size: 0.9rem;
        margin-top: 0px;
        padding-left: 6px;
        padding-right: 35px;
      }
      .user-name {
        display: none;
      }
      word-break: break-all;
      padding: 8px;
      color: white;
      display: flex;

      flex-wrap: wrap;
      position: relative;
      right: 0px;
      margin-left: 10px;
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
      width: max-content;

      line-height: 19px;
    }
  }

  @media (max-width: 500px) {
    .my-item {
      width: min-content;
      display: flex;
      max-width: 350px;
    }
  }

  @media (max-width: 440px) {
    .my-item {
      width: min-content;
      display: flex;
      max-width: 320px;
    }
  }
}
</style>
