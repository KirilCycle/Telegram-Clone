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
  computed: {
    time() {
      if (this.lastMessageTimeStmp) {
        const timestamp = new Date(
          this.lastMessageTimeStmp.seconds * 1000 +
            this.lastMessageTimeStmp.nanoseconds / 1000000
        );
        const hours = timestamp.getHours();
        const minutes = timestamp.getMinutes();

        // Add leading zeros to the hours and minutes if they are single digits
        const formattedHours = hours.toString().padStart(2, "0");
        const formattedMinutes = minutes.toString().padStart(2, "0");

        return `${formattedHours}:${formattedMinutes}`;
      }

      return "";
    },
  },
  props: {
    pthUrl: String,
    id: String,
    lastMessageTimeStmp: Object,
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
  height: 72px;
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
    margin-left: 9px;
    margin-right: 9px;
    height: 100%;
    flex-shrink: 0;
    display: flex;
    align-items: center;


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
    font-size: 0.75rem;
    color: rgb(146, 146, 146);
  }
}


    .img-wrap {
      margin: 0% auto;
      width: 54px;
      border: 1px solid rgb(66, 66, 66);
      height: 54px;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        min-height: 100%;
        object-fit: cover;
      }
    }


.dark .cht-i .name {
  color: $text-main-l;
}

.active {
  @extend .cht-i;
  background-color: $main;

  color: #ffff;

  .name {
    color: white;
  }

  &:hover {
    background-color: $main;
    .time {
      color: #ffff;
    }
  }

 

  .time {
    color: #ffff;
  }

  .chatitem_info_container {
    .last {
      color: #ffff;
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




.dark  {
 
  &:hover {
    background-color: rgb(96, 173, 255);
    .time {
      color: rgb(78, 78, 78);
    }
  }
}


  .dark 
    .img-wrap {
      border: none;
    }
  
</style>
