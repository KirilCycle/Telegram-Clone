<template>
  <div class="file-upl-content">
    <span class="material-symbols-outlined"> attach_file </span>
    <input
      accept="image/gif, image/jpeg, image/png, video/mp4, video/avi, video/mov, video/wmv, video/flv, video/mkv, video/webm"
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
                postMessage(source, capture, $emit, reset, type);
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
import {   uploadBytesResumable, } from 'firebase/storage';

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
          uploadedTarget.includes(".svg") ||
          uploadedTarget.includes(".PNG")
        ) {
          this.source = event.target.files[0];
          this.preview = URL.createObjectURL(this.photo);
          this.v = true;
        } else if (
          uploadedTarget.includes(".mp4") ||
          uploadedTarget.includes(".avi") ||
          uploadedTarget.includes(".mov") ||
          uploadedTarget.includes(".wmv") ||
          uploadedTarget.includes(".flv") ||
          uploadedTarget.includes(".mkv") ||
          uploadedTarget.includes(".webm")
        ) {
          this.preview = null;
          this.source = event.target.files[0];
          this.v = true;

          console.log("VIDEO");
        } else {
          this.source = null;
        }
      }
    },
    reset() {
      console.log("reset");
      this.photo = null;
      this.preview = "";
      this.filePreview = "";
      this.capture = "";
    },
  },
  computed: {
    type() {
      if (this.photo) {
        return "photo";
      } else if (this.video) {
        return "video";
      }
    },
  },
  data() {
    return {
      capture: "",
      v: false,
      filePreview: null,
      photo: null,
      video: null,
    };
  },
  setup(props) {
    const storage = getStorage();

    const auth = getAuth();

    async function postMessage(source, capture, emit, resetData, type) {
      const fileType = source.type.split("/")[0];

      if (fileType === "video") {
        console.log(source, "VID");

        // const storageRef = ref(storage, `videos/${source.name + uuidv4()}`);

        const storageRef = ref(storage, `videos/${source.name + uuidv4()}`);

        const uploadTask = uploadBytesResumable(storageRef, source);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Handle upload progress
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload progress:", progress);
          },
          (error) => {
            console.error("Error uploading video:", error);
          },
          () => {
            // Handle successful upload
            console.log("Video uploaded successfully");
            // Get the download URL of the uploaded video file
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                console.log("Download URL:", downloadURL);
                // Use the download URL to display or share the video with others
              })
              .catch((error) => {
                console.error("Error getting download URL:", error);
              });
          }
        );
      } else if (fileType === "image") {
        emit("notready", true);
        const storageRef = ref(storage, `images/${source.name + uuidv4()}`);
        uploadBytes(storageRef, source)
          .then((snapshot) => {
            getDownloadURL(storageRef).then((url) => {
              emit("sendmesimg", capture, url);
              resetData();
            });
          })
          .catch((er) => console.log(er, "post er"));

        console.log("PHT");
      } else {
        // Code to handle other file types
      }
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
  z-index: 120;
  height: 100%;

  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 121;
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
