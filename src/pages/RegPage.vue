<template>
  <div class="wrap">
    <div class="wrap">
      <form>
        <h2 v-if="!wrongData">Create account</h2>
        <h4 v-if="wrongData">wrong data(idi gulyai)</h4>
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
          <span
            @click.prevent="handleVisible"
            class="material-symbols-outlined"
          >
            {{ visible !== "password" ? "visibility" : "visibility_off" }}
          </span>
        </button>
        <!-- <input  v-model="login" /> -->
        <button class="btn-c" @click.prevent="register">Go</button>
        <button  @click.prevent="useGoogle" >Google</button>
        <!-- <button @click.prevent="signInWithGoogle" class="btn-c">create</button> -->
      </form>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import router from "@/router/router";
import { ref } from "vue";
import store from "@/store/store";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const email = ref("");
const password = ref("");
const error = ref("");
const visible = ref("password");
const wrongValues = ref(false);
const wrongData = ref(false);

function handleVisible () {
  visible.value === "password" ? visible.value = "text" :visible.value = "password"
}



function register() {
  if (email.value.length > 7 && password.value.length > 7) {
    createUserWithEmailAndPassword(getAuth(), email.value, password.value)
      .then((data) => {
        store.commit("user/setAuth", true);
        console.log(store.state.user.isAuth);
        localStorage.setItem("user", JSON.stringify(data));
        //vtkkllx2367@gmail.com

        router.push({ name: "chat" });
      })
      .catch((er) => {
        
          wrongData.value = true
      });
  } else {
    wrongValues.value = true;
  }
}
</script>

<style lang="scss" scoped>

h4 {
  color: #f70000;
}


form {
  width: 380px;
  height: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
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
  color: #3bd23d;
  font-weight: 100;
  font-family: "Noto Sans", sans-serif;
  font-weight: 650;
}
.wrap {
  width: 100vw;
  height: 100vh;
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
  width: min-content;
  margin-top: 5px;
  background-color: rgba(0, 0, 0, 0);
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
  padding-left: 5px;
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
