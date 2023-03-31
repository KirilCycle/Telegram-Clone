<template>
  <div class="profile" @click="v = true">
    <div class="photo-container">
      <img :src="photo" >
    </div>
  </div>

  <teleport to="body">
    <Transition>
      <div v-if="v" class="bloor">
        <div :class="'profile-container'">
          <profile-page @close="v = false"></profile-page>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<script>
import ProfilePage from "@/pages/ProfilePage.vue";
import { getAuth } from 'firebase/auth';
import  { ref } from 'vue';
export  default {
  components: { ProfilePage },
  data() {
    return {
      v: false,
      
    };
  },
  setup() {


    const auth = getAuth()

    const photo = ref(auth.currentUser.photoURL)

    return {
      photo
    }
  }
};
</script>

<style lang="scss" scoped>
$crazy_color: #00ff44;

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
    background-color: $crazy_color;
  
    img {
      width: 100%;
      min-height: 100%;
      object-fit: cover;
    }
  
  }

}

v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.bloor {
  z-index: 120;
  position: fixed;
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  background-color: #151515b8;
  width: 100%;
  height: 100%;
  display: flex;

  .profile-container-hidden {
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
    min-width: 500px;
    transform: translateX(-10%);
    background-color: rgba(0, 0, 0, 0);
    opacity: 0; /* add opacity property */
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .profile-container {
    min-width: 500px;
    transform: translateX(0%);
    background-color: black;
    opacity: 1; /* add opacity property */
  }
}
</style>
