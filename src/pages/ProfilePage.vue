<template>
  <div class="wrap">
    <!-- <h1 @click="logout">LOOOOOOOOOOOOOOOGGGGGGGG</h1> -->


      <nav class="settings-nav">
        <button @click="$emit('close')" class="back">
          <span class="material-symbols-outlined"> arrow_back </span>
        </button>
        <h1 class="settings">Settings</h1>
        <button @click="() => handleEditComponent(-310, true)" class="edit">
          <span class="material-symbols-outlined"> edit </span>
        </button>
      </nav>
  
      <user-image>
        <img :src="$store.state.user.user?.photoURL" />
        <h2>Sexy pro</h2>
        <h3>{{ $store.state.user.user.email }}</h3>
      </user-image>
  
      <div class="user-info-container">
        <div class="username">
          <div class="ico">
            <p>@</p>
          </div>
  
          <div class="user_info_container_text_wrap">
            <p class="info-text">{{ $store.state.user.user.username }}</p>
            <p>Username</p>
          </div>
        </div>
  
        <div class="bio">
          <div class="ico">
            <p>i</p>
          </div>
  
          <div class="user_info_container_text_wrap">
            <p class="info-text">{{ $store.state.user.user.bio }}</p>
            <p>Bio</p>
          </div>
        </div>
      </div>
 
    <div  ref="edit" class="edit-panel">
      <edit-settings @close=" () => handleEditComponent(0, false)" ></edit-settings>
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
import EditSettings from '@/components/EditSettings.vue';

export default {
  components: {
    UserImage,
    EditSettings,
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

    async handleEditComponent (pos,state) {
      this.inEdit = state
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
$def-gray: #828282;


.edit-panel {
  width: 310px;
  position: absolute;
  left: 310px;
  height: 100%;
  transform: translateX(0);
  transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
}

.user-info-container {
  height: auto;
  padding: 15px 10px 15px 10px;
  background-color: #2b2b2b;
  width: 100%;
  box-sizing: border-box;

  %item-patt {
    width: 100%;
    height: 60px;
    border-radius: 5px;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
  }
  .ico {
    width: 50px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    font-weight: 600;
    color: #808080;
  }

  .user_info_container_text_wrap {
    width: 80%;
    height: 100%;
    margin-top: 10px;

    .info-text {
      color: #ffffff;
      font-size: 1.1rem;
    }

    p {
      color: #808080;
      font-size: 1rem;
    }
  }
  .username {
    @extend %item-patt;
  }
  .bio {
    @extend %item-patt;
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
}
.waiting-bloor {
  position: absolute;
  z-index: 200;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.792);
}
.wrap {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  height: 100%;
  border-right: 0.1em solid rgb(63, 63, 63);
  background-color: $custom-c4;
 

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

  .back {
    position: absolute;
    top: 10px;
    left: 10px;
    height: 10px;
    color: $def-gray;
  }

  .edit {
    position: absolute;
    top: 10px;
    right: 10px;
    height: 10px;
    color: $def-gray;
  }

 

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
