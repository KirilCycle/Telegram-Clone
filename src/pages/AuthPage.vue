
<template>
  <div class="wrap">
   
    <auth-reg-form-wrap>

      <app-logo-intro :src="appLogoSrc"></app-logo-intro>

      
      <h2>Vue messanger</h2>
      
      <h4 v-if="wrongData">invalid data</h4>

      <div class="input-container">
        <p class="info-tx">email</p>
        <main-input :class="{  invalidData: wrongData }" v-model="email" />
      </div>
      <div class="input-container">
        <p class="info-tx">password</p>
        <main-input
          :class="{  invalidData: wrongData }"
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
      <div class="btn-container">
        <main-button v-show="ableToVerify" class="btn-c"  @click.prevent="register">SIGN IN</main-button>
      </div>
      

    </auth-reg-form-wrap>
   

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
import AuthRegFormWrap from "@/components/AuthRegFormWrap.vue";
import AppLogoIntro from "@/components/AppLogoIntro.vue";

export default {
  components: {
    AuthRegFormWrap,
    AppLogoIntro
  },
  data() {
    return {
      count: 3,
      email: '',
      password: '',
      response: {},
      appLogoSrc: "https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/chat-circle-blue-512.png",
    };
  },
  setup(props) {
    const { error, visible, wrongValues, wrongData, password, email } =
      useValidationForm();
    const { googleSignIn } = useValidationFeatures();
   
    return {
      googleSignIn,
      error,
      visible,
      wrongValues,
      wrongData,
    };
  },
  computed: {
    ableToVerify() {
      if (this.email.length > 7 && this.password.length > 7 ) {
       return true
      }
      return false
    }
  },
  methods: {
    handleVisible() {
      this.visible === "password"
        ? (this.visible = "text")
        : (this.visible = "password");
    },

    register() {
       
      this.wrongData = false;

         signInWithEmailAndPassword(getAuth(), this.email, this.password)
          .then((data) => {
            store.commit("user/setAuth", true);
            store.commit("user/setUser", data);
            router.push({ name: "chats" });
          })
          .catch((er) => {
            this.wrongData = true;
          });
        
   

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





.link {
  color: gray;
  margin-top: 20px;
  text-decoration:none;
 
  &:hover {
    color: $second;
    text-decoration:underline
  }

}

.invalidData {
 border: 1px solid rgba(220, 6, 6, 0.988);
}



.btn-container {
  height: 47px;
  width: 100%;
  .btn-c {
    padding-top: 15px;
    padding-bottom: 15px;
    border-radius: 20px;
    font-size: 17px;
    width: 100%;
  }
}

h2 {
  font-size: 2rem;
  color: #ffffff;
  font-weight: 100;
  font-family: "Noto Sans", sans-serif;
  font-weight: 650;
}

.dark  h2{
  font-size: 2rem;
  color: #030303;
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
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0% auto;
  width: 40px;
  height: 40px;
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
  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  position: absolute;
  top: -12px;
  left: 2%;
  padding: 0px 3px 0px 3px;
  background-color:  $body-color;
  pointer-events: none;
  height: min-content;
}

.dark .info-tx {
  background-color: $body-color-l ;
}

.wrongPass {
  color: red;
}


.wrongEmail {
  color: red;
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

