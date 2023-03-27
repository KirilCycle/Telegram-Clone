<template>
  <div class="item">
    <div class="profile-conatainer">
      <img :src="profilePhotoUrl" />
    </div>
    <div
      @touchend="stop"
      @touchstart="start"
      @touchmove="stop"
      @contextmenu.prevent="messageActions"
      class="item-body"
    >
      <p class="user-name">{{ message.userName.slice(0, 18) }}</p>
      <div class="image-container" v-if="photoURL">
        <img :src="photoURL" />
      </div>
      <p class="item_body_text">{{ message.text }}</p>
    </div>
    
   <message-actions-modal @closed="visible = false" :visible="visible"></message-actions-modal>
    <!-- <ul v-if="visible" class="message-ations">
      <li @click="deleteMes" v-if="ableTodelete">delete</li>
      <li>reply</li>
    </ul> -->
    
  </div>
</template>

<script>
import { ref } from "vue";
import { getStorage, getDownloadURL } from "firebase/storage";
import store from "@/store/store";
import { doc, updateDoc, deleteField } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import MessageActionsModalVue from './MessageActionsModal.vue';
import MessageActionsModal from './MessageActionsModal.vue';

export default {
  components: { MessageActionsModal },

  props: {
    message: Object,
    isMy: Boolean,
    required: true,
  },
  data() {
    return {
      ableTodelete: this.message.userId === store.state.user.user.uid,
      profilePhotoUrl: this.message.photoURL
        ? this.message.photoURL
        : "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/847px-Red_Apple.jpg",
      
    };
  },
  methods: {


    selectAction(e) {
      console.log("select");
    },

    async deleteMes() {
      await deleteDoc(doc(store.state.user.db, "messages", this.message.id));
    },

    async fetchUs() {
      const storage = getStorage();

      const pathReference = store.state.user.customStorageRef(
        storage,
        `${this.message.userPhotoURl}`
      );

      getDownloadURL(pathReference)
        .then((url) => {
          console.log(url, "AS PATH FROM ITEM");
          this.profilePhotoUrl = url;
        })
        .catch((er) => console.log("er", er));
    },
  },

  created() {
    if (this.profilePhotoUrl) {
      this.fetchUs();
    } else {
      this.profilePhotoUrl =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/847px-Red_Apple.jpg";
    }
  },

  setup(props) {
    const auth = getAuth();

    const visible = ref(false)

    const photoURL = ref(null);

    console.log(props.message.userPhotoURl, "ASS I NEED");

    const storage = getStorage();
    // async function SUS (){

    if (props.message.imageRef) {
      const pathReference = store.state.user.customStorageRef(
        storage,
        `${props.message.imageRef}`
      );

      console.log(pathReference, "HHHHHEEEEERERREREEEE");

      getDownloadURL(pathReference).then((url) => {
        console.log(url, "AS PATH MESI");
        photoURL.value = url;
      });
    }

    
    const myTimeout = ref(null)
    
    function open() {
      visible.value = true
    }
    function start () {
      myTimeout.value = setTimeout(open, 500) 
    }

    function stop() {
      clearTimeout(myTimeout.value)
    }

    return {
      // photoSrc,
      stop,
      open,
      start,
      auth,
      photoURL,
      visible
    };
  },
};
</script>

<style lang="scss" scoped>
$crazy_color: #00ff44;

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
  width: 85%;
  position: relative;
  display: flex;

  .profile-conatainer {
    width: 35px;
    height: 35px;
    margin-top: 5px;
    border-radius: 50%;

    position: sticky;
    top: 60px;
    overflow: hidden;
    left: 5px;

    img {
      width: 100%;
      min-height: 100%;
      object-fit: cover;
    }
  }
  .item-body {
    left: 0px;
    .item_body_text {
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

    padding: 13px;
    color: white;
    background: rgb(35, 35, 35);
    display: flex;
    margin-bottom: 15px;
    flex-wrap: wrap;
    position: relative;
    right: 0px;
    margin-left: 10px;
    border-radius: 5px;
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

.my_item {
  width: 70%;
  padding: 10px;
  color: rgb(255, 255, 255);
  background: rgb(28, 243, 67);
  margin-top: 15px;
  margin: 15px;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  right: 0px;
  border-radius: 5px;

  .time {
    font-size: 0.6rem;
    color: gray;
  }
}
</style>
