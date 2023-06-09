<template>
  <div :class="'user-profile'">
    <top-settings-navbar :title="'User Info'">
      <template #close-btn>
        <control-button @click="$emit('close')">
          <span class="material-symbols-outlined"> close </span>
        </control-button>
      </template>
    </top-settings-navbar>

    <user-photo-vue>
      <template #img>
        <profile-image  :src="$store.state.chat?.selectedUser?.photoURL"></profile-image>
      </template>
      <template #firstxt>
        {{ $store.state.chat?.selectedUser?.displayName }}
      </template>
      <template #secondtxt>
        {{ $store.state.chat?.selectedUser?.username }}
      </template>
    </user-photo-vue>

    <div class="profile-user-info-wrp">
      <profile-user-info
        v-if="rerender"
        :bio="$store.state.chat?.selectedUser?.bio"
        :username="$store.state.chat?.selectedUser?.username"
      ></profile-user-info>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import UserImage from "./UserImage.vue";
import ProfileUserInfo from "./ProfileUserInfo.vue";
import { watchEffect } from "vue";
import { ref } from "vue";
import TopSettingsNavbar from "./UI/navbars/TopSettingsNavbar.vue";
import UserPhotoVue from "./UserPhoto.vue";
import ProfileImage from './UI/img-components/ProfileImage.vue';

export default {
  components: {
    UserImage,
    ProfileUserInfo,
    ProfileImage,
    TopSettingsNavbar,
    UserPhotoVue,
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


.profile-user-info-wrp {
  position: relative;
    top: 8%;
  width: 100%;
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
