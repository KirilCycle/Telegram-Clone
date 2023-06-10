<template>
  <div @click="v = true" class="chat_nav_img_wrap">
    <img :src="$store.state.chat?.selectedUser?.photoURL" />
  </div>
  <Teleport to="body">
     <transition name="fade">
      <div v-if="v" >
     
        <user-profile @close="v = false"></user-profile>
      </div>
     </transition>
  </Teleport>
</template>

<script>
// import UserProfile from "../UserProfile.vue";
import { ref, defineAsyncComponent } from 'vue';
// const UserProfile = () => import("@/components/UserProfile.vue")


export default {
  components: {
    UserProfile: defineAsyncComponent(() =>  import("../UserProfile.vue") )
  },
  props: {
    userPhotoUrl: String,
    required: true,
  },
  data() {
    return {
      v: null
    }
  },
};
</script>

<style lang="scss" scoped>


.chat_nav_img_wrap {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid gray;
  flex-shrink: 0;
  cursor: pointer;


  img {
    width: 100%;
    min-height: 100%;
    object-fit: cover;
  }
}

@media (max-width: 798px) {
  .chat_nav_img_wrap {
    left: 0px;
  }
 }
</style>
