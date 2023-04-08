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

  .name {

    color: white;
  } 

   .last {
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

   
    h3 {
      font-size: 1.1rem;
      font-weight: 550;
       
    }
    p {
      font-size: 0.95rem;
      white-space: nowrap;
      font-weight: 550;
       
    }


  }

  .time {
    position: absolute;
    right: 12px;
    top: 18px;
    font-size: 0.85rem;
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
    .last { color: white}
  }

 

}

@media (max-width: 600px) {
  .active {
    background-color:rgba(255, 255, 255, 0);
    border-radius: 0px;
   
      .time { 
        color: rgb(78, 78, 78);
      }
  
      
         
      
    }

  
}
</style>
