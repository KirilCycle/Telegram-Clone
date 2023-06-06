<template>
  <div @click="loadComponent" class="chat_nav_img_wrap">
    <img :src="$store.state.chat?.selectedUser?.photoURL" />
  </div>
  <Teleport to="body">
    <Transition>
      <div v-if="v" >
      <component @close="v = false" :is="userProfile"></component>
        <!-- <user-profile @close="v = false"></user-profile> -->
      </div>
    </Transition>
  </Teleport>
</template>

<script>
// import UserProfile from "../UserProfile.vue";
import { ref } from 'vue';
// const UserProfile = () => import("@/components/UserProfile.vue")


export default {
  components: {},
  props: {
    userPhotoUrl: String,
    required: true,
  },
setup() {
    const userProfile = ref(null);
    const v = ref(false)

    async function loadComponent() {
      const { default: UserProfile } = await import("../UserProfile.vue");
      userProfile.value = UserProfile;
      v.value = true
    }

    return {
      userProfile,
      loadComponent,
      v,
    };
  },
};
</script>

<style lang="scss" scoped>

.v-enter-active,
.v-leave-active {
transition: opacity 0.3s ease;
}

.v-enter-from {
    transition: opacity 0.3s ease;
}
.v-leave-to {
opacity: 0;
}


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
