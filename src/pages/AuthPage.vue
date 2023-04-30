
<template>
  <div class="wrap">
   
    <form>

      <div class="app-intro">
          <img :src="appLogoSrc">
      </div>
      
      <h2 v-if="!wrongData">Vue messanger</h2>
      <h4 v-if="wrongData">wrong email or password</h4>
      <div class="input-container">
        <p class="info-tx">email</p>
        <main-input :class="{ wrong: wrongValues }" v-model="email" />
      </div>
      <div class="input-container">
        <p class="info-tx">password</p>
        <main-input
          :class="{ wrong: wrongValues }"
          :type="visible"
          v-model="password"
        />
      </div>
      <router-link class="link" to="/reg">I dont have account yet</router-link>
      <button class="pas_visible">
        <span @click.prevent="handleVisible" class="material-symbols-outlined">
          {{ visible !== "password" ? "visibility" : "visibility_off" }}
        </span>
      </button>
      <!-- <input  v-model="login" /> -->
      <main-button class="btn-c"  @click.prevent="register">SIGN IN</main-button>
    </form>
   

  </div>
</template>

<script>
import store from "@/store/store";
import router, { loginnedRoutes } from "@/router/router";
import { ref, watch, watchEffect } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebase from "firebase/compat/app";
import useValidationForm from "@/hooks/useValidationForm";
import useValidationFeatures from "@/hooks/useValidationsFeatures";
export default {
  data() {
    return {
      count: 3,
      response: {},
      appLogoSrc: "https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/chat-circle-blue-512.png",
    };
  },
  setup(props) {
    const { error, visible, wrongValues, wrongData, password, email } =
      useValidationForm();
    const { googleSignIn } = useValidationFeatures();
    watchEffect(() => {
      console.log(email.value);
    });
    return {
      googleSignIn,
      error,
      visible,
      wrongValues,
      wrongData,
    };
  },
  methods: {
    handleVisible() {
      this.visible === "password"
        ? (this.visible = "text")
        : (this.visible = "password");
    },

    register() {
      if (this.email.length > 7 && this.password.length > 7) {
        signInWithEmailAndPassword(getAuth(), this.email, this.password)
          .then((data) => {
            store.commit("user/setAuth", true);
            store.commit("user/setUser", data);
            console.log(store.state.user.isAuth, store.state.user.user);
            router.push({ name: "chats" });
          })
          .catch((er) => {
            this.wrongData = true;
          });
      } else {
        this.wrongValues = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

h4 {
  color: #f70000;
}
.app-intro {
  width: 100%;
  height: auto;
  img {
    height: 170px;
    width: auto;
  }
  @media screen and (max-width: 550px) {
    img {
      height: 120px;
    }
  }
}


form {
  width: 380px;
  height: auto;
  position: absolute;
  padding: 20px;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  flex-direction: column;

  @media screen and(max-width: 700px) {
    transform: translate(0%, -20%);
    top:auto;
    left: auto;
  }

}
.link {
  color: gray;
  margin-top: 20px;
}
.wronginput {
  color: red;
}
@media (max-width: 550px) {
  form {
    width: 280px;
  }
}

.btn-c {
  padding-top: 15px;
  padding-bottom: 15px;
  font-size: 1em;
}
h2 {
  font-size: 2rem;
  color: #ffffff;
  font-weight: 100;
  font-family: "Noto Sans", sans-serif;
  font-weight: 650;
}
.wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.input-container {
  width: 100%;
  position: relative;
  display: flex;
  margin-top: 32px;
}


.pas_visible {
  height: min-content;
  overflow: hidden;
  display: block;
  margin: 0% auto;
  width: 40px;
  padding: 8px;
  margin-top: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  :hover {
    color: $second;
  }
}
.info-tx {
  color: gray;
  position: absolute;
  top: -12px;
  left: 2%;
  background-color:  $body-color;
  height: min-content;
}



input {
  border: 1px solid rgb(98, 98, 98);
  background-color: #ffffff00;
  font: 1rem sans-serif;
  border-radius: 5px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  color: gray;
}

.wrong {
  border: 1px solid rgb(255, 0, 0);
  background-color: #ffffff00;
  margin-top: 10px;
  font: 1rem sans-serif;
  padding-left: 5px;
  border-radius: 5px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  color: gray;
}
.wrong:focus {
  border: 1px solid rgb(255, 18, 18);
}
</style>

