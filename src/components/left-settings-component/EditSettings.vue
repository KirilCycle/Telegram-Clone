<template>
  <div v-if="$store.state.user.user" class="edit-wrap">
    <top-settings-navbar-vue :title="'Edit Profile'">
      <template v-slot:close-btn>
        <control-button @click="() => $emit('close')">
          <span class="material-symbols-outlined"> arrow_back </span>
        </control-button>
      </template>
    </top-settings-navbar-vue>

    <div class="edit-content">
      <div class="image-container">
        <img :src="profilePhoto" />

        <div class="img-bloor">
          <input
            class="file-input"
            type="file"
            v-on:change="(e) => showPrewiePhoto(e)"
          />
          <span class="material-symbols-outlined"> add_a_photo </span>
        </div>
      </div>

      <div class="inputs_wrp">
        <div class="inpt-container">
          <p>First Name</p>
          <main-input v-model="firtsName" />
        </div>

        <div class="inpt-container">
          <p>{{ usernameState }}</p>
          <main-input
            :class="{
              'input-username-wrong':
                usernameWrongData || usernameExist || shortLength,
              'input-username-ok': usernameAvaible,
            }"
            v-on:input="handleUsername"
            v-model="username"
          />
        </div>
        <div class="inpt-container bio">
          <p>Bio</p>
          <textarea
            ref="textarea"
            :value="bio"
            v-on:input="(e) => handleTextArea(e.target.value, this)"
          />
        </div>

        <div class="info-about-bio-wrap">
          <p>
            Any details such as age, occupation or city. Example: 23 y.o.
            designer from San Francisco
          </p>
        </div>
      </div>
    </div>

    <transition name="bounce">
      <main-button
        v-show="somethingChanged"
        ref="commit"
        @click="commitProfileChanges"
        class="save-changes-btn"
      >
        <span v-show="!changesLoading" class="material-symbols-outlined">
          done
        </span>
        <div v-show="changesLoading" class="spinner">
          <div class="spinner-inner"></div>
        </div>
      </main-button>
    </transition>
  </div>
</template>

<script>
import {
  collection,
  query,
  where,
  getDoc,
  doc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import firebase from "firebase/compat/app";
import { setDoc, updateDoc } from "firebase/firestore";
import store from "@/store/store";

import { updateStoreUser } from "@/features/updateStoreUser";
import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { uuidv4 } from "@firebase/util";
import TopSettingsNavbarVue from "../UI/navbars/TopSettingsNavbar.vue";
import MainButton from "../UI/buttons/MainButton.vue";

export default {
  components: {
    TopSettingsNavbarVue,
    MainButton,
  },
  props: {
    v: Boolean,
  },
  data() {
    return {
      profilePhoto: this.$store.state.user.user.photoURL,
      uploadedPhoto: null,

      firtsName: this.$store.state.user.user.displayName,
      username: this.$store.state.user.user.username,
      bio: this.$store.state.user.user.bio,

      firtsNameTmp: this.$store.state.user.user.displayName,
      usernameTmp: this.$store.state.user.user.username,
      bioTmp: this.$store.state.user.user.bio,

      checkUsername: false,
      usernameWrongData: false,
      usernameExist: false,
      usernameAvaible: false,
      shortLength: false,
      changesLoading: false,
    };
  },
  computed: {
    usernameState() {
      if (this.usernameExist) {
        return "Usernam exist";
      } else if (this.usernameWrongData) {
        return "Invalid data (idi gulay)";
      } else if (this.usernameAvaible) {
        return "Avaible";
      } else if (this.shortLength) {
        return "we require more than 3 symphol and less than 27";
      } else if (this.checkUsername) {
        return "Checking";
      } else {
        return "Username";
      }
    },

    somethingChanged() {
      let somethingChanged =
        this.uploadedPhoto ||
        this.firtsName?.trim() !== this.firtsNameTmp ||
        this.username?.trim() !== this.usernameTmp ||
        this.bio?.trim() !== this.bioTmp

      if (somethingChanged && !this.usernameWrongData) {
        return true;
      } else {
        return false;
      }
    },
  },

  methods: {
    async handleUsername() {
      this.checkUsername = false;
      this.usernameExist = false;
      if (this.username.length > 3 && this.username.length < 27) {
        this.shortLength = false;
       

        let data = this;

        const wrongSymphols = [
          "@",
          "#",
          "$",
          "!",
          " ",
          ".",
          "`",
          "~",
          "}",
          "{",
          "+",
          "|",
          "=",
          ";",
          "/",
          ">",
          "<",
          "*",
          "&",
          "%",
          "?",
        ];

        let ready = true;

      
        for (let i = 0; i < this.username.length; i++) {
          for (let j = 0; j < wrongSymphols.length; j++) {
            if (this.username[i].includes(wrongSymphols[j])) {
                  this.usernameWrongData = true;
              ready = false;
              break;
            }
          }
        }

        if (ready) {
          this.usernameWrongData = false;
         

          const username = this.username;

          async function findUser() {
            data.checkUsername = true;
            const db = firebase.firestore();

            const q = query(
              collection(db, "usersPrew"),
              where("username", "==", username)
            );

            const querySnapshot = await getDocs(q);

            let res = await querySnapshot.docs[0]?.data();

            if (res) {
              if (res.username === data.$store.state.user.user.username) {
                data.usernameAvaible = false;
                data.checkUsername = false;
              } else {
                data.usernameExist = true;
                data.checkUsername = false;
                data.usernameAvaible = false;
              }
            } else {
              //everything okey
              data.checkUsername = false;
              data.usernameAvaible = true;
            }
          }

          findUser();
        } else {
        
          this.usernameWrongData = true;
          this.usernameAvaible = false;

        
        }
      } else {
        this.usernameAvaible = false;
        this.shortLength = true;
      }
    },

    updateLocalData() {
      (this.uploadedPhoto = null),
        (this.profilePhoto = this.$store.state.user.user.photoURL),
        (this.firtsNameTmp = this.$store.state.user.user.displayName),
        (this.usernameTmp = this.$store.state.user.user.username),
        (this.bioTmp = this.$store.state.user.user.bio),
        (this.changesLoading = false);
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

          this.uploadedPhoto = uploadedTarget;

          // selectedPhoto.value = e.target.files[0]
        } else {
          alert("wrog format");
        }
      }
    },

    handleTextArea(v) {
     

      let el = this.$refs.textarea;

      this.bio = v;

      el.style.height = "45px";
      el.style.height = el.scrollHeight + "px";

   
    },
    async commitProfileChanges() {
      this.usernameAvaible = false;
      let somethingChanged =
        this.uploadedPhoto ||
        this.firtsName !== this.firtsNameTmp ||
        this.username !== this.usernameTmp ||
        this.bio !== this.bioTmp;

      if (somethingChanged && !this.usernameWrongData && !this.shortLength) {
        const db = firebase.firestore();
        const userDoc = doc(db, "usersPrew", this.$store.state.user.user.uid);

        const q = query(
          collection(db, "usersPrew"),
          where("username", "==", this.username)
        );

        const querySnapshot = await getDocs(q);

        let res = querySnapshot.docs[0]?.data();

        let newData = {};

        if (this.uploadedPhoto) {
          this.changesLoading = true;
          const storage = getStorage();

          const storageRef = ref(
            storage,
            `images/${this.uploadedPhoto.name + uuidv4()}`
          );

          uploadBytes(storageRef, this.uploadedPhoto).then((snapshot) => {
           

            getDownloadURL(storageRef).then((url) => {
              newData = {
                ...(this.firtsName !== this.firtsNameTmp && {
                  displayName: this.firtsName.trim() ,
                }),
                ...(this.username !== this.usernameTmp && {
                  username: this.username.trim() ,
                }),
                ...(this.bio !== this.bioTmp && { bio: this.bio.trim() }),
                photoURL: url,
              };

              updateDoc(userDoc, newData).then((res) => {
                this.$emit("close");
                updateStoreUser().then((res) => {
                  this.updateLocalData();
                });
              });
            });
          });
        } else {
          newData = {
            ...(this.firtsName !== this.firtsNameTmp && {
              displayName: this.firtsName,
            }),
            ...(this.username !== this.usernameTmp && {
              username: this.username,
            }),
            ...(this.bio !== this.bioTmp && { bio: this.bio }),
          };

          if (res) {
            this.changesLoading = true;
            if (res.username === this.$store.state.user.user.username) {
              await updateDoc(userDoc, newData).then((res) => {
              

                this.$emit("close");
                updateStoreUser().then((res) => this.updateLocalData());
              });

           
            } else {
              alert("wrong data");
            }
          } else {
            this.changesLoading = true;
            await updateDoc(userDoc, newData)
              .then((res) => {
                this.$emit("close");
                updateStoreUser().then((res) => this.updateLocalData());
              })

          }
        }
        // To update age and favorite color:
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$custom-c4: rgb(31, 31, 31);
$def-gray: #828282;

@import "@/styles/colors";

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 30px;
  height: 30px;
}

.spinner-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid #ccc;
  border-top-color: #888;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
.edit-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1225;
  background-color: $content-main;
  box-sizing: border-box;
}

.dark .edit-wrap {
  background-color: $content-main-l;
}

.inpt-container {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  p {
    position: absolute;
    top: 5px;
    z-index: 22;
    left: 10px;
    font-size: 0.7rem;
    background-color: $content-main;
    color: gray;
    max-height: 0.8rem;
  }
}

.dark .inpt-container {
  p {
    background-color: $content-main-l;
  }
}

.inputs_wrp {
  width: 100%;
  padding: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
  padding: 15px;

  input {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .input-username-wrong {
    border: 1px solid red;
    &:focus {
      border: 1px solid red;
      box-shadow: rgb(255, 0, 0) 0px 0px 0px 1px;
    }
    &:hover {
      border: 1px solid red;
    }
  }

  .input-username-ok {
    border: 1px solid rgb(0, 255, 47);

    &:focus {
      border: 1px solid rgb(0, 255, 47);
      box-shadow: rgb(0, 255, 47) 0px 0px 0px 1px;
    }

    &:hover {
      border: 1px solid 0, 255, 47;
    }
  }

  textarea {
    padding: 3px 0px 3px 5px;
    box-sizing: border-box;
    resize: none;
    overflow: hidden;
    margin-top: 15px;
    margin-bottom: 15px;
    color: $text-main;
    width: 100%;
    height: 50px;
    border-radius: 15px;
    border: 1px solid gray;
    background: none;
    font-size: 1rem;
    line-height: 1.3125rem;

    &:focus {
      border: 1px solid $main;
      box-shadow: rgba(34, 137, 255, 0.916) 0px 0px 0px 1px;
    }
    &:hover {
      border: 1px solid $input-main-color;
    }
  }
}

.dark .inputs_wrp {
  input {
    color: $text-main-l;
  }
  textarea {
    color: $text-main-l;
  }
}

.info-about-bio-wrap {
  max-width: 100%;
  padding: 5px;
  color: gray;
  text-align: left;
}
.edit-content {
  width: 100%;
  position: relative;
  top: 9%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;

  .image-container {
    width: 120px;
    position: relative;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;

    &:hover {
    }

    .img-bloor {
      position: absolute;
      background-color: #0000005b;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        color: #ffffff;
        font-size: 2.5rem;
        cursor: pointer;
        transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
        &:hover {
          transform: scale(1.3, 1.3);
        }
      }

      .file-input {
        position: absolute;
        width: 100px;
        height: 100px;
        opacity: 0;

        &:hover ~ .img-bloor {
          background-color: red;
        }
      }
    }

    img {
      width: 100%;
      min-height: 100%;
      object-fit: cover;
    }
  }
}

.save-changes-btn {
  border-radius: 30px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 55px;
  height: 55px;
}
</style>
