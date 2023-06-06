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
          <optiosn-list-vue
            v-show="moreContentV"
            :optionsList="settingsOptions"
          ></optiosn-list-vue>
        </control-button>
      </template>
    </top-settings-navbar-vue>

    <user-photo-vue>
      <template #img>
        <img :src="$store.state.user.user?.photoURL" />
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

export default {
  components: {
    UserImage,
    UserPhotoVue,
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
          execute: () => alert("sus"),
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

.edit-panel {
  width: 100%;
  position: absolute;
  left: 100%;
  height: 100%;
  z-index: 25;
  transform: translateX(0);
  transition: transform 0.4s ease-in-out;
}

.profile-img-wrap {
  width: 100%;
  height: 100%;
  position: relative;
}
.profile-img {
  width: auto;
  min-height: 100%;
  object-fit: cover;
}

.profile_img_wrap_text_wrp {
  .fisrt-name {
    z-index: 12;
    font-size: 1.2rem;
    font-weight: 700;
    color: #ffffff;
    position: absolute;
    bottom: 23px;
    left: 20px;
  }
  .email {
    color: #c8c8c8;
    position: absolute;
    bottom: 3px;
    left: 20px;
    font-size: 1rem;
    z-index: 10;
  }
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

img {
  background: #46464600;
  min-width: 100%;
  height: auto;
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

  .profile-edit-container {
    position: relative;
    display: flex;
    width: 100%;
    padding: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    input {
      margin-top: 15px;
      width: 75%;
      height: 35px;
      background-color: #303030;
      border-radius: 5px;
      color: #ffffff;
      font-weight: 500;
      padding-left: 5px;
      font-size: 1.1rem;
    }
  }

  h2 {
    margin-top: 10px;
    color: rgb(255, 255, 255);
    font-size: 20px;
    font-weight: normal;
  }

  .value-alert {
    margin-top: 10px;
    color: rgb(61, 61, 61);
  }
}

.dark .wrap {
  background-color: $content-main-l;
}

.logout-alert {
  width: 100%;
  height: 100%;
  background-color: #00000089;
  position: absolute;
  z-index: 300;
  display: flex;
  justify-content: center;
  align-items: center;

  .logout-modal {
    width: 315px;
    height: 150px;
    background: #1f1f1f;
    border-radius: 10px;
    padding: 15px;
    position: relative;
    box-sizing: border-box;

    h2 {
      font-size: 1.3rem;
      color: white;
      position: static;
    }

    p {
      font-size: 1rem;
      color: white;
      margin-top: 20px;
      margin-bottom: 20px;
    }

    .logoout_modal_btns_wrp {
      width: 100%;
      height: max-content;
      display: flex;
      flex-direction: row-reverse;

      button {
        width: 32%;
        height: 35px;
        font-weight: 550;
        color: rgb(45, 108, 255);
        font-size: 1rem;
        margin-right: 10px;
        border-radius: 5px;
        cursor: pointer;

        &:hover {
          transition: 0.3s ease-in-out;
          background-color: rgba(45, 108, 255, 0.055);
        }
      }
    }
    .logoout_modal_btns_wrp :last-child {
      &:hover {
        background-color: rgba(255, 0, 0, 0.056);
      }
      color: red;
    }
  }
}
</style>
