<template>
  <div class="wrap">
    <form>
      <h2>Log in</h2>
      <div class="input-container">
        <p class="info-tx">email</p>
        <input v-model="email" />
      </div>
      <div class="input-container">
        <p class="info-tx">password</p>
        <input v-model="password" />
      </div>
      <!-- <input  v-model="login" /> -->
      <button class="btn-c" @click.prevent="register">create</button>
      <!-- <button @click.prevent="signInWithGoogle" class="btn-c">create</button> -->
    </form>
  </div>
</template>

<script setup>
/* eslint-disable */
import store from "@/store/store";
import router from "@/router/router";
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const email = ref("");
const password = ref("");
const error = ref("");

function register() {
  
  
  

  signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
      store.commit("user/setAuth", true);
      store.commit("user/setUser", data);
      console.log(store.state.user.isAuth, store.state.user.user);
      localStorage.setItem("user", JSON.stringify(data));
      //vtkkllx2367@gmail.com
     
       router.push({name: "chat"})
    })
    .catch((er) => {
      // redirect()
      console.log(er, email.value, password.value);
    });

  console.log("AAA");
}
</script>

<style scoped>
form {
  width: 500px;
  height: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.btn {
}

.btn-c {
  padding: 5px 15px 5px 15px;
  color: rgb(255, 255, 255);
  background-color: rgb(11, 150, 67);
  width: 30%;
  border: 0px;
}

h2 {
  font-size: 2rem;
  color: rgb(11, 150, 67);
  font-weight: 100;
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
  margin-top: 30px;
}

.info-tx {
  color: gray;
  position: absolute;
  top: -12px;
  left: 2%;
}

input {
  border: 2px solid rgb(98, 98, 98);
  background-color: #ffffff00;
  margin-top: 10px;
  font: 1.2rem sans-serif;
  border-radius: 25px;
  width: 100%;
  padding: 15px;
}

input:focus {
  border: 2px solid rgb(11, 150, 67);
}
</style>
