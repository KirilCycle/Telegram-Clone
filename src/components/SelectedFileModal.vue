<template>
  <div class="file-upl-content">
    <span class="material-symbols-outlined"> attach_file </span>
    <input
      accept="image/gif, image/jpeg, image/png"
      @change="uploadImage"
      class="file-input"
      type="file"
    />
  </div>

  <Teleport to="body">
    <div v-if="v" class="bloor">
      <div class="modal">
        <div class="img-container">
          <img :src="preview" />
        </div>

        <div class="capture-container">
          <input v-model="capture" type="text" placeholder="Caption" />
        </div>
        <div class="modal_manage">
          <button @click="v = false">Cancel</button>
          <button @click="() => postMessage(photo, capture, $emit)">Send</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth } from "@firebase/auth";
import { uuidv4 } from "@firebase/util";

export default {
  props: {
    files: Array,
    required: true,
  },
  methods: {
    uploadImage(event) {
      if (event.target.files[0]) {
        if (
          event.target.files[0].name.includes(".png") ||
          event.target.files[0].name.includes(".jpg")
        ) {
          this.photo = event.target.files[0];
          this.preview = URL.createObjectURL(event.target.files[0]);
          this.v = true;
        } else {
          this.photo = false;
        }
      }
    },
  },
  data() {
    return {
      capture: "",
      v: false,
      filePreview: null,
      photo: null,
    };
  },
  setup(props) {
    const storage = getStorage();

    const auth = getAuth();

    // async function sendMessage(text) {
    //   // const { photoURL, uid, displayName } = store.state.user.value;
    //   if (auth.currentUser && text.length > 0 && text.length < 2000) {
    //     messagesColection.add({
    //       userName: auth.currentUser.displayName
    //         ? auth.currentUser.displayName.slice(0, 25)
    //         : auth.currentUser.email,
    //       userId: auth.currentUser.uid,
    //       userPhotoURl:
    //         auth.currentUser.photoURL &&
    //         !auth.currentUser.photoURL.includes("examle")
    //           ? auth.currentUser.photoURL
    //           : "https://5.imimg.com/data5/AK/RA/MY-68428614/apple-1000x1000.jpg",
    //       text: text,
    //       messageId:
    //         uuidv4() +
    //         auth.currentUser.uid.replaceAll(" ", "") +
    //         text.replaceAll(" ", ""),
    //       createdAt: firebase.firestore.FieldValue.serverTimestamp(),

    //     });
    //     value.value = ''
    //   }
    // }

    // 'file' comes from the Blob or File API

    function postMessage(photo, capture, emit) {
      const storageRef = ref(storage, `images/${photo.name + uuidv4()}`);
      uploadBytes(storageRef, photo)
        .then((snapshot) => {
          console.log(storageRef._location.path_, "Uploaded a blob or file!");

          emit("sendmesimg", capture, storageRef._location.path_);
        })
        .catch((er) => console.log(er, "post er"));
    }
    return {
      postMessage,
    };
  },
};
</script>

<style lang="scss" scoped>
$padhor: 10px;
$padver: 16px;

%paddings-setup {
  padding-top: $padver;
  padding-bottom: $padver;
  padding-right: $padhor;
  padding-left: $padhor;
  box-sizing: border-box;
}
.file-upl-content {
  padding: 15px;
  overflow: hidden;
  width: 15px;
  height: 100%;
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  position: relative;

  span {
    display: inline;
    position: absolute;
  
    height: 100%;
    width: 15px;
    color: #404661;
    top: 0%;
    font-size: 2rem;
    
  }

  .file-input {
    width: 13px;
    position: absolute;
    background-color: red;
    border-radius: 0px;
    height: 100%;
 
    opacity: 0;
  }
}

.bloor {
  position: fixed;
  background-color: #1e1e1ebb;
  width: 100%;
  display: block;
  height: 100%;

  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #232323;
    min-width: 330px;
    min-height: 410px;

    .img-container {
      width: 100%;
      height: 65%;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        max-height: 65%;
        max-width: 100%;
      }
    }

    .capture-container {
      @extend %paddings-setup;
      input {
        width: 100%;
        border-radius: 0px;
        border-bottom: 1px solid #0091ff;
        box-sizing: border-box;
        height: 30px;
        font: 1rem sans-serif;
        color: gray;
      }
    }
    .modal_manage {
      position: absolute;
      background-color: rgba(102, 51, 153, 0);
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: max-content;

      button {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        cursor: pointer;
        font-weight: 550;
        color: #0091ff;
        border-radius: 5px;
        @extend %paddings-setup;

        &:hover {
          background-color: rgba(0, 145, 255, 0.083);
          @extend %paddings-setup;
        }
      }

      @extend %paddings-setup;
    }
  }
}
</style>
