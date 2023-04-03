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
          <button
            :class="{ 'btn-disabled': notready }"
            :disabled="notready"
            @click="v = false"
          >
            Cancel
          </button>
          <button
            :class="{ 'btn-disabled': notready }"
            :disabled="notready"
            @click="
              () => {
                postMessage(photo, capture, $emit);
              }
            "
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "@firebase/auth";
import { uuidv4 } from "@firebase/util";

export default {
  props: {
    files: Array,
    notready: Boolean,
    required: true,
  },
  methods: {
    uploadImage(event) {
      if (event.target.files[0]) {
        const uploadedTarget = event.target.files[0].name;

        if (
          uploadedTarget.includes(".png") ||
          uploadedTarget.includes(".jpg") ||
          uploadedTarget.includes(".jpeg") ||
          uploadedTarget.includes(".svg")
        ) {
          this.photo = event.target.files[0];
          this.preview = URL.createObjectURL(this.photo);
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

    async function postMessage(photo, capture, emit) {
      emit("notready", true);
      const storageRef = ref(storage, `images/${photo.name + uuidv4()}`);

      uploadBytes(storageRef, photo)
        .then((snapshot) => {

          getDownloadURL(storageRef)
              .then((url) => {
                emit("sendmesimg", capture, url);
              })

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
  cursor: pointer;
  &:hover {
    span {
      color: #767676;
    }
  }
  width: 20px;
  overflow: hidden;
  height: 100%;
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-right: 5px;

  span {
    display: block;
    position: relative;
    right: 10px;
    height: 30px;
    width: 15px;
    color: #404661;
    top: 0%;
    margin: 0% auto;
    font-size: 2rem;
    &:hover {
      color: #767676;
    }
  }

  .file-input {
    width: 13px;
    position: absolute;
    border-radius: 0px;
    height: 100%;
    opacity: 0;
  }
}

.bloor {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
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
    background-color: #1c1c1c;
    min-width: 330px;
    min-height: 410px;
    border-radius: 15px;

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
        border-bottom: 1px solid #52b4ff;
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

      .btn-disabled {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        cursor: pointer;
        font-weight: 550;
        color: #535353;
        border-radius: 5px;
        @extend %paddings-setup;

        &:hover {
          background-color: rgba(0, 145, 255, 0);
          @extend %paddings-setup;
        }
      }

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
