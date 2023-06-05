<template>
  <div class="main-wrap">
    <control-button class="chat-move" @click.stop="arrowAction">
      <span ref="chatArrow" class="material-symbols-outlined">
        chevron_left
      </span>
    </control-button>

<div class="selected-user-info">
    <selected-chat-user-vue></selected-chat-user-vue>
    <h3>{{ navName }}</h3>
</div>



    <chat-settings-vue></chat-settings-vue>
  </div>
</template>

<script>
import store from "@/store/store";
import ChatSettingsVue from "../ChatSettings.vue";
import SelectedChatUserVue from "./SelectedChatUser.vue";
import { getUser } from "@/features/getUser";
export default {
  components: {
    ChatSettingsVue,
    SelectedChatUserVue,
  },
  props: {
    arrowAction: Function,
  },
  data() {
    return {};
  },
  mounted() {
    this.$emit("setArrowRef", this.$refs.chatArrow);
  },
  computed: {
    navName() {
      const user = store.state.chat.selectedUser;

      if (user) {
        if (user?.displayName) {
          return user.displayName;
        } else {
          return user.email
            ? user.email.slice(0, user.email.indexOf("@"))
            : "loading";
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";

.main-wrap {
  position: relative;
  width: 100%;
  background-color: $content-main;
  height: 3.5rem;
  text-align: left;
  display: flex;
  align-items: center;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */

  .chat-move {
    display: none;
    .material-symbols-outlined {
      transform: rotate(180deg);
    }
  }

  @media (max-width: 1000px) {
    .chat-move {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
    }
  }

  h3 {
    font-weight: 500;
    font-size: 1.1rem;
    color: $text-main;
    left: 82px;
    top: 30%;
    margin-left: 7px;
  }
}

.selected-user-info {
  max-width: 75%;
  width: auto;
  word-wrap: none;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-direction: row;
  padding-left: 10px;
  padding-right: 10px;

}

.dark .chat-nav-x {
  background-color: $content-main-l;

  h3 {
    color: $text-main-l;
  }
}
</style>
