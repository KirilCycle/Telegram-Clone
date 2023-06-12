<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="$store.state.message.visible">
        <message-actions></message-actions>
      </div>
    </transition>
  </Teleport>

  <div class="main">
    <div ref="leftbars" class="left-bar">
      <div ref="settings" class="settings-wrap">
        <div v-if="settingsVisible" class="profile-component-wrap">
          <settings-component
            @close="closeSettings"
            @shove="() => shoveSettings('0%')"
          >
          </settings-component>
        </div>
      </div>

      <div class="btn-controll">
        <chats-control-btn
          @globalInvoke="isGlobalSearch = true"
          :inputRef="this.$refs.searchInput"
        ></chats-control-btn>
      </div>

      <div class="left_bar_srch-wrap" placeholder="search chat">
        <settings @click="handleSettings"></settings>

        <div class="search-input-container">
          <div class="magnifying-glass-wrap">
            <div class="magnifying-glass"></div>
          </div>

          <input
            ref="searchInput"
            class="search-chats-input"
            placeholder="Search"
            :value="$store.state.chat.query"
            @input="(e) => serachChat(e.target.value)"
          />

          <button
            @click="resetQuerry"
            v-show="$store.state.chat.query?.length"
            class="reset-search-btn"
          >
            <span class="material-symbols-outlined"> close </span>
          </button>
        </div>
      </div>

      <div @click="() => shoveRightSide(true)" class="chat-list">
        <chat-list
          v-show="!isGlobalSearch"
          :storePath="'chat'"
          :chatList="chatList"
        ></chat-list>
        <founded-chats-list v-if="isGlobalSearch"></founded-chats-list>
      </div>
    </div>

    <div ref="chat" class="right-side">
      <selected-chat-navbar-vue
        v-show="$store.state.chat.chatId || $store.state.chat.selectedUser?.new"
        :arrowAction="handleChatPosition"
        @setArrowRef="setArrowRef"
      ></selected-chat-navbar-vue>

      <div ref="chatContainer" class="chat-container-x">
        <component
          :is="currentChatType"
          :key="$store.state.chatAdditionalDataManage.chatKey"
          :parentRef="$refs.chatContainer"
        >
        </component>
      </div>

      <div
        v-if="$store.state.chat.chatId || $store.state.chat.selectedUser"
        class="chat-input-block-x"
      >
        <div class="input-wrap">
          <div v-if="$store.state.chat.selectedUser?.new">
            <founded-chat-input-vue></founded-chat-input-vue>
          </div>

          <div v-else>
            <chat-input :sendMsg="sendMsg"></chat-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Timestamp } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { ref, onMounted } from "vue";
import { updateDoc } from "firebase/firestore";
import { doc, writeBatch } from "firebase/firestore";
import FoundedChatsList from "@/components/FoundedChatsList.vue";
import { getAuth } from "firebase/auth";
import { uuidv4 } from "@firebase/util";
import ChatList from "@/components/ChatList.vue";
import ChatInput from "@/components/chat/chat-input-components/ChatInput.vue";
import { watchEffect } from "vue";
import ChatisntSelected from "@/components/ChatisntSelected.vue";
import MessageActions from "@/components/MessageActions.vue";
import Settings from "@/components/Settings.vue";
import FoundedChatInputVue from "@/components/chat/chat-input-components/FoundedChatInput.vue";
import ChatsControlBtn from "@/components/ChatsControlBtn.vue";
import MetalKiller from "@/components/chat/MetalKiller.vue";
import { sendMsg } from "@/features/sendChatMessage";
import { sendMsgToFoundedChat } from "@/features/sendMsgToFoundedChat";
import SelectedChatNavbarVue from "@/components/chat/SelectedChatNavbar.vue";
import { getUser } from "@/features/getUser";
import { defineAsyncComponent } from "vue";
import useEventListener from "use-event-listener";
import NewChat from "@/components/chat/NewChat.vue";

export default {
  components: {
    MetalKiller,
    SettingsComponent: defineAsyncComponent(() =>
      import("../components/left-settings-component/SettingsComponent.vue")
    ),
    SelectedChatNavbarVue,
    NewChat,
    ChatisntSelected,
    FoundedChatsList,
    FoundedChatInputVue,
    ChatList,
    ChatsControlBtn,
    Settings,
    ChatInput,
    MessageActions,
  },
  data() {
    return {
      isGlobalSearch: false,
      value: "",
      chatKey: "s",
      settingsVisible: null,
      serachQ: "",
      parentChatRef: this.$refs.chatContainer,
      sendMsg: sendMsg,
      chatMoveStyle: "chat-move-back",
    };
  },
  mounted() {
    store.commit(
      "chatAdditionalDataManage/setChatContainerRef",
      this.$refs.chatContainer
    );
  },
  methods: {
    update(changeId) {
      if (changeId !== this.chatKey) {
        console.log("UPDATED");
        this.chatKey = changeId;
      }
    },
    handleSettings() {
      this.settingsVisible = true;
    },

    closeSettings() {
      this.shoveSettings("-120%");
      const shoveBackTimeTransiiton = 380;
      setTimeout(() => {
        this.settingsVisible = false;
      }, shoveBackTimeTransiiton);
    },

    shoveSettings(pos) {
      this.$refs.settings.style.transform = `translateX(${pos})`;
    },

    resetQuerry() {
      store.commit("chat/setQuery", null);
      this.serachQ = null;
      this.isGlobalSearch = false;
    },

    async addNewMessage(text, source, replyData) {
      const db = firebase.firestore();

      const auth = getAuth();

      const nextVerify = text.length > 0 || source;

      if (text.length < 2000 && nextVerify) {
        const message = {
          userName: auth.currentUser.displayName
            ? auth.currentUser.displayName.slice(0, 25)
            : auth.currentUser.email.slice(
                0,
                auth.currentUser.email.indexOf("@")
              ),
          userId: auth.currentUser.uid,
          text,
          createdAt: Timestamp.now(),
          // createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };

        if (source) {
          //   messageisNotReady.value = true;
          message.source = source;
        }

        if (replyData) {
          message.replyData = replyData;
        }

        const chatRefMsg = db
          .collection("chatMessages")
          .doc(store.state.chat.chatId)
          .collection("messages");

        console.log(chatRefMsg, "AS SEND");

        chatRefMsg.add(message).then((res) => console.log("res", res));

        const user1usersChatRef = doc(
          db,
          "usersLinksToChat",
          auth.currentUser.uid
        );
        const user2usersChatRef = doc(
          db,
          "usersLinksToChat",
          store.state.chat.chatId.replace(auth.currentUser.uid, "")
        );

        const lastMsgData = {
          text,
          createdAt: message.createdAt,
          from: message.userName,
        };

        await updateDoc(user1usersChatRef, {
          [store.state.chat.chatId]: {
            lastMsg: lastMsgData,
            id: store.state.chat.chatId,
          },
        });

        await updateDoc(user2usersChatRef, {
          [store.state.chat.chatId]: {
            lastMsg: lastMsgData,
            id: store.state.chat.chatId,
          },
        });

        //set this chat id at the first position on both users
        //i cnat manipulate with index directly
      }
    },

    serachChat(query) {
      query
        ? store.commit("chat/setQuery", query.replaceAll(" ", ""))
        : store.commit("chat/setQuery", null);

      if (query.replaceAll(" ", "")[0] === "@") {
        this.isGlobalSearch = true;
      } else {
        this.isGlobalSearch = false;
      }
    },
  },

  computed: {
    querryExist() {
      if (this.serachQ) {
        return true;
      }
      return false;
    },
  },

  setup(data) {
    const chatArrow = ref(null);
    const db = firebase.firestore();
    const collectionRef = db.collection("usersLinksToChat");
    const chatList = ref([]);
    const listLoaded = ref(null);
    const currentChatType = ref("ChatisntSelected");
    const auth = getAuth();
    const rightside = ref(null);
    const leftbar = ref(null);
    const isShoved = ref(null);
    const chat = ref(null);
    const chatContainer = ref(null);

    async function setPrevChat(chatIdFromHash) {
      if (chatIdFromHash) {
        let myId = store.state.user.user.uid;
        const enotherUser = await getUser(chatIdFromHash.replace(myId, ""));

        store.commit("chat/setSelectedUser", enotherUser);
        store.commit("chat/setChatId", chatIdFromHash);
      }
    }

    const stopWatch = watchEffect(() => {
      if (listLoaded.value && chatList.value.length) {
        const chatIdFromHash = window.location.hash
          .substring(1)
          .replaceAll("#", "")
          .replaceAll("/", "");

        setPrevChat(chatIdFromHash);
        // if (store.state.chat.chatSettings[chatIdFromHash]) {
        // }

        stopWatch();
      }
      if (!window.location.hash) {
        stopWatch();
      }
    });

    function handleChatPosition() {
      if (isShoved.value) {
        shoveRightSide(false);
        chatArrow.value.style.transform = "rotate(180deg)";
        return;
      }
      chatArrow.value.style.transform = "rotate(0deg)";
      shoveRightSide(true);
    }

    function saveLastLeftBarWidth() {
      localStorage.setItem("leftbarwidth", leftbar.value.offsetWidth + "px");
    }

    collectionRef.doc(store.state.user.user.uid).onSnapshot((doc) => {
      if (doc.exists) {
        const source = doc.data();

        const formated = Object.values(source);

        store.commit("chat/setChatIdList", formated);

        chatList.value = formated.sort(
          (a, b) => b.lastMsg.createdAt.seconds - a.lastMsg.createdAt.seconds
        );

        listLoaded.value = true;

        const chatsLength = formated.length;

        if (chatsLength !== store.state.chat.chatsCount) {
          for (let i = 0; i < chatsLength; i++) {
            store.commit("chat/addUniqChatSettingsItem", {
              id: formated[i].id,
              v: "",
              lastMsg: null,
              scrollPosition: null,
              limit: 0,
            });

            store.commit("chat/setChatsCount", chatsLength);
          }
        }
      } else {
        console.log("No such document!");
      }
    });

    function resetSelectedChat() {
      store.commit("chat/setSelectedUser", null);
      store.commit("chat/setChatId", null);
    }

    function saveChatSettings(id, limit) {
      const scrollPosition = chatContainer?.value?.scrollTop;

      const settings = {
        limit,
        scrollPosition,
        id,
      };

      console.log(settings, "HERE");

      store.commit("chat/changeChatSettings", settings);
    }

    onMounted(() => {
      rightside.value = document.querySelector(".right-side");
      leftbar.value = document.querySelector(".left-bar");

      //i need shov eright side, as by default she will overlap, and user wont be able select chat (650-1000px)
      shoveRightSide(false);

      //same width as user set before
      if (localStorage.getItem("leftbarwidth")) {
        console.log("ha ?", localStorage.getItem("leftbarwidth"));
        leftbar.value.style.width = localStorage.getItem("leftbarwidth");
      }

      //right-side should have relative width to left-bar even during left-bar resize
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const resizedElement = entry.target;
          const newWidth = resizedElement.clientWidth;
          localStorage.setItem("leftbarwidth", newWidth + "px");

          if (!isShoved.value) {
            rightside.value.style.transform = `translateX(${newWidth}px)`;
          }
        }
      });

      const resizableDiv = leftbar.value;

      resizeObserver.observe(resizableDiv);
    });

    function shoveRightSide(isBack) {
      if (window.innerWidth < 1000) {
        const leftBarWdth = leftbar.value.offsetWidth;

        if (!isBack) {
          // this.$refs.settings.style.transform = `translateX(${pos})`;
          console.log(leftBarWdth, rightside.value, "GO SVOVE");
          rightside.value.style.transform = `translateX(${leftBarWdth}px)`;
          isShoved.value = false;
          return;
        }
        if (chatArrow.value) {
          chatArrow.value.style.transform = "rotate(0deg)";
        }
        rightside.value.style.transform = `translateX(${0}px)`;
        isShoved.value = true;
      }
    }

    function setArrowRef(ref) {
      chatArrow.value = ref;
    }

    watchEffect(() => {
      if (store.state.chat.selectedUser?.new) {
        currentChatType.value = "NewChat";
      } else if (store.state.chat.chatId) {
        currentChatType.value = "MetalKiller";
      } else {
        currentChatType.value = "ChatisntSelected";
      }
    });

    return {
      chat,
      rightside,
      leftbar,
      shoveRightSide,
      saveLastLeftBarWidth,
      chatList,
      chatContainer,
      currentChatType,
      resetSelectedChat,
      saveChatSettings,
      listLoaded,
      handleChatPosition,
      setArrowRef,
      chatArrow,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.profile-component-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  background-color: rgb(109, 103, 103);
}

.settings-wrap {
  width: 100%;
  background-color: red;
  height: 100%;
  position: absolute;
  overflow: hidden;
  max-width: 390px;
  min-width: 220px;
  z-index: 30;
  transform: translateX(-120%);
  transition: transform 0.5s ease;
}

.btn-controll {
  z-index: 10;
  bottom: 20px;
  right: 20px;
  position: absolute;
  transition: transform 0.1s ease-out;
  transform: translateY(200px);
}

.chat-container-x {
  height: 78%;
  width: 70%;
  margin: 0% auto;
  overflow-y: scroll;
  overflow-x: hidden;
  max-width: 1100px;
  padding-top: 20px;
  transition: transform 0.2s ease-in-out;
}

.chat-container-x::-webkit-scrollbar {
  display: block;
  width: 7px;
}

@media (max-width: 1270px) {
  .chat-container-x {
    width: 90%;
  }
}

@media (max-width: 500px) {
  .chat-container-x {
    width: 100%;
  }
}

.chat-container-x::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
}

.chat-container-x::-webkit-scrollbar-thumb {
  background: rgba(133, 133, 133, 0.646);
  border-radius: 20px;
}

.chat-input-block-x {
  position: relative;
  width: 100%;
  height: 3.5rem;
  padding-top: 4px;
  max-width: inherit;

  .dark {
    border-bottom: 1px solid $content-main-l;
  }

  .input-wrap {
    height: 100%;
    width: 100%;
    margin: 0% auto;
  }
}

.main {
  display: flex;
  width: 100%;
  position: relative;
  overflow: hidden;
  max-height: 100%;
  min-height: 100%;
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
}
.dark .main {
  background-color: #44b09e;
  background-image: linear-gradient(315deg, #44b09e 0%, #e0d2c7 74%);
}

.left-bar {
  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  width: 350px;
  overflow: hidden;
  resize: horizontal;
  max-width: 450px;
  min-width: 200px;
  background-color: $content-main;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(128, 128, 128, 0.237);
  display: flex;
  left: 0;
  position: fixed;
  top: 0;
  flex-shrink: 0;

  .search-input-container {
    display: flex;
    flex-direction: row;
    position: relative;
    width: 100%;

    .magnifying-glass-wrap {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 100%;
      bottom: 2px;
    }

    .reset-search-btn {
      cursor: pointer;
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 100%;
      right: 0px;
      &:hover {
        color: $second;
      }
    }
  }

  .magnifying-glass {
    flex-shrink: 0;
    font-size: 4em; /* Adjusted font-size to make it smaller */
    display: inline-block;
    width: 0.15em; /* Adjusted width to make it smaller */
    box-sizing: content-box;
    height: 0.15em; /* Adjusted height to make it smaller */
    border: 0.04em solid $second-content; /* Adjusted border width to make it smaller */
    position: relative;
    border-radius: 0.125em; /* Adjusted border-radius to make it smaller */
  }

  .magnifying-glass:before {
    content: "";
    display: inline-block;
    position: absolute;
    right: -0.09em; /* Adjusted position to make it smaller */
    bottom: -0.03em; /* Adjusted position to make it smaller */
    border-width: 0;
    background: $second-content;
    width: 0.125em; /* Adjusted width to make it smaller */
    height: 0.03em; /* Adjusted height to make it smaller */
    transform: rotate(45deg);
  }

  .magnifying-glass-active {
    @extend .magnifying-glass;
    border: 0.04em solid $second;
  }

  .magnifying-glass-active:before {
    content: "";
    display: inline-block;
    position: absolute;
    right: -0.09em; /* Adjusted position to make it smaller */
    bottom: -0.03em; /* Adjusted position to make it smaller */
    border-width: 0;
    background: $second;
    width: 0.125em; /* Adjusted width to make it smaller */
    height: 0.03em; /* Adjusted height to make it smaller */
    transform: rotate(45deg);
  }

  .left_bar_srch-wrap {
    flex-shrink: 0;
    min-width: 100%;
    box-sizing: border-box;
    padding: 5px 13px 5px 5px;
    height: 3.5rem;
    max-height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: $content-main;

    .search-chats-input {
      background-color: $dark-input;
      height: 41px;
      width: 100%;
      padding-right: 5px;
      transition: border-color 0.6s ease;
      transition: box-shadow 0.4s ease;
      padding-left: 45px;
      padding-right: 45px;
      margin-left: 5px;
      font-size: 1rem;
      border-radius: 25px;
      color: $text-main;
      border: 1px solid rgb(51, 51, 51);

      &:hover {
        border: 1px solid rgb(102, 102, 102);
        transition: border-color 0.6s ease-out;
      }
      &:focus {
        box-shadow: inset 0px 1px 2px $second, inset 0px 0px 0px 2px $second;
        border: 1px solid $dark-input;
      }

      &::placeholder {
        color: #838383;
        font-size: 1rem;
        font-weight: 540;
      }
    }
  }

  .chat-list {
    overflow-x: hidden;
    padding: 0px 6px 0px 6px;
    @media (max-width: 650px) {
      padding: 0px;
    }
  }

  .chat-list-hided {
    overflow-x: hidden;
  }

  .chat-list::-webkit-scrollbar {
    width: 0em;
  }
}

.dark .left-bar .search-input-container {
  .reset-search-btn {
    &:hover {
      color: $main-l;
    }
  }
}

.left-bar:hover {
  .btn-controll {
    transform: translateY(0px);
  }
}

@media (max-width: 650px) {
  .btn-controll {
    transform: translateY(0px);
  }
}

.dark .left-bar .left_bar_srch-wrap {
  background-color: $content-main-l;
  .search-chats-input {
    background-color: $light-input;
    border: 1px solid rgb(232, 232, 232);
    &:hover {
      border: 1px solid rgb(180, 180, 180);
    }

    &:focus {
      box-shadow: inset 0px 1px 2px $input-main-color,
        inset 0px 0px 0px 2px $input-main-color;
      border: 1px solid white;
    }
  }

  input {
    color: $text-main-l;
  }
}
.dark .left-bar {
  background-color: $content-main-l;
}

.right-side {
  overflow-y: hidden;
  background-color: $body-color;
  width: 100vw;
  box-sizing: border-box;
  background-image: url("../components/UI/images/Jhone.jpg");
  background-image: url("https://images.hdqwalls.com/wallpapers/cyberpunk-city-night-view-4k-8l.jpg");
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: cover;
  height: 100%;
  padding-bottom: 30px;
  position: fixed;
  background-color: rgb(30, 30, 30);
  transition: transform 0.25s ease-in;
}

.dark .right-side {
  background-color: #ffffff;
  background-image: url("https://preview.redd.it/cubnmrxmu5v31.png?auto=webp&s=debd8a7920c7ac3b0778b8b688c5f35c093933d7");
}

.right-side-shoved-back {
  width: 100%;
  height: 100vh;
  background-color: $body-color;

  position: relative;
  overflow-y: hidden;
}
.dark .right-side-shoved-back {
  background-color: #7ee8fa;
}

@media (max-width: 1000px) {
  .right-side {
    flex-shrink: 0;
    position: absolute;
  }
}

@media (min-width: 1000px) {
  .right-side {
    transform: translateX(0px) !important;
    position: relative;
  }

  .left-bar {
    position: relative;
  }
}

@media (max-width: 650px) {
  .right-side {
    transition: transform 0.4s ease-in;
  }

  .left-bar {
    width: 100% !important;
    max-width: 650px;
  }
}
</style>
