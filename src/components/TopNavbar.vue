<template>
  <div class="nav-container">
    <div class="profile-contntainer">
      <router-link to="/profile">
        <div  class="profile-img-container">
          <img @click="hideNavbar" :src="takephotoUrl" />
        </div> 
      </router-link>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import { computed } from "vue";
import router from "@/router/router";

export default {
  data() {
    return {
      photo: store.state.user.user.photoURL,
    };
  },

  computed: {
    takephotoUrl() {
      if (
        store.state.user.user.photoURL !==
          "https://example.com/jane-q-user/profile.jpg" &&
        store.state.user.user.photoUR
      ) {
        return store.state.user.user.photoURL;
      } else {
        return "https://5.imimg.com/data5/AK/RA/MY-68428614/apple-1000x1000.jpg";
      }
    },
  },
  setup(props) {
    function show() {
      console.log(store.state.user.user.photoURL);
    }

    function hideNavbar() {
      store.commit("user/setNavbar", false);
    }

    return {
      show,
      hideNavbar,
    };
  },
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
    height: 60px;
    position: absolute;
    right: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    

    .profile-img-container {
      width: 50px;
      height: 50px;
      border: 1px solid red;
      border-radius: 50%;
      overflow: hidden;

      img {
         width: 100%;
         min-height: 100%;
         object-fit:cover;
        
      }
    }

  }
}
</style>
