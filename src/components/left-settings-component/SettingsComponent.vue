<template>
  <div class="wrap" @click="moreContentV = false">
    <top-settings-navbar-vue :title="'Settings'">
      <template v-slot:close-btn>
        <control-button @click="$emit('close')">
          <span class="material-symbols-outlined"> arrow_back </span>
        </control-button>
      </template>
      <template v-slot:action1>
        <control-button @click="() => handleEditComponent(true)">
          <span class="material-symbols-outlined"> edit </span>
        </control-button>
      </template>
      <template v-slot:action2>
        <control-button @click.stop="moreContentV = true">
          <span class="material-symbols-outlined"> more_vert </span>

          <div class="options-list-wrap">
            <optiosn-list-vue
              v-show="moreContentV"
              :optionsList="settingsOptions"
            ></optiosn-list-vue>
          </div>
        </control-button>
      </template>
    </top-settings-navbar-vue>

    <user-photo-vue>
      <template #img>
        <profile-image
          :source="$store.state.user.user?.photoURL"
        ></profile-image>
      </template>
      <template #firstxt>
        {{ $store.state.user.user.displayName }}
      </template>
      <template #secondtxt>
        {{ $store.state.user.user.email }}
      </template>
    </user-photo-vue>

    <div class="profile-user-info-wrp">
      <profile-user-info
        :bio="$store.state.user.user.bio"
        :username="$store.state.user.user.username"
      ></profile-user-info>
    </div>
    <div ref="edit" class="edit-panel">
      <edit-settings @close="() => handleEditComponent(false)"></edit-settings>
    </div>

    <div class="profile-user-info-wrp">
      <radio-select
        :header="'Theme'"
        :selected="prevTheme"
        :btnsRadioList="themeVariations"
      ></radio-select>
    </div>

    <div class="profile-user-info-wrp">
      <radio-select
        :header="'I have cool reuseful'"
        :selected="prevTheme"
        :btnsRadioList="options"
      ></radio-select>
    </div>

    <div class="profile-user-info-wrp">
      <radio-select
        :header="'radio btns list'"
        :selected="prevTheme"
        :btnsRadioList="options2"
      ></radio-select>
    </div>
  </div>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="logoutV" class="modal-alert-wrap">
        <standart-alert-vue
          :header="'log out'"
          :description="'Are u shure you want to log out'"
          :action="{ title: 'yes', executeFn: logout }"
          @close="() => closeMoreContent(() => (this.logoutV = false))"
        ></standart-alert-vue>
      </div>
    </transition>
  </Teleport>
</template>

<script>
import store from "@/store/store";
import { signOut } from "firebase/auth";
import { useDark } from "@vueuse/core";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getAuth } from "firebase/auth";
import { ref } from "firebase/storage";
import UserImage from "@/components/UserImage.vue";
import EditSettings from "./EditSettings.vue";
import ProfileUserInfo from "@/components/ProfileUserInfo.vue";
import RadioSelect from "@/components/RadioSelect.vue";
import TopSettingsNavbarVue from "../UI/navbars/TopSettingsNavbar.vue";
import OptiosnListVue from "../UI/lists/OptiosnList.vue";
import UserPhotoVue from "../UserPhoto.vue";
import firebase from "firebase/compat/app";
import ProfileImage from "../UI/img-components/ProfileImage.vue";
import StandartAlertVue from "../UI/alerts/StandartAlert.vue";

export default {
  components: {
    UserImage,
    UserPhotoVue,
    StandartAlertVue,
    ProfileImage,
    EditSettings,
    OptiosnListVue,
    ProfileUserInfo,
    RadioSelect,
    TopSettingsNavbarVue,
  },
  data() {
    return {
      user: store.state.user.user,
      profilePhoto: store.state.user.user.photoURL,
      value: store.state.user.user.displayName
        ? store.state.user.user.displayName
        : store.state.user.user.email,
      wrongVal: false,
      changedName: false,
      newFile: null,
      isLoading: false,
      logoutV: false,
      moreContentV: false,
      settingsOptions: [
        {
          htmlIcoEl: `<span class="material-symbols-outlined"> logout </span>`,
          description: "log out",
          execute: () => {
            this.logoutV = true;
          },
        },
      ],
    };
  },
  computed: {
    prevTheme() {
      if (
        localStorage.getItem("vueuse-color-scheme") !== "auto"
          ? "dark"
          : "light"
      ) {
        return localStorage.getItem("vueuse-color-scheme") !== "auto"
          ? "dark"
          : "light";
      }
      return "dark";
    },
  },
  mounted() {
    this.$emit("shove");
  },

  methods: {
    closeMoreContent(secondAction) {
      this.moreContentV = false;
      secondAction();
    },

    async handleEditComponent(state) {
      this.inEdit = state;
      state
        ? (this.$refs.edit.style.transform = `translateX(-100%)`)
        : (this.$refs.edit.style.transform = `translateX(0%)`);
    },

    logout() {
      const auth = getAuth();
      signOut(auth);
      location.reload();
    },

    handleCancel() {
      this.logoutV = false;
      this.moreContentV = false;
    },
  },
  setup(props) {
    console.log(store.state.user);

    function logout() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          // Sign-out successful.
        })
        .catch((error) => {
          // An error happened.
        });
    }

    const isDark = useDark();

    function setLightTheme() {
      isDark.value = false;
      const root = document.querySelector("#app");
      root.classList.remove("dark-theme");
    }

    function setDarkTheme() {
      isDark.value = true;
      const root = document.querySelector("#app");
      root.classList.add("dark-theme");
    }

    const themeVariations = ref([
      { name: "light", value: "light", execute: setDarkTheme, title: "Light" },
      { name: "dark", value: "dark", execute: setLightTheme, title: "Dark" },
    ]);

    const options = ref([
      { name: "option", value: "option", execute: () => {}, title: "option" },
      {
        name: "option2",
        value: "option2",
        execute: () => {},
        title: "option2",
      },
    ]);

    const options2 = ref([
      {
        name: "option3",
        value: "option3",
        execute: () => {},
        title: "option33333333",
      },
      {
        name: "option4",
        value: "option4",
        execute: () => {},
        title: "option4",
      },
      {
        name: "option5",
        value: "option5",
        execute: () => {},
        title: "option5",
      },
      {
        name: "option6",
        value: "option6",
        execute: () => {},
        title: "option6",
      },
    ]);

    return {
      logout,
      themeVariations,
      options,
      options2,
    };
  },
};
</script>

<style lang="scss" scoped>
$custom-c4: rgb(31, 31, 31);
$def-gray: #b2b2b2;
@import "@/styles/colors";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.options-list-wrap {
  width: 180px;
  position: absolute;
  top: 55px;
  right: 15px;
}

.modal-alert-wrap {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.705);
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 200;
}

.edit-panel {
  width: 100%;
  position: absolute;
  left: 100%;
  height: 100%;
  z-index: 25;
  transform: translateX(0);
  transition: transform 0.4s ease-in-out;
}

.settings {
  color: $text-main;
  font-size: 1.4rem;
  font-weight: 550;
  margin: 0% auto;
}

.dark .settings {
  color: $text-main-l;
}

.profile-user-info-wrp {
  position: relative;
  top: 8%;
  width: 100%;
}

.user-image-wrp {
  position: relative;
  width: 100%;
  top: 8%;

  @media screen and(min-width: 1400px) {
    top: 60px;
  }
}

.wrap {
  background-color: $content-main-dark;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  height: 100%;
  width: 100%;
  border-right: 1px solid rgba(128, 128, 128, 0.237);
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  flex-direction: column;

  &::-webkit-scrollbar {
    display: none;
  }

  .profile-txt-wrp {
    text-align: center;
    display: flex;
    flex-direction: column;

    h3 {
      color: #434343;
      font-size: 1rem;
      margin-top: 6px;
    }
  }
}

.dark .wrap {
  background-color: $content-main-l;
}
</style>
