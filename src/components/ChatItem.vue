<template>
  <div class="cht-i" :class="{ 'active': id  === $store.state.chat.chatId,  }">
    <div class="img-conatiner">
      <div class="img-wrap">
        <img
          :src="pthUrl"
        />
      </div>
    </div>
    <div class="chatitem_info_container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import store from '@/store/store';
export default {
  data() {
    return {
        pthUrl: this.pthUrl,
        id: this.id,
        active: this.id  === store.state.chat.chatId
    }
  },
  props: {
    pthUrl: String,
    id: String,
    required: true,
  },
};
</script>

<style lang="scss" scoped>

.cht-i {
  
  cursor: pointer;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
  width: 100%;
  height: 72px;
  overflow: hidden;
 
  display: flex;
  &:hover{
    background-color: #ffffff3b;
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

}

.active {
 
  @extend .cht-i ;
  
  
  background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
  
  
}

@media (max-width: 600px) {
  .active {
 
    
    
    
    background-image: none
    
    
  }
}

</style>
