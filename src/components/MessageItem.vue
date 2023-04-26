<template>
  <div ref="msg" :class="{ 'my-item': isMy }" class="item">
    <div ref="scrollTarget"></div>

    <div
      v-on:click.right="(e) => handleSelectMsg(e)"
      @touchend="stop"
      @touchstart="(e) => start(e, handleTouch)"
      @touchmove="(e) => touchMoveHandle(e)"
      @contextmenu.prevent="messageActions"
      class="item-body"
    >
      <div v-if="message.sender" class="forward">
        <p>Forwarded message</p>
        <h4 @click="() => handle(message.sender.userId)">
          {{ message.sender?.userName }}
        </h4>
      </div>

      <div class="img-wrp" v-if="message.source">
        <img v-if="message.source.type === 'img'" :src="message.source.src" />
        <video
          class="video-player"
          v-else
          :src="message.source.src"
          controls
        ></video>
      </div>

      <div class="item_body_text">
        <p>{{ message.text }}</p>
        <label>{{ time }}</label>
      </div>

      <div class="emoji-wrap" v-if="emojis">
        <div
          @click="() => replyEmoji(em[0], message)"
          class="emoji-c"
          v-for="em in emojis"
          :key="em[0]"
        >
          <p>
            {{ em[0] }}
          </p>
          <emoji-user :key="id" v-for="id in em[1]" :senderid="id"></emoji-user>
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
import SmallChatImage from "./SmallChatImage.vue";
import EmojiContainer from "./EmojiContainer.vue";
import { objectEntries } from "@vueuse/core";
import EmojiUser from "./EmojiUser.vue";
import { replyEmoji } from "@/features/replyUsingEmoji";

export default {
  components: {
    ProfileImage,
    SmallChatImage,
    EmojiContainer,
    EmojiUser,
  },

  props: {
    message: Object,
    isMy: Boolean,
    next: Object,
    last: Boolean,
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
      message: this.message,
      emojis: this.message.emj,
      replyEmoji,
    };
  },
  updated() {
     console.log(  'updated');
     if (store.state.chat.chatsScrollPosition[store.state.chat.chatId]?.last.id === this.message.id) {
      
      this.$refs.scrollTarget.style.height = "30px";
      this.$refs.scrollTarget.style.width = "30px";
      this.$refs.scrollTarget.style.backgroundColor = "red";
      console.log(this.last, 'HA ?');

      store.commit("chat/changeChatsScrollData", {
          id: store.state.chat.chatId,
          key: "last",
          data: {id:this.message.id, ref: this.$refs.scrollTarget},
        });


     }
  },
  // mounted() {
  //   if (this.last.i === this.last.length - 1) {
     
  //     this.$refs.scrollTarget.style.height = "30px";
  //     this.$refs.scrollTarget.style.width = "30px";
  //     this.$refs.scrollTarget.style.backgroundColor = "red";
  //     console.log(this.last, 'HA ?');

      
  //   } else {
  //   }
  // },
  computed: {
    time() {
      if (this.message?.createdAt) {
        let date = new Date(this.message?.createdAt.seconds * 1000);

        let hours = date.getHours();

        let minutes = +date.getMinutes();

        return `${hours}:${minutes}`;
      }
      return "";
    },

    emojis() {
      if (this.message.emj) {
        return objectEntries(this.message.emj);
      }
      return false;
    },
  },

  methods: {
    handle(us) {
      const first = us + store.state.user.user.uid;

      const second = store.state.user.user.uid + us;

      console.log("handle us ", store.state.chat.chatIdList);

      if (store.state.chat.chatIdList) {
        if (store.state.chat.chatIdList.find((ch) => ch.id === first)) {
          store.commit("chat/setSelectedUser", us);
          store.commit("chat/setChatId", first);
        } else if (store.state.chat.chatIdList.find((ch) => ch.id === second)) {
          store.commit("chat/setSelectedUser", us);
          store.commit("chat/setChatId", second);
        } else {
        }
      } else {
      }
    },
    handleEmojiClick(emj) {
      //find my id and delete here
      //

      console.log(emj);
    },
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
@import "@/styles/colors.scss";
.img-wrp {
  width: 100%;

  img {
    border-radius: 10px;
    width: 100%;
    max-height: 100%;
    max-height: 83vh;
  }

  video {
    @extend img;
    border-radius: 0px;
  }

  .video-player:hover {
    cursor: pointer;
  }

  .video-player::-webkit-media-controls {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  .video-player:hover::-webkit-media-controls {
    opacity: 1;
  }

  .video-player::-webkit-media-controls-start-playback-button {
    display: none;
  }

  .video-player:hover::-webkit-media-controls-start-playback-button {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

%no-select {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}

%emoji {
  width: max-content;
  padding: 1px;
  height: auto;
  position: relative;
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.emoji-wrap {
  max-width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  @extend %no-select;
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
    background: $content-main;
    color: $text-main;
    margin-bottom: 7px;

    flex-wrap: wrap;
    position: relative;

    display: inline-block;

    margin-left: 10px;
    max-width: 500px;
    word-break: break-all;
    overflow-wrap: break-word;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    border-top-left-radius: 20px;
    width: max-content;
    min-width: 80px;
    max-width: 70%;
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
  .item-body {
    background: $content-main-l;
    color: $text-main-l;

    word-break: break-all;
  }

  .emoji-c {
    background-color: $content-main-l;
    border: 1px solid $main;
  }
}

.item .emoji-c {
  @extend %emoji;
  background-color: $content-main-dark;
  border: 1px solid $content-main-dark;
}

.my-item .emoji-c {
  @extend %emoji;
  background-color: $second;
  border: 1px solid $second;
}

.dark .my-item {
  .emoji-c {
    background-color: $second;
    border: 1px solid $second;
  }
  .item-body {
    background: $main;
    color: white;
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

  .item-body {
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

.forward {
  p {
    font-size: 0.8rem;
  }
  h4 {
    font-size: 0.9rem;
    cursor: pointer;
  }
}
</style>
