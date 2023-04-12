<template>
    <button @click="v = true" class="menu-btn-wrap">
        <button class="menu-btn">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </button>
  
    <teleport to="body">
      <Transition>
       
        <div v-if="v" class="bloor">
          <div :class="'profile-container'">
            <profile-page  @close="v = false"></profile-page>
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
    components: { ProfilePage  },
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
  
  .menu-btn-wrap {
    cursor: pointer;
    border-radius: 5px;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background-color: #4040406b;
    }
    .menu-btn {
      width: 35px;
      height: 10px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;

      span {
        width: 45%;
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
  
  v-enter-active,
  .v-leave-active {
  transition: opacity 0.1s ease;
  }
  
  .v-enter-from,
  .v-leave-to {
  opacity: 0;
  }
  
  .bloor {
    z-index: 120;
    position: fixed;
    transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
    width: 310px;
    position: fixed;
    height: 100%;
    display: flex;
    overflow: hidden;
  
    .profile-container-hidden {
      transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
      min-width: 300px;
      transform: translateX(-10%);
      background-color: rgba(0, 0, 0, 0);
      opacity: 0; /* add opacity property */
    }
    .profile-container {
      min-width: 310px;
      max-width: 310px;
      transform: translateX(0%);
      background-color: rgb(32, 32, 32);
      opacity: 1; /* add opacity property */
    }
  }
  </style>
  