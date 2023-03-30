<template>
  <button @click="$router.go(-1)" class="back">
    <span class="material-symbols-outlined"> arrow_back_ios </span>
  </button>
  <button class="logout">
    logout
    <span @click="logout" class="material-symbols-outlined"> logout </span>
  </button>
  <div class="wrap">
    <div class="image-container">
      <img :src="user.photoURL" />
    </div>
    <input type="file" @change="uploadPhoto" />

    <div v-if="!preparedToChangeName">
      <h2>
        {{ takeName }}
        <span
          @click="preparedToChangeName = true"
          class="material-symbols-outlined"
        >
          edit
        </span>
      </h2>
    </div>
    <div v-else class="input-container">
      <p @click="changeDisplayName">apply</p>
      <input v-model.trim="value" class="chnage-name-input" />
      <span
        @click="preparedToChangeName = false"
        class="material-symbols-outlined"
      >
        close
      </span>
    </div>
    <p class="value-alert" v-if="wrongVal">u cant use @,#,!,$,+,|,|</p>
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
import { doc, getDoc } from "firebase/firestore";
import MessageItem from "../components/MessageItem.vue";
import { uuidv4 } from "@firebase/util";
import SelectedFileModal from "@/components/SelectedFileModal.vue";
import { getStorage, uploadBytes, ref,getDownloadURL} from "firebase/storage";

export default {
  data() {
    return {
      user: store.state.user.user,
      preparedToChangeName: false,
      value: store.state.user.user.displayName
        ? store.state.user.user.displayName
        : store.state.user.user.email,
      wrongVal: false,
      changedName: false,
     
    };
  },
  computed: {
    takeName() {
      if (this.changedName) {
        return this.changedName;
      }
      if (this.user.displayName) {
        return this.user.displayName;
      } else {
        return this.user.email;
      }
    }, 
  },
  created() {
  },
  methods: {
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

              getDownloadURL(storageRef).then((url) => {

                updateProfile(auth.currentUser, {
                  photoURL: url,
                })
                  .then(() => {
                   console.log('good', url)
                  })
                  .catch((error) => {
                    console.log('huynya', error)
                  });
              }).catch((er) => console.log('er',er))


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
.wrap {
  margin-top: 70px;
  display: flex;
  align-items: center;
  flex-direction: column;

  .back {
    position: absolute;
    top: 10px;
    left: 10px;
    height: 10px;
    color: $crazy_color;
  }

  .logout {
    position: absolute;
    top: 10px;
    right: 10px;
    height: 10px;
    color: $crazy_color;
  }

  .image-container {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #fff;

    img {
      width: 100%;
      min-height: 100%;
      object-fit: cover;
    }
  }

  h2 {
    margin-top: 10px;
    color: rgb(148, 148, 148);
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
      border-bottom: 2px solid rgb(59, 59, 59);
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
