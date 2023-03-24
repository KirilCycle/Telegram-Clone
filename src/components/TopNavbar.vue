<template>

    <div class="nav-container">
      <div class="profile-contntainer">
        <router-link to="/profile">
          <img @click="hideNavbar" :src="takephotoUrl">
        </router-link>
      </div>
    </div>

</template>

<script>
import store from "@/store/store";
import { computed } from 'vue';
import router from "@/router/router";


export default {
  data() {
    return {
      photo: store.state.user.user.photoURL
    }
  },

  computed: {
    takephotoUrl() {
      if (store.state.user.user.photoURL !== "https://example.com/jane-q-user/profile.jpg" && store.state.user.user.photoUR ) {
        return store.state.user.user.photoURL
      } else {
       return "https://memesmix.net/media/created/250/1ymo66.jpg"
      }
    }
  },
  setup(props) {
   
    function show () {
      console.log(store.state.user.user.photoURL)
    }

    function hideNavbar () {
      store.commit("user/setNavbar", false);
    }

   

    return {
      show,
      hideNavbar
    }

  }
 
};
</script>

<style lang="scss" scoped>

.nav-enter-active,
.nav-leave-active {
  transition: all 0.5s ease;
}
.nav-enter-from,
.nav-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.nav-container {
  width: 100%;
  z-index: 20;
  height: 60px;
  position: fixed;
  top: 0px;
  background-color: #181818;

  .profile-contntainer {
    width: 60px;
    height: 100%;
    position: absolute;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
  

    img {
      width: 80%;
      height: 80%;
      border-radius: 50px;
    }

  }


}
</style>
