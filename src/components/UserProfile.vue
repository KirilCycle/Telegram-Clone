<template>
  <div :class="'user-profile'">
    <nav>
      <button @click="$emit('close')">
        <span class="material-symbols-outlined"> close </span>
      </button>
      <h3>User Info</h3>
    </nav>

    <user-image>
      <div class="profile-img-wrap">
        <img
          class="profile-img"
          :src="$store.state.chat?.selectedUser?.photoURL"
        />
      </div>
      <h2 class="fisrtname">
        {{ $store.state.chat?.selectedUser?.displayName }}
      </h2>
    </user-image>

    <profile-user-info
      v-if="rerender"
      :bio="$store.state.chat?.selectedUser?.bio"
      :username="$store.state.chat?.selectedUser?.username"
    ></profile-user-info>
  </div>
</template>

<script>
import store from "@/store/store";
import UserImage from "./UserImage.vue";
import ProfileUserInfo from "./ProfileUserInfo.vue";
import { watchEffect } from "vue";
import { ref } from "vue";

export default {
  components: {
    UserImage,
    ProfileUserInfo,
  },

  data() {
    return {
      v: false,
    };
  },

  watch: {
    store(newValue) {
      console.log("AAAAA");
    },
  },

  setup() {
    //i know this is horrible solution, but only it is works (i will make rerender particular component to get actual data from store, in addition )
    //
    // wont work
    //
    // rerender.value = false
    // rerender.value = true
    //
    // wont work
    //
    // rerender.value = false
    // setTimeout(() => {
    // rerender.value = true;
    // });
    //
    //
    //
    //

    const rerender = ref(true);

    function setrerender() {
      rerender.value = false;
      back();
    }

    function back() {
      setTimeout(() => {
        rerender.value = true;
      });
    }

    watchEffect(() => {
      setrerender();

      rerender.value = false;

      console.log(store.state.chat?.selectedUser?.username, "AAAAAAA CHANGES");
    });

    return {
      rerender,
    };
  },
};
</script>

<style lang="scss" scoped>
$custom-c4: rgb(23, 23, 23);
$def-gray: #828282;

@import "@/styles/colors";

.profile-img-wrap {
  width: 100%;
  height: 100%;
  position: relative;
}
.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

nav {
  width: 100%;
  background-color: $content-main;
  height: 8%;
  display: flex;
  align-items: center;
  flex-direction: row;

  h3 {
    margin-left: 20px;
    color: $text-main;
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
        background-color: $hover;
      }
    }
  }

}

.dark nav {
  background-color: $content-main-l;

  h3 {
    margin-left: 20px;
    color: $text-main-l;
  }

}
.user-profile {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  border-left: 1px solid rgba(128, 128, 128, 0.237);
  position: absolute;
  z-index: 150;
  min-width: 310px;
  max-width: 310px;
  right: 0px;
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
  background-color: $content-main-dark;
}

.dark .user-profile {
  background-color: $content-main-l;
}

.photo-container {
  width: 100%;
  height: 300px;
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
    bottom: 5px;
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
