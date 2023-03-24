Skip to content Search or jump to… Pull requests Issues Codespaces Marketplace
Explore @KirilCycle KirilCycle / teom_lab Public Cannot fork because you own
this repository and are not a member of any organizations. Code Issues Pull
requests Actions Projects Wiki Security Insights Settings
teom_lab/src/pages/AuthPage.vue @KirilCycle KirilCycle new reg/auth pages Latest
commit 05bd5d8 2 days ago History 1 contributor 223 lines (192 sloc) 4.22 KB

<template>
  <div class="wrap">
    <ul></ul>
    <form>
      <h2 v-if="!wrongData">Log in</h2>
      <h4 v-if="wrongData">wrong email or password</h4>
      <div class="input-container">
        <p class="info-tx">email</p>
        <input :class="{ wrong: wrongValues }" v-model="email" />
      </div>
      <div class="input-container">
        <p class="info-tx">password</p>
        <input
          :class="{ wrong: wrongValues }"
          :type="visible"
          v-model="password"
        />
      </div>
      <button class="pas_visible">
        <span @click.prevent="handleVisible" class="material-symbols-outlined">
          {{ visible !== "password" ? "visibility" : "visibility_off" }}
        </span>
      </button>
      <!-- <input  v-model="login" /> -->
      <button class="btn-c" @click.prevent="register">log in</button>
      <router-link class="link" to="/reg">I dont have account yet</router-link>
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
            router.push({ name: "chat" });
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
$crazy_color: #00ff44;
h4 {
  color: #f70000;
}
form {
  width: 380px;
  height: auto;
  position: absolute;
  bottom: 100px;
  padding: 20px;
  display: flex;
  margin: 0% auto;
  flex-direction: column;
}
.link {
  color: $crazy_color;
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
.btn {
}
.btn-c {
  padding: 10px 32px 10px 32px;
  border-radius: 5px;
  color: rgb(0, 0, 0);
  background-color: #3bd23d;
  margin: 0% auto;
  width: 100%;
  border: 0px;
  font-size: 1.3rem;
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
  display: block;
  margin: 0% auto;
  width: 40px;
  margin-top: 5px;
  :hover {
    color: #3bd23d;
  }
  margin-bottom: 5px;
}
.info-tx {
  color: gray;
  position: absolute;
  top: -12px;
  left: 2%;
}
input {
  border: 1px solid rgb(98, 98, 98);
  background-color: #ffffff00;
  margin-top: 10px;
  font: 1rem sans-serif;

  border-radius: 5px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  color: gray;
}
input:focus {
  border: 1px solid rgb(0, 252, 4);
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
Footer © 2023 GitHub, Inc. Footer navigation Terms Privacy Security Status Docs
Contact GitHub Pricing API Training Blog About teom_lab/AuthPage.vue at main ·
KirilCycle/teom_lab
