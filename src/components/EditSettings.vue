<template>
  <div v-if="$store.state.user.user" class="edit-wrap">
    <nav class="edti-nav">
      <button @click="() => $emit('close')">
        <span class="material-symbols-outlined"> arrow_back </span>
      </button>
      <h1>Edit Profile</h1>
    </nav>

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
          <input class="default-inpt" v-model="firtsName" />
        </div>

        <div class="inpt-container">
          <p>{{ usernameState }}</p>
          <input
            class="default-inpt"
            :class="{
              'input-username-wrong':
                usernameWrongData || usernameExist || shortLength,
              'input-username-ok': usernameAvaible,
            }"
            v-on:input="handleUsername"
            v-model="username"
          />
        </div>
        <div class="inpt-container">
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
    <button v-show="somethingChanged"  ref="commit"  @click="commitProfileChanges" class="save-changes-btn">
      <span class="material-symbols-outlined"> done </span>
    </button>
    </transition>

  </div>
</template>

<script>
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import firebase from "firebase/compat/app";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import store from "@/store/store";
import { reactive } from "vue";
import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { uuidv4 } from "@firebase/util";

export default {
  props: {
    v: Boolean,
  },
  data() {
    return {
      profilePhoto: this.$store.state.user.user.photoURL,
      uploadedPhoto: null,

      v: this.v,
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
        this.firtsName !== this.firtsNameTmp ||
        this.username !== this.usernameTmp ||
        this.bio !== this.bioTmp

        if (somethingChanged) {
          return true
        }  else {
          
          return false
        }
    }

  },
  watch: {

   

  },
  methods: {
    async handleUsername() {
      this.checkUsername = false;
      this.usernameExist = false;
      if (this.username.length > 3  && this.username.length < 27) {
        this.shortLength = false;
        console.log("username changes", this);

        let data = this;

        const wrongSymphols = [
          "@",
          "#",
          "$",
          "!",
          " ",
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

        console.log(this.username);
        for (let i = 0; i < this.username.length; i++) {
          for (let j = 0; j < wrongSymphols.length; j++) {
            if (this.username[i].includes(wrongSymphols[j])) {
              ready = false;
              break;
            }
          }
        }

        if (ready) {
          this.usernameWrongData = false;
          console.log("withou wrong data", this.username);

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
          console.log("Huynya predelivay");
          this.usernameWrongData = true;
          this.usernameAvaible = false

          console.log(this.usernameWrongData);
        }
      } else {
        this.usernameAvaible = false;
        this.shortLength = true;
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

          this.uploadedPhoto = uploadedTarget;

          
          // selectedPhoto.value = e.target.files[0]
        } else {
          alert("wrog format");
        }
      }
    },

    handleTextArea(v) {
      console.log("handleTextArea", v);

      let el = this.$refs.textarea;

      this.bio = v;

      el.style.height = "45px";
      el.style.height = el.scrollHeight + "px";

      console.log(this.bio);
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

        let res = await querySnapshot.docs[0]?.data();

        let newData = {};

       
        if (this.uploadedPhoto) {

          const storage = getStorage();

          const storageRef = ref(
            storage,
            `images/${this.uploadedPhoto.name + uuidv4()}`
          );

          uploadBytes(storageRef, this.uploadedPhoto).then((snapshot) => {
            console.log(storageRef._location.path_, "Uploaded a blob or file!");

            getDownloadURL(storageRef).then((url) => {
              newData = {
                ...(this.firtsName !== this.firtsNameTmp && {
                  displayName: this.firtsName,
                }),
                ...(this.username !== this.usernameTmp && {
                  username: this.username,
                }),
                ...(this.bio !== this.bioTmp && { bio: this.bio }),
                photoURL: url
              };

            updateDoc(userDoc, newData).then((res) =>
               console.log(res, "UPDATED p"))
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
            if (res.username === this.$store.state.user.user.username) {
              await updateDoc(userDoc, newData).then((res) =>
                console.log(res, "UPDATED SAME USERNAME")
              );

              console.log("ENOTHER DATA", newData);
            } else {
              alert("wrong data");
            }
          } else {
            await updateDoc(userDoc, newData).then((res) =>
              console.log(res, "UPDATED")
            ).catch((er) => console.log(er))

            console.log("ENOTHER DATA", newData);
          }
        }
        // To update age and favorite color:
      }
    },
  },

  setup() {
    const db = firebase.firestore();

    const data = reactive({});

    const unsub = onSnapshot(
      doc(db, "usersPrew", store.state.user.user.uid),
      (doc) => {
        store.commit("user/setUser", doc.data());
      }
    );
  },
};
</script>

<style lang="scss" scoped>
$custom-c4: rgb(31, 31, 31);
$def-gray: #828282;

@import '@/styles/colors';

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
.edit-wrap {
  width: 100%;
  height: 100%;
  background-color: $content-main;
  z-index: 25;
  box-sizing: border-box;
}

.inpt-container {
  position: relative;
  width: 100%;
  box-sizing: border-box;

  p {
    position: absolute;
    top: 5px;
    z-index: 900;
    left: 10px;

    font-size: 0.7rem;
    background-color: $content-main;
    color: gray;
    max-height: 0.8rem;
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
    padding: 0px 0px 0px 5px;
    width: 100%;
    height: 50px;
    border-radius: 15px;
    box-sizing: border-box;
    border: 1px solid gray;

    font-size: 1rem;
    color: $text-main;
    &:focus {
      border: 1px solid rgb(53, 107, 255);
    }
  }

  .input-username-wrong {
    border: 1px solid red;
    &:focus {
      border: 1px solid red;
    }
  }

  .input-username-ok {
    border: 1px solid rgb(0, 255, 47);
    &:focus {
      border: 1px solid rgb(0, 255, 47);
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
      border: 1px solid rgb(53, 107, 255);
    }
  }
}

.info-about-bio-wrap {
  max-width: 100%;
  padding: 5px;
  color: gray;
}
.edit-content {
  width: 100%;

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

.edti-nav {
  width: 100%;
  height: 8%;
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    position: absolute;
    top: 10px;
    left: 10px;
    height: 10px;
    color: $def-gray;
  }

  h1 {
    color: $text-main;
    font-size: 1.4rem;
    font-weight: 550;
    margin: 0% auto;
  }
}

.save-changes-btn {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 10px;
  bottom: 10px;
  background-color: #2897ff;
}
</style>
