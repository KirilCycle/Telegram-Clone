<template>
  <Teleport to="body">
    <div
      @click.prevent="$emit('closed')"
      @touchmove.prevent="null"
      class="conatiner"
      v-if="visible"
    >
      <div class="msg-prew">
        <div class="msg_prev_prof_img_container">
          <img :src="profileurl" />
        </div>
        <div class="msg_prew_body">
          <h3>{{ message.userName.slice(0, 18) }}</h3>
          <p >{{ message.text.slice(0,100) }}</p>
        </div>
      </div>

      <div class="modal">
        <ul class="actions-list">
          <li v-if="ableTodelete" @click.prevent="remMsg">
            <span class="material-symbols-outlined"> delete </span>
            <button>Delete</button>
          </li>
          <li @click="setReplyTarger">
            <span class="material-symbols-outlined"> reply </span>
            <button>Reply</button>
          </li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>

<script>
import store from "@/store/store";
import { deleteDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import ProfileImage from "@/components/ProfileImage.vue";


export default {
  components: { ProfileImage },
  props: {
    message: Object,
    msgRef: Object,
    profileurl: String,
    visible: Boolean,
    removeMsg: Function,
    required: true,
  },
  methods: {
    async remMsg() {
     this.removeMsg(store.state.chat.chatId,this.message)

    console.log(store.state.chat.chatId,this.message, 'DEL AC',this.removeMsg )
    },
    show() {
       console.log(this.message)
    },
    setReplyTarger () {
        store.commit('chat/setReplyMsgRef', this.msgRef)
        store.commit('chat/setFrom',this.message.userName)
        store.commit('chat/setText', this.message.text)
        console.log(store.state.chat.replyMsgRef, 'FROM REDUX')
    }
  },
  data() {
    return {
      capture: "",
      ableTodelete: this.message.userId === store.state.user.user.uid,
      v: false,
      filePreview: null,
      photo: null,
    };
  },
  created() {
   console.log( this, 'RESULT');
  },
};
</script>

<style lang="scss" scoped>
$crazy_color: #00ff44;

.msg-prew {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    transform: translate(-50%, -50%);
    min-width: 310px;
    width: 90%;
    top: 30%;
    left: 50%;
    max-height: 150px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    .msg_prev_prof_img_container {
      width: 35px;
      height: 35px;
      margin-top: 5px;
      border-radius: 50%;
      top: 60px;
      overflow: hidden;
      left: 5px;
    
      img {
        width: 100%;
        min-height: 100%;
        object-fit: cover;
      }
    }
    
    .msg_prew_body {
        word-break: break-all;
        
        width: 85%;
        background-color: #212121;
        border-radius: 5px;
        padding: 10px;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        h3 {
            font-size: 1rem;
            font-weight: 500;
            color: $crazy_color;
        }
    
        p {
            font-size: 0.9rem;
            color: rgb(241, 241, 241);
        }
    }
}

.conatiner {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
  position: fixed;
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  z-index: 100;
  backdrop-filter: blur(7px);
  background-color: #000000ce;


  .modal {
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #232323d2;
    min-width: 230px;
    min-height: 310px;
    backdrop-filter: blur(7px);
    border-radius: 5px;
    overflow: hidden;

    .actions-list {
      width: 100%;
      font-size: 1rem;
      font-weight: normal;
      box-sizing: border-box;

      li {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        color: #fff;
        padding: 9px 11px 9px 11px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        flex-direction: row;
        cursor: pointer;

        button {
          height: 100%;
          padding: 10px;
        }

        span {
          font-size: 0.8rem sans-serif;
          font-weight: 300;
        }

        &:hover {
          background-color: rgb(53, 53, 53);
        }
      }
    }
  }
}
</style>
