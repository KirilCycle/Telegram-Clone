<template>
  <div class="file-upl-content">
    <span class="material-symbols-outlined"> attach_file </span>
    <input
      ref="fileInput"
      accept="image/gif, image/jpeg, image/png, video/mp4, video/avi, video/mov, video/wmv, video/flv, video/mkv, video/webm, .xls,.xlsx,.xlsb,.txt,.csv,.tsv"
      @change="uploadImage"
      class="file-input"
      type="file"
    />
  </div>

  <Teleport to="body">
    <transition name="fade">
      <div v-if="v" class="bloor">
        <div class="modal">
          <h3 class="action-header">{{ actionName }}</h3>

          <button @click="reset" class="close-btn">
            <span class="material-symbols-outlined"> close </span>
          </button>

          <div class="preview-container">
            <img class="content" v-if="localType" :src="preview" />
            <video content="content" v-else :src="preview" controls></video>
          </div>

          <div class="caption-container">
            <input
              class="caption"
              v-model="caption"
              type="text"
              placeholder="Caption"
            />
            <button
              class="send-btn"
              :class="{ 'btn-disabled': notready }"
              :disabled="notready"
              @click="
                () => {
                  postMessage(source, caption, reset, preview);
                }
              "
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "@firebase/auth";
import { uuidv4 } from "@firebase/util";
import store from "@/store/store";
import { uploadBytesResumable } from "firebase/storage";
import { sendMsg } from "@/features/sendChatMessage";
import { sendMessageToFoundedChat } from "@/features/sendMsgToFoundedChat";

export default {
  props: {
    isFounded: Boolean,
    requiered: true,
  },
  data() {
    return {
      caption: "",
      v: false,
      localType: null,
      filePreview: null,
      photo: null,
      notready: false,
      video: null,
    };
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
          this.preview = URL.createObjectURL(this.source);
          this.localType = true;
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
          this.source = event.target.files[0];
          this.preview = URL.createObjectURL(this.source);
          this.localType = false;
          this.v = true;

          console.log("VIDEO", this.preview);
        } else {
          this.source = null;
        }
      }
    },
    reset() {
      this.photo = null;
      this.preview = "";
      this.filePreview = "";
      this.capture = "";
      this.v = false;
      this.$refs.fileInput.value = null;
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

    actionName() {
      if (this.localType) {
        return `Send Photo`;
      }
      return `Send Video`;
    },
  },
  setup(props) {
    const storage = getStorage();

    async function postMessage(source, caption, resetAndClose, preview) {
      const fileType = source.type.split("/")[0];

      resetAndClose();

      const chatId = store.state.chat.chatId;

      const previewMsgId = uuidv4();
      if (fileType === "video") {

        const storageRef = ref(storage, `videos/${source.name + uuidv4()}`);

        const uploadTask = uploadBytesResumable(storageRef, source);

        store.commit("previewChat/setNextLoadingMsg", {
          id: previewMsgId,
          cancel: () => uploadTask.cancel(),
          source: { type: "video", src: preview },
          chatId,
        });

        setTimeout(() => {
          store.state.chatAdditionalDataManage.chatContainerRef.scrollTo({
            top: 10000,
          });
        });

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Handle upload progress

            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
           
          },
          (error) => {
            store.commit("previewChat/removeLoadingMsg", previewMsgId);
          
          },
          () => {
            // Handle successful upload
            // Get the download URL of the uploaded video file
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
              

                const resData = {
                  type: "video",
                  src: downloadURL,
                };

                props.isFounded
                  ? sendMessageToFoundedChat(caption,  store.state.chat.selectedUser.uid, resData).finally(
                      store.commit("previewChat/removeLoadingMsg", previewMsgId)
                    )
                  : sendMsg(
                      caption,
                      resData,
                      store.state.message.replyTarget,
                      chatId
                    ).finally(
                      store.commit("previewChat/removeLoadingMsg", previewMsgId)
                    );
              })
              .catch((error) => {
                store.commit("previewChat/removeLoadingMsg", previewMsgId);
                console.error("Error getting download URL:", error);
              });
          }
        );
      } else if (fileType === "image") {
        const storageRef = ref(storage, `images/${source.name + uuidv4()}`);

        const uploadTask = uploadBytesResumable(storageRef, source);

        store.commit("previewChat/setNextLoadingMsg", {
          id: previewMsgId,
          cancel: () => uploadTask.cancel(),
          source: { type: "img", src: preview },
          chatId,
        });

        setTimeout(() => {
          store.state.chatAdditionalDataManage.chatContainerRef.scrollTo({
            top: 10000,
          });
        });

        uploadTask
          .then((snapshot) => {
            getDownloadURL(storageRef).then((url) => {
              const resData = {
                type: "img",
                src: url,
              };

              if (props.isFounded) {
                sendMessageToFoundedChat(caption, store.state.chat.selectedUser.uid, resData)
                  .finally(
                    store.commit("previewChat/removeLoadingMsg", previewMsgId)
                  )
                  .catch((e) => console.log(e));
              } else {
                sendMsg(
                  caption,
                  resData,
                  store.state.message.replyTarget,
                  chatId
                ).finally(
                  store.commit("previewChat/removeLoadingMsg", previewMsgId)
                );
              }
            });
          })
          .catch((er) => {
            store.commit("previewChat/removeLoadingMsg", previewMsgId);
            console.log(er, "post er");
          });
            

      }
    }

    return {
      postMessage,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

$padhor: 10px;
$padver: 16px;

%paddings-setup {
  padding-top: $padver;
  padding-bottom: $padver;
  padding-right: $padhor;
  padding-left: $padhor;
  box-sizing: border-box;
}

.close-btn {
  width: 37px;
  height: 37px;
  border-radius: 19.5px;
  position: absolute;
  right: 3px;
  top: 3px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: $second-content;
  &:hover {
    background-color: $hover;
  }
}

.action-header {
  position: absolute;
  left: 20px;
  top: 10px;
  color: $text-main;
}

.dark .action-header {
  color: $text-main-l;
}

.file-upl-content {
  &:hover {
    span {
      color: rgb(187, 187, 187);
    }
  }
  width: 20px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-right: 5px;

  span {
    cursor: pointer;
    display: block;
    position: relative;
    right: 8px;
    height: 30px;
    width: 15px;
    color: gray;
    top: 0%;
    margin: 0% auto;
    font-size: 2rem;
    &:hover {
      color: #767676;
    }
  }

  .file-input {
    cursor: pointer;
    width: 13px;
    position: absolute;
    border-radius: 0px;
    height: 100%;
    opacity: 0;
  }
}

.caption {
  width: 100%;
  border-radius: 0px;
  box-sizing: border-box;
  height: 40px;
  font: 1rem sans-serif;
  color: $text-main;
  transition: border-bottom ease-in 0.2s;
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
    background-color: $content-main-dark;
    width: 310px;
    height: 410px;
    border-radius: 15px;

    .preview-container {
      width: 100%;
      margin-top: 25px;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        object-fit: scale-down;
        height: 300px;
        max-width: 100%;
      }
      video {
        object-fit: scale-down;
        height: 300px;
        width: auto;
      }
    }

    .caption-container {
      display: flex;
      flex-direction: row;
      margin-top: 5px;
    }

    .send-btn {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      cursor: pointer;
      font-weight: 550;
      height: 40px;
      color: white;
      border-radius: 5px;
      background-color: $second;
      display: flex;
      align-items: center;
      @extend %paddings-setup;

      &:hover {
        background-color: $main;
        @extend %paddings-setup;
      }
    }

    @extend %paddings-setup;
  }
}
.dark .bloor .modal {
  .send-btn {
    background-color: $main-l;
  }

  background-color: $content-main-dark-l;
}

.dark .caption {
  color: $text-main-l;
}
</style>
