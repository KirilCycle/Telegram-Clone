<template>
  <div @click="moreContentV = false" class="wrap">
    <!-- <h1 @click="logout">LOOOOOOOOOOOOOOOGGGGGGGG</h1> -->

    <nav class="settings-nav">
      <button @click="$emit('close')" class="settings-btn">
        <span class="material-symbols-outlined"> arrow_back </span>
      </button>
      <h1 class="settings">Settings</h1>

      <div class="settings_nav_right_side">
        <button
          @click="() => handleEditComponent(-310, true)"
          class="settings-btn"
        >
          <span class="material-symbols-outlined"> edit </span>
        </button>

        <button @click.stop="moreContentV = true" class="settings-btn">
          <span class="material-symbols-outlined"> more_vert </span>

          <div v-if="moreContentV" class="more-content">
            <ul class="more_list">
              <li @click="logoutV = true">
                <span class="material-symbols-outlined"> logout </span>
                <p>Logout</p>
              </li>
            </ul>
          </div>
        </button>

        <teleport to="body">
          <div
            v-if="logoutV"
            @click="
              () => {
                moreContentV = false;
                logoutV = false;
              }
            "
            class="logout-alert"
          >
            <div class="logout-modal">
              <h2>Messanger Name</h2>
              <p>Are you sure you want to log out?</p>

              <div class="logoout_modal_btns_wrp">
                <button @click="logout">LOG OUT</button>
                <button @click="handleCancel">CANCEL</button>
              </div>
            </div>
          </div>
        </teleport>
      </div>
    </nav>

    <div class="user-image-wrp">
      <user-image>
        <div class="profile-img-wrap">
          <img class="profile-img" :src="$store.state.user.user?.photoURL" />
        </div>
        <div class="profile_img_wrap_text_wrp">
          <h2 class="fisrt-name">{{ $store.state.user.user.displayName }}</h2>
          <h3 class="email">{{ $store.state.user.user.email }}</h3>
        </div>
      </user-image>
    </div>

    <div class="profile-user-info-wrp">
      <profile-user-info
        :bio="$store.state.user.user.bio"
        :username="$store.state.user.user.username"
      ></profile-user-info>
    </div>
    <div ref="edit" class="edit-panel">
      <edit-settings
        @close="() => handleEditComponent(0, false)"
      ></edit-settings>
    </div>

    <div class="profile-user-info-wrp">
      <radio-select
        :header="'Theme'"
        :selected="prevTheme"
        :btnsRadioList="themeVariations"
      ></radio-select>
    </div>

    <div class="profile-user-info-wrp">
      <radio-select
        :header="'I have cool reuseful'"
        :selected="prevTheme"
        :btnsRadioList="options"
      ></radio-select>
    </div>

    <div class="profile-user-info-wrp">
      <radio-select
        :header="'radio btns list'"
        :selected="prevTheme"
        :btnsRadioList="options2"
      ></radio-select>
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
import RadioSelect from "@/components/RadioSelect.vue";
import { useDark } from "@vueuse/core";

export default {
  components: {
    UserImage,
    EditSettings,
    ProfileUserInfo,
    RadioSelect,
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
      newFile: null,
      isLoading: false,
      logoutV: false,
      moreContentV: false,
      
    };
  },
  computed: {
    prevTheme() {
     if (localStorage.getItem('vueuse-color-scheme') !== 'auto' ? 'dark'  :  'light') {
       return localStorage.getItem('vueuse-color-scheme') !== 'auto' ? 'dark'  :  'light'
     } return 'dark'
    }
  },
  created() {},
  methods: {
    async handleEditComponent(pos, state) {
      this.inEdit = state;
      this.$refs.edit.style.transform = `translateX(${pos}px)`;
    },

    logout() {
      const auth = getAuth();
      signOut(auth);
      location.reload();
    },

    handleCancel() {
      this.logoutV = false;
      this.moreContentV = false;
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

    const isDark = useDark();

    function setLightTheme() {
      isDark.value = false;
      const root = document.querySelector("#app");
      root.classList.remove("dark-theme");
    }

    function setDarkTheme() {
      isDark.value = true;
      const root = document.querySelector("#app");
      root.classList.add("dark-theme");
    }

    const themeVariations = ref([
      {name:'light', value:'light', execute: setDarkTheme, title:'Light' },
      {name:'dark', value:'dark', execute: setLightTheme, title:'Dark' }

    ]);

    const options = ref([  
      {name:'option', value:'option', execute: () => {}, title:'option' },
      {name:'option2', value:'option2', execute: () => {}, title:'option2' }])

      const options2 = ref([  
      {name:'option3', value:'option3', execute: () => {}, title:'option3' },
      {name:'option4', value:'option4', execute: () => {}, title:'option4' },
      {name:'option5', value:'option5', execute: () => {}, title:'option5' },
      {name:'option6', value:'option6', execute: () => {}, title:'option6' }    
    ])

    return {
      logout,
      themeVariations,
      uploadPhoto,
      options,
      options2
    };
  },
};
</script>

<style lang="scss" scoped>
$custom-c4: rgb(31, 31, 31);
$def-gray: #b2b2b2;
@import "@/styles/colors";

.edit-panel {
  width: 310px;
  position: absolute;
  left: 310px;
  height: 100%;
  z-index: 21;
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
    z-index: 20;
    font-size: 1.2rem;
    font-weight: 700;
    color: #ffffff;
    position: absolute;
    bottom: 23px;
    left: 20px;
  }
  .email {
    color: #c8c8c8;
    position: absolute;
    bottom: 3px;
    left: 20px;
    font-size: 1rem;
    z-index: 10;
  }
}

.settings {
  color: $text-main;
  font-size: 1.4rem;
  font-weight: 550;
  margin: 0% auto;
}

.dark .settings {
  color: $text-main-l;
}

img {
  background: #46464600;
  min-width: 100%;
  height: auto;
}

.profile-user-info-wrp {
  position: relative;
  top: 8%;
  width: 100%;
}

.settings-nav {
  width: 100%;
  background-color: $content-main;
  height: 8%;
  position: fixed;
  top: 0px;
  z-index: 20;
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
    cursor: pointer;
  }
}

.dark .settings-nav {
  background-color: $content-main-l;
}

.user-image-wrp {
  position: relative;
  top: 8%;
}

.more-content {
  width: 180px;
  height: max-content;
  position: absolute;
  z-index: 55;
  right: 15px;
  background-color: $transition-colors;
  top: 45px;
  backdrop-filter: blur(3px);
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  padding: 7px 2px 7px 2px;
  li {
    list-style: none;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 5px;
    justify-content: space-around;
    font-size: 1rem;
    height: 30px;

    &:hover {
      background-color: $hover;
      color: $text-main;
    }
  }
}

.wrap {
  background-color: $content-main-dark;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  height: 100%;
  border-right: 1px solid rgba(128, 128, 128, 0.237);
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    display: none;
  }

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
}

.dark .wrap {
  background-color: $content-main-l;
}

.logout-alert {
  width: 100%;
  height: 100%;
  background-color: #00000089;
  position: absolute;
  z-index: 300;
  display: flex;
  justify-content: center;
  align-items: center;

  .logout-modal {
    width: 315px;
    height: 150px;
    background: #1f1f1f;
    border-radius: 10px;
    padding: 15px;
    position: relative;
    box-sizing: border-box;

    h2 {
      font-size: 1.3rem;
      color: white;
      position: static;
    }

    p {
      font-size: 1rem;
      color: white;
      margin-top: 20px;
      margin-bottom: 20px;
    }

    .logoout_modal_btns_wrp {
      width: 100%;
      height: max-content;
      display: flex;
      flex-direction: row-reverse;

      button {
        width: 32%;
        height: 35px;
        font-weight: 550;
        color: rgb(45, 108, 255);
        font-size: 1rem;
        margin-right: 10px;
        border-radius: 5px;
        cursor: pointer;

        &:hover {
          transition: 0.3s ease-in-out;
          background-color: rgba(45, 108, 255, 0.055);
        }
      }
    }
    .logoout_modal_btns_wrp :last-child {
      &:hover {
        background-color: rgba(255, 0, 0, 0.056);
      }
      color: red;
    }
  }
}
</style>
