<template>
  <div @touchmove.prevent="() => {}" class="input-container-main-wrap">
    <div class="content">
     <button class="file-select">
        <selected-file-modal @sendMsgWithFile="sendMsg"></selected-file-modal>
      </button>

      <input v-model="v" placeholder="Write a first message" />
    </div>

    <div class="send-btn-wrp">
      <button class="send-btn" v-show="ableTosend" @click="send">
        <span class="material-symbols-outlined"> send </span>
      </button>

      <button v-show="!ableTosend" class="send-btn">
        <span class="material-symbols-outlined"> keyboard_voice </span>
      </button>

    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import SelectedFileModal from "./SelectedFileModal.vue";

export default {
  components: { SelectedFileModal },
  props: {
    sendMsg: Function,
    required: true,
  },

  data() {
    return {
      v: '',
    };
  },
  methods: {
    async send() {
      this.sendMsg(this.v);
      this.v = "";
    },
  },
  computed: {
    ableTosend() {
      if (this.v.length) {
         return true
      }
      return false
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";

%btn-pattern {
  width: 55px;
  height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  cursor: pointer;
  flex-shrink: 0;
  border-radius: 27.5px;
}

%main-wrap-pattern {
  width: 70%;
}
.send-btn-wrp-fake {
  width: 55px;
  height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  cursor: pointer;
  flex-shrink: 0;
  border-radius: 27.5px;
  right: -59px;
}

.send-btn-wrp {
  @extend %btn-pattern;
  right: -59px;
  color: white;

  .scroll-bottom {
    @extend %btn-pattern;
    bottom: 75px;
    color: $second;
    background-color: $content-main-dark;

    &:hover {
      background-color: $hover;
    }
  }

  .send-btn {
    @extend %btn-pattern;
    background-color: $second;
    &:hover {
      background-color: $main;
    }

    span {
      font-size: 2rem;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}

.dark .scroll-bottom {
  background-color: $content-main-l;
  &:hover {
    background-color: $content-main-l;
    color: $main;
  }
}
.c {
  padding: 0px 10px 0px 6px;
  padding: 0px 10px 0px 6px;
}

.reply-border-wrap {
  width: 100%;
  height: 55px;
  position: absolute;
  box-sizing: border-box;
  bottom: 100%;
  display: flex;
  flex-direction: row;
  
}

.input-container-main-wrap {
  @extend %main-wrap-pattern;
  max-width: 1100px;
  position: relative;
  margin: 0% auto;
  height: 55px;
  display: flex;
  flex-direction: row;
  max-height: 60px;
  justify-content: center;
  bottom: 0;
  align-items: center;
  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 10px;

  span {
    font-size: 1.9rem;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
    cursor: pointer;
  }

  .content {
    user-select: none; /* supported by Chrome and Opera */
    width: 100%;
    background-color: $content-main-dark;
    border-radius: 20px 20px 0px 20px;
    justify-content: center;
    position: relative;
    align-items: center;
    flex-direction: row;
    display: flex;
    height: 100%;

    &:after {
      content: "";
      display: inline;
      position: absolute;
      right: -15px;
      bottom: 0px;
      width: 0;
      height: 0;
      border-top: 20px solid transparent;
      border-left: 16px solid $content-main-dark;
      border-bottom: 0px solid transparent;
    }

    .file-select {
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      height: 35px;
      width: 35px;
      flex-shrink: 0;
      user-select: none; /* Standard syntax */
      border-radius: inherit;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      margin-left: 10px;
    }

    input {
      width: 100%;
      height: 100%;
      max-height: 50px;
      font-size: 1rem;
      color: $text-main;
    }

    @media (min-width: 1700px) {
      input {
        padding-left: 15px;
        border-radius: 10px;
        width: 100%;
      }
    }
  }
}

.dark .input-container-main-wrap {
  .content {
    background-color: $content-main-l;

    &:after {
      border-left: 18px solid $content-main-l;
    }
    input {
      color: $text-main-l;
    }
  }
}

@media (max-width: 1270px) {
  %main-wrap-pattern {
    width: 90%;
  }

  %btn-pattern {
    position: static;
  }
  .send-btn-wrp {
    margin-left: 10px;
    .scroll-bottom {
      position: absolute;
    }
  }
}

@media (max-width: 500px) {
  %main-wrap-pattern {
    width: 100%;
  }

  .input-container-main-wrap {
    height: 48px;
  }

  %btn-pattern {
    height: 48px;
    width: 48px;
  }
}
</style>
