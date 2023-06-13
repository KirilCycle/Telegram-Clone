<template>
  <div class="wrap">
    <auth-reg-form-wrap>
      <app-logo-intro :src="appLogoSrc"></app-logo-intro>
      <h2>Create account</h2>
      <h4 v-if="wrongData">invalid data</h4>
      <div class="input-container">
        <p class="info-tx">email</p>
        <main-input :class="{ invalidData: wrongData }" v-model="email" />
      </div>
      <div class="input-container">
        <p class="info-tx">password</p>
        <main-input
          :class="{ invalidData: wrongData }"
          :type="visible"
          v-model="password"
        />
      </div>

      <div class="last-content">
        <div v-show="!ableToVerify" class="input-container">
          <p class="info-tx">repeat password</p>
          <main-input
            :class="{ invalidData: wrongData }"
            :type="visible"
            v-model="secondPassword"
          />
        </div>

        <div v-show="ableToVerify" class="btn-container">
          <main-button class="btn-c" @click.prevent="register">GO</main-button>
        </div>
      </div>
    </auth-reg-form-wrap>
    <button class="pas_visible">
      <span @click.prevent="handleVisible" class="material-symbols-outlined">
        {{ visible !== "password" ? "visibility" : "visibility_off" }}
      </span>
    </button>

    <router-link class="link" to="/auth">I already have account </router-link>
  </div>
</template>

<script>
/* eslint-disable */
import router from "@/router/router";
import store from "@/store/store";
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import useValidationForm from "@/hooks/useValidationForm";
import useValidationFeatures from "@/hooks/useValidationsFeatures";
import AuthRegFormWrap from "@/components/AuthRegFormWrap.vue";
import AppLogoIntro from "@/components/AppLogoIntro.vue";
import { createPreviewUserCoppy } from "@/features/createPreviewUserCoppy"

export default {
  components: {
    AuthRegFormWrap,
    AppLogoIntro,
  },
  computed: {
    ableToVerify() {
      if (this.email.length > 7 && this.password.length > 7) {
        if (this.password === this.secondPassword) {
          this.samePasswords = true;
          return true;
        } else {
          this.samePasswords = false;
          return false;
        }
      }
      this.samePasswords = true;
      return false;
    },
  },
  data() {
    return {
      samePasswords: false,
      appLogoSrc:
        "https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/chat-circle-blue-512.png",
    };
  },

  setup() {
    const { email, password, error, visible, wrongValues, wrongData } =
      useValidationForm();

    const secondPassword = ref("");

    function handleVisible() {
      visible.value === "password"
        ? (visible.value = "text")
        : (visible.value = "password");
    }

    function register() {
      if (email.value.length > 7 && password.value.length > 7) {
        createUserWithEmailAndPassword(
          getAuth(),
          email.value,
          password.value
        ).then((data) => {
          
          store.commit("user/setUser", data.user);
          router.push({ name: "chats" })
        });
      }
    }

    return {
      email,
      handleVisible,
      password,
      register,
      wrongData,
      visible,
      secondPassword,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

h4 {
  color: #f70000;
}

.last-content {
  height: 60px;
}

.invalidData {
  border: 1px solid rgba(220, 6, 6, 0.988);
}

.link {
  color: rgb(105, 105, 105);
  text-decoration: none;

  &:hover {
    color: $second;
    text-decoration: underline;
  }
}

.info-tx {
  color: gray;
  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  position: absolute;
  top: -5px;
  left: 2%;
  padding: 0px 3px 0px 3px;
  background-color: $body-color;
  pointer-events: none;
  height: min-content;
}

.dark .info-tx {
  background-color: white;
}

.wronginput {
  color: red;
}

.btn-container {
  height: 47px;
  width: 100%;
  margin-top: 35px;
  .btn-c {
    padding-top: 15px;
    padding-bottom: 15px;
    font-size: 17px;
    border-radius: 20px;
    width: 100%;
  }
}

h2 {
  font-size: 2rem;
  color: white;
  font-weight: 100;
  font-family: "Noto Sans", sans-serif;
  font-weight: 650;
}

.dark h2 {
  color: rgb(0, 0, 0);
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
  margin-top: 25px;
}

.pas_visible {
  height: min-content;
  display: block;
  margin: 0% auto;
  width: min-content;
  overflow: hidden;
  margin-top: 10px;
  height: min-content;

  :hover {
    color: $second;
  }
  margin-bottom: 5px;
}

.input-container {
  width: 100%;
  position: relative;
  display: flex;
  margin-top: 25px;
}

input {
  border: 1px solid rgb(98, 98, 98);
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
