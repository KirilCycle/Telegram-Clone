<template>
    <div @click="v = true" class="chat_nav_img_wrap">
        <img :src="$store.state.chat?.selectedUser?.photoURL">
      </div>
      <Teleport to="body">
        <div v-if="v">
            <user-profile></user-profile>
        </div>
      </Teleport>
</template>

<script>
import UserProfile from './UserProfile.vue'
    export default {
  components: { UserProfile },
        props: {
            userPhotoUrl: String,
            required: true
        },
        data() {
            return {
                url: this.userPhotoUrl,
                v: false
            }
        }
    }
</script>

<style lang="scss" scoped>
.chat_nav_img_wrap{
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