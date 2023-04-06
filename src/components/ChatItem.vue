<template>
  <div class="cht-i" :class="{ active: id === $store.state.chat.chatId }">
    <div class="img-conatiner">
      <div class="img-wrap">
        <img :src="pthUrl" />
      </div>
    </div>
    <div class="chatitem_info_container">
      <slot></slot>
    </div>
    <p class="time">{{ time }}</p>
  </div>
</template>

<script>
import store from "@/store/store";
export default {
  data() {
    return {
      pthUrl: this.pthUrl,
      id: this.id,
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
.cht-i {
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
    background-color: #ffffff3b;
    .time {
      color: white;
    }
  }
  flex-direction: row;
  align-items: center;

  .img-conatiner {
    padding-left: 5px;
    padding-right: 5px;
    height: 100%;
    flex-shrink: 0;
    display: flex;
    align-items: center;

    .img-wrap {
      margin: 0% auto;
      width: 65px;
      height: 65px;
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
  }

  .time {
    position: absolute;
    right: 4px;
    top: 18px;
    color: rgb(78, 78, 78);
  }
}

.active {
  @extend .cht-i;

  background-image: linear-gradient(160deg, #0093e9 0%, #80d0c7 100%);
}

@media (max-width: 600px) {
  .active {
    background-image: none;
  }
}
</style>
