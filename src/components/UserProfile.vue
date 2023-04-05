<template>
  <div :class="'user-profile'">
    <nav>
      <button @click="$emit('close')">
        <span class="material-symbols-outlined"> close </span>
      </button>
      <h3>User Info</h3>
    </nav>
    <div class="photo-container">
      <img :src="$store.state.chat?.selectedUser?.photoURL" />
      <h2>Sexy pro</h2>
      <h3>{{ $store.state.chat?.selectedUser?.email }}</h3>
      <div class="bottom-img-shadow"></div>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
export default {
  data() {
    return {
      v: false,
    };
  },
};
</script>

<style lang="scss" scoped>
$custom-c4: rgb(23, 23, 23);
$def-gray: #828282;

nav {
  width: 100%;
  background-color: #393939;
  background-color: $custom-c4;
  height: 8%;
  display: flex;
  align-items: center;
  flex-direction: row;
  h3 {
    margin-left: 20px;
    color: white;
  }
  button {
    width: 60px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      border-radius: 20px;
      height: 40px;
      color: $def-gray;
      &:hover {
        background-color: #ffffff22;
      }
    }
  }
}
.user-profile {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  border-left: 1px solid rgb(65, 65, 65);
  position: absolute;
  z-index: 150;
  min-width: 320px;
  right: 0px;
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
  background-color: #171717;
}

.photo-container {
  width: 100%;
  height: 330px;
  background-color: #ffffff00;
  position: relative;
  overflow: hidden;

  img {
    background: #46464600;
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    max-height: 100%;
  }
  h3 {
    color: #c8c8c8;
    position: absolute;
    bottom: 3px;
    left: 7px;
    z-index: 50;
    font-size: 1rem;
  }
  h2 {
    color: #ffffff;
    z-index: 50;
    position: absolute;
    bottom: 23px;
    left: 7px;
    font-size: 1.5rem;
  }
}

.bottom-img-shadow {
  width: 100%;
  position: absolute;
  height: 30px;
  background-color: #ff343400;
  box-shadow: rgba(0, 0, 2, 10) 0px 32px 70px 40px;
  bottom: -30px;
  
}
</style>
