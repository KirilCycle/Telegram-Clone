<template>
  <button @click="v = true" class="menu-btn-wrap">
    <button class="menu-btn">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </button>

  <!-- <teleport to="body">
    <Transition  name="fade">
    <div v-if="v" class="profile-component-wrap">
        <profile-page @close="v = false"></profile-page>
    </div>
    </Transition>
  </teleport> -->
</template>

<script>
import ProfilePage from "@/pages/ProfilePage.vue";
import { getAuth } from "firebase/auth";
import { ref } from "vue";
export default {
  components: { ProfilePage },
  data() {
    return {
      v: false,
    };
  },
  setup() {
    const auth = getAuth();

    const photo = ref(auth.currentUser.photoURL);

    return {
      photo,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.menu-btn-wrap {
  cursor: pointer;
  border-radius: 5px;
  width: 43px;
  flex-shrink: 0;
  height: 43px;
  border-radius: 21.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: $hover;
  }
  .menu-btn {
    width: 35px;
    cursor: pointer;
    height: 10px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    span {
      width: 45%;
      cursor: pointer;
      height: 2px;
      background-color: #8b8b8b;
    }
  }
}

.profile {
  position: fixed;
  top: 0px;
  width: 55px;
  height: 55px;
  right: 0px;
  z-index: 120;
  .photo-container {
    border-radius: 50%;
    height: 100%;
    width: 100%;
    overflow: hidden;
    border: 1px solid rgb(57, 57, 57);

    img {
      width: 100%;
      min-height: 100%;
      object-fit: cover;
    }
  }
}

.profile-component-wrap {
  z-index: 120;
  position: fixed;
  width: 310px;
  position: fixed;
  height: 100%;
  display: flex;
  overflow: hidden;
  min-width: 310px;
  max-width: 310px;
  transform: translateX(0%);
  background-color: rgb(32, 32, 32);
  opacity: 1; /* add opacity property */
}
</style>
