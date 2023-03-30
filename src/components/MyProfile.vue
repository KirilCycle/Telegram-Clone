<template>
  <button @click="v = true">open profile</button>

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
export default {
  components: { ProfilePage },
  data() {
    return {
      v: false,
    };
  },
};
</script>

<style lang="scss" scoped>
v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.bloor {
  position: fixed;
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  background-color: #15151500;
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
