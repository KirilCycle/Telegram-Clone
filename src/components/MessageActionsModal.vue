<template>
  <Teleport to="body">
    <div
      @click.prevent="$emit('closed')"
      @touchmove.prevent="null"
      class="conatiner"
      v-if="visible"
    >
      <div class="modal">
        <ul class="actions-list">
          <li v-if="ableTodelete" @click.prevent="remMsg">
            <span  class="material-symbols-outlined">
                delete
                </span>
            <button>Delete</button>
          </li>
          <li>
            <span class="material-symbols-outlined">
                reply
                </span>
            <button>Reply</button>
          </li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>

<script>
import store from '@/store/store';
import { deleteDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";

export default {
  props: {
    message: Object,
    profileurl: String,
    visible: Boolean,
    required: true,
  },
  methods: {
    async remMsg() {

      await deleteDoc(doc(store.state.user.db, "messages", this.message.id));
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
};
</script>

<style lang="scss" scoped>
.conatiner {
  position: fixed;
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  z-index: 100;
  background-color: #000000ce;

  .modal {
    position: absolute;
    top: 50%;
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
