<template>
  <div class="wrap">
    <!-- <h1 @click="logout">LOOOOOOOOOOOOOOOGGGGGGGG</h1> -->

    <nav class="settings-nav">
      <button @click="$emit('close')" class="settings-btn">
        <span class="material-symbols-outlined"> arrow_back </span>
      </button>
      <h1 class="settings">Settings</h1>

      <div class="settings_nav_right_side">
        <button @click="() => handleEditComponent(-310, true)" class="settings-btn">
          <span class="material-symbols-outlined"> edit </span>
        </button>
        <button  class="settings-btn">
          <span class="material-symbols-outlined">
            more_vert
            </span>
        </button>
      </div>
    </nav>

    <user-image>
      <div class="profile-img-wrap">
        <img class="profile-img" :src="$store.state.user.user?.photoURL" />
      </div>
      <div class="profile_img_wrap_text_wrp">
        <h2 class="fisrt-name">{{ $store.state.user.user.displayName }}</h2>
        <h3 class="email">{{ $store.state.user.user.email }}</h3>
      </div>
    </user-image>

    <profile-user-info></profile-user-info>

    <div ref="edit" class="edit-panel">
      <edit-settings
        @close="() => handleEditComponent(0, false)"
      ></edit-settings>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import { updateProfile, signOut } from "firebase/auth";
import { nextTick, watch } from "vue";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getAuth } from "firebase/auth";
import { collection } from "firebase/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import MessageItem from "../components/MessageItem.vue";
import { uuidv4 } from "@firebase/util";
import SelectedFileModal from "@/components/SelectedFileModal.vue";
import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";
import UserImage from "@/components/UserImage.vue";
import EditSettings from "@/components/EditSettings.vue";
import ProfileUserInfo from "@/components/ProfileUserInfo.vue";

export default {
  components: {
    UserImage,
    EditSettings,
    ProfileUserInfo,
  },
  data() {
    return {
      user: store.state.user.user,
      profilePhoto: store.state.user.user.photoURL,
      value: store.state.user.user.displayName
        ? store.state.user.user.displayName
        : store.state.user.user.email,
      wrongVal: false,
      changedName: false,
      inEdit: false,
      newFile: null,
      isLoading: false,
    };
  },
  created() {},
  methods: {
    async handleEditComponent(pos, state) {
      this.inEdit = state;
      this.$refs.edit.style.transform = `translateX(${pos}px)`;
    },

    async handleChanging() {
      this.isLoading = true;
      if (this.value.length > 4 && this.newFile) {
        const symphols = ["@", "#", "$", "!", "+", "|", "/"];

        for (let i = 0; i < this.value.length; i++) {
          for (let j = 0; j < symphols.length; j++) {
            if (this.value[i].includes(symphols[j])) {
              return;
            }
          }
        }

        const storage = getStorage();
        const auth = getAuth();

        const storageRef = ref(
          storage,
          `images/${this.newFile.name + uuidv4()}`
        );

        uploadBytes(storageRef, this.newFile)
          .then((snapshot) => {
            storageRef._location.path_, "Uploaded a blob or file!";

            getDownloadURL(storageRef)
              .then((url) => {
                updateProfile(auth.currentUser, {
                  photoURL: url,
                  displayName: this.value,
                })
                  .then(() => {
                    async function chnagePrewUser(userId, changes) {
                      const db = firebase.firestore();

                      const frankDocRef = doc(db, "usersPrew", userId);

                      await updateDoc(frankDocRef, changes);
                    }

                    chnagePrewUser(auth.currentUser.uid, {
                      photoURL: url,
                      displayName: this.value,
                    })
                      .then(() => {
                        console.log("good", url);
                        this.isLoading = false;
                        this.inEdit = false;
                      })
                      .catch((er) => console.log(er, "huynya peredelivay"));
                  })
                  .catch((error) => {
                    this.inEdit = false;
                    this.isLoading = false;
                    console.log("huynya", error);
                  });
              })
              .catch((er) => {
                this.inEdit = false;
                this.isLoading = false;
              });
          })

          .catch((er) => {
            this.inEdit = false;
            this.isLoading = false;
          });
      } else {
        console.log("gimno peredelivay");
      }

      //photo handle
    },

    changeDisplayName() {
      const symphols = ["@", "#", "$", "!", "+", "|", "/"];

      let ready = true;

      for (let i = 0; i < this.value.length; i++) {
        for (let j = 0; j < symphols.length; j++) {
          if (this.value[i].includes(symphols[j])) {
            ready = false;
            this.wrongVal = true;
            return;
          }
        }
      }

      if (ready) {
        updateProfile(this.user, {
          displayName: this.value,
        })
          .then(() => {
            this.changedName = this.value.trim();
            this.preparedToChangeName = false;
          })
          .catch((error) => {});
      }
    },

    showPrewiePhoto(e) {
      if (e.target.files[0]) {
        const uploadedTarget = e.target.files[0];

        if (
          uploadedTarget.name.includes(".png") ||
          uploadedTarget.name.includes(".jpg") ||
          uploadedTarget.name.includes(".jpeg") ||
          uploadedTarget.name.includes(".svg")
        ) {
          this.profilePhoto = URL.createObjectURL(uploadedTarget);

          this.newFile = uploadedTarget;

          console.log(this.newFile);
          // selectedPhoto.value = e.target.files[0]
        } else {
          console.log("no");
        }
      }
    },

    cancelChangings() {
      this.inEdit = false;
      this.profilePhoto = this.user.photoURL;
    },
  },
  setup(props) {
    console.log(store.state.user);

    function logout() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          // Sign-out successful.
        })
        .catch((error) => {
          // An error happened.
        });
    }

    function uploadPhoto(e) {
      if (e.target.files[0]) {
        const uploadedTarget = e.target.files[0];

        if (
          uploadedTarget.name.includes(".png") ||
          uploadedTarget.name.includes(".jpg") ||
          uploadedTarget.name.includes(".jpeg") ||
          uploadedTarget.name.includes(".svg")
        ) {
          const storage = getStorage();
          const auth = getAuth();

          const storageRef = ref(
            storage,
            `images/${uploadedTarget.name + uuidv4()}`
          );

          uploadBytes(storageRef, uploadedTarget)
            .then((snapshot) => {
              console.log(
                storageRef._location.path_,
                "Uploaded a blob or file!"
              );

              getDownloadURL(storageRef)
                .then((url) => {
                  updateProfile(auth.currentUser, {
                    photoURL: url,
                  })
                    .then(() => {
                      console.log("good", url);
                    })
                    .catch((error) => {
                      console.log("huynya", error);
                    });
                })
                .catch((er) => console.log("er", er));
            })
            .catch((er) => console.log(er, "post er"));

          console.log(e.target.files[0]);
        } else {
          console.log("no");
        }
      }
    }

    return {
      logout,
      uploadPhoto,
    };
  },
};
</script>

<style lang="scss" scoped>
$crazy_color: #00ff44;
$custom-c4: rgb(31, 31, 31);
$def-gray: #b2b2b2;

.edit-panel {
  width: 310px;
  position: absolute;
  left: 310px;
  height: 100%;
  z-index: 60;
  transform: translateX(0);
  transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
}

.profile-img-wrap {
  width: 100%;
  height: 100%;
  position: relative;
}
.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile_img_wrap_text_wrp {
  .fisrt-name {
    color: #ffffff;
    position: absolute;
    z-index: 50;
  }
  .email {
    color: #909090;
    position: absolute;
    z-index: 50;
  }
}

.settings {
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 550;
  margin: 0% auto;
}

img {
  background: #46464600;
  min-width: 100%;
  height: auto;
}
h3 {
  color: #c8c8c8;
  position: absolute;
  bottom: 3px;
  left: 20px;
  font-size: 1rem;
}
h2 {
  color: #ffffff;

  position: absolute;
  bottom: 23px;
  left: 20px;
  font-size: 1.5rem;
}

.settings-nav {
  width: 100%;
  background-color: $custom-c4;
  height: 8%;
  position: relative;
  top: 0px;
  display: flex;
  align-items: center;
  justify-content: center;

  .settings_nav_right_side {
    width: 80px;
    height: 100%;
    margin-right: 12px;
    display: flex;
    justify-content: space-between;
  }

  .settings-btn {
    color: $def-gray;
    margin: 12px;
  }

  .settings-btn {
    color: $def-gray;
    margin: 12px;
  }
}
.waiting-bloor {
  position: absolute;
  z-index: 200;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.792);
}
.wrap {
  background-color: rgb(22, 22, 22);
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  height: 100%;
  border-right: 0.1em solid rgb(63, 63, 63);

  .profile-txt-wrp {
    text-align: center;
    display: flex;
    flex-direction: column;

    h3 {
      color: #434343;
      font-size: 1rem;
      margin-top: 6px;
    }
  }

  .profile-edit-container {
    position: relative;
    display: flex;
    width: 100%;
    padding: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .pht-settings {
      color: $crazy_color;
      display: flex;
      h3 {
        font-size: 1rem;
      }

      .file-input {
        top: 0px;
        width: 130px;
        opacity: 0;
        color: #00ff44;
        position: absolute;
      }

      span {
        font-size: 1.3rem;
        margin-left: 5px;
      }
    }

    input {
      margin-top: 15px;
      width: 75%;
      height: 35px;
      background-color: #303030;
      border-radius: 5px;
      color: #ffffff;
      font-weight: 500;
      padding-left: 5px;
      font-size: 1.1rem;
    }
  }

  h1 {
    color: white;
  }

  display: flex;
  align-items: center;
  flex-direction: column;

  h2 {
    margin-top: 10px;
    color: rgb(255, 255, 255);
    font-size: 20px;
    font-weight: normal;
  }

  .value-alert {
    margin-top: 10px;
    color: rgb(61, 61, 61);
  }

  .input-container {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    p {
      margin-right: 7px;
      color: $crazy_color;
    }

    input {
      max-width: 60%;
      background-color: rgba(102, 51, 153, 0);
      color: rgb(153, 153, 153);
      border-bottom: 2px solid rgb(47, 47, 47);
      font-size: 20px;

      &:focus {
      }
    }
    span {
      color: $crazy_color;
    }
  }
}
</style>
