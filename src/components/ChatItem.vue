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
      color: white;
    }
  }
  flex-direction: row;
  align-items: center;

  h3 {
    color: white;
  }

  p {
    color: gray;
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
    max-width: 100%;

    overflow: hidden;

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
  background-color: rgb(96, 173, 255);
 
  color: #ffffff;

  &:hover {
    background-color: rgb(96, 173, 255);
  }
  .time { 
    color: white
  }

  .chatitem_info_container {
    p { color: white}
  }

 

}

@media (max-width: 600px) {
  .active {
    background-color: none;
    border-radius: 0px;

  }
}
</style>
