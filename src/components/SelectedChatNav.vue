<template>
  <div @click="v = true" class="chat_nav_img_wrap">
    <img :src="$store.state.chat?.selectedUser?.photoURL" />
  </div>
  <Teleport to="body">
    <Transition>
      <div v-if="v">
        <user-profile @close="v = false"></user-profile>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import UserProfile from "./UserProfile.vue";
export default {
  components: { UserProfile },
  props: {
    userPhotoUrl: String,
    required: true,
  },
  data() {
    return {
      url: this.userPhotoUrl,
      v: false,
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    min-height: 100%;
    object-fit: cover;
  }
}
</style>
