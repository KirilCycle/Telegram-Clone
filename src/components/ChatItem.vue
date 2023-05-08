<template>
  <div class="cht-i" :class="{ active: id === $store.state.chat.chatId }">
    <div class="img-conatiner">
      <div class="img-wrap">
        <img :src="pthUrl" />
      </div>
    </div>
    <div class="chatitem_info_container">
      <div class="name">
        <slot name="name"></slot>
      </div>
      <div class="last">
        <slot name="last_msg"></slot>
      </div>
    </div>
    <p class="time">{{ time }}</p>
  </div>
</template>

<script>
import store from "@/store/store";
export default {
  data() {
    return {
      TampStamp: this.time,
      active: this.id === store.state.chat.chatId,
    };
  },
  props: {
    pthUrl: String,
    id: String,
    time: Number,
    required: true,
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";
.cht-i {
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
  width: 100%;
  height: 70px;
  overflow: hidden;
  display: flex;
  &:hover {
    background-color: #b3b3b330;
    .time {
      color: $text-main;
    }

  
  }
  flex-direction: row;
  align-items: center;

  .name {
    color: $text-main;
    font-size: 0.9rem;
    font-weight: 550;
  }


  .last {
    color: gray;
    font-size: 0.9rem;
    white-space: nowrap;
    font-weight: 550;
  }

  .img-conatiner {
    padding-left: 5px;
    padding-right: 5px;
    height: 100%;
    flex-shrink: 0;
    display: flex;
    align-items: center;

    .img-wrap {
      margin: 0% auto;
      width: 52px;
      border: 1px solid rgb(66, 66, 66);
      height: 52px;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        min-height: 100%;
        object-fit: cover;
      }
    }
  }

  .chatitem_info_container {
    text-align: left;
    max-width: 100%;
    overflow: hidden;
  }

  .time {
    position: absolute;
    right: 12px;
    top: 18px;
    font-size: 0.85rem;
    color: rgb(78, 78, 78);
  }
  
}

.dark .cht-i .name {
  color: $text-main-l;
}


.active {
  @extend .cht-i;
  background-color: rgb(96, 173, 255);

  color: #ffff;

  .name {
    color: white;
  }

  &:hover {
    background-color: rgb(96, 173, 255);
    .time {
      color:#ffff;
    }
  }
  .time {
    color:#ffff;
  }

  .chatitem_info_container {
    .last {
      color:#ffff;
    }
  }
}

@media (max-width: 600px) {
  .active {
    background-color: rgba(255, 255, 255, 0);
    border-radius: 0px;

    .time {
      color: rgb(78, 78, 78);
    }
  }
}
</style>
