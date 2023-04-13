<template>
  <div class="edit-wrap">
    <nav class="edti-nav">
      <button @click="() => $emit('close')">
        <span class="material-symbols-outlined"> arrow_back </span>
      </button>
      <h1>Edit Profile</h1>
    </nav>

    <div class="edit-content">
      <div class="image-container">
        <img :src="$store.state.user.user?.photoURL" />
        <div class="img-bloor">
          <span class="material-symbols-outlined"> add_a_photo </span>
        </div>
      </div>

      <div class="inputs_wrp">
        <div class="inpt-container">
          <p>First Name</p>
          <input class="default-inpt" v-model="firtsName" />
        </div>
        <div class="inpt-container">
          <p>Username</p>
          <input
            class="default-inpt"
            :class="{
              'input-username-wrong': usernameWrongData || usernameExist,
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

    <button @click="commitProfileChanges" class="save-changes-btn">
      <span class="material-symbols-outlined"> done </span>
    </button>
  </div>
</template>

<script>
import { collection, query, where, getDocs } from "firebase/firestore";
import firebase from "firebase/compat/app";

export default {
  props: {
    v: Boolean,
  },
  data() {
    return {
      v: this.v,
      firtsName: this.$store.state.user.user.displayName,
      username: this.$store.state.user.user.username,
      bio: this.$store.state.user.user.bio,

      firtsNameTmp: this.$store.state.user.user.displayName,
      usernameTmp: this.$store.state.user.user.username,
      bioTmp: this.$store.state.user.user.bio,

      uploadedPhoto: null,

      checkUsername: false,
      usernameWrongData: false,
      usernameExist: false,
      usernameAvaible: false,
    };
  },
  methods: {
  async  handleUsername() {

    this.usernameExist = false
    

      console.log("username changes", this);

      let data = this

      const wrongSymphols = [
        "@",
        "#",
        "$",
        "!",
        "+",
        "|",
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
        
        
        const username = this.username

        async function findUser() {
          const db = firebase.firestore();

          const q = query(
            collection(db, "usersPrew"),
            where("username", "==", username)
          );

          const querySnapshot = await getDocs(q);

            if (querySnapshot.docs[0]?.data()) {
            
               console.log(data, 'as THIS')
               data.usernameExist = true

            } else {

              //everything okey 



            }
              

        }

        findUser();
      } else {
        console.log("Huynya predelivay");
        this.usernameWrongData = true;

        console.log(this.usernameWrongData);
      }
    },
    handleTextArea(v) {
      console.log("handleTextArea", v);

      let el = this.$refs.textarea;

      el.style.height = "45px";
      el.style.height = el.scrollHeight + "px";

      console.log(this.bio);
    },
    async commitProfileChanges() {
      console.log("commit action");

      let somethingChanged =
        this.uploadedPhoto ||
        this.firtsName !== this.firtsNameTmp ||
        this.username !== this.usernameTmp ||
        this.bio !== this.bioTmp;

      if (somethingChanged) {
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$custom-c4: rgb(31, 31, 31);
$def-gray: #828282;
.edit-wrap {
  width: 100%;
  height: 100%;
  background-color: $custom-c4;
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
    background-color: $custom-c4;
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
    color: white;
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

  textarea {
    padding: 3px 0px 3px 5px;
    box-sizing: border-box;
    resize: none;
    overflow: hidden;
    margin-top: 15px;
    margin-bottom: 15px;
    color: white;
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
    color: #ffffff;
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
