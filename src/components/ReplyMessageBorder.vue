<template>
  <div class="rep-container">
    <div @click="scrllToTarget" class="target-info">
 
      <span class="material-symbols-outlined"> reply </span>
 
      <div v-if="$store.state.message.replyTarget.img" >
         <small-chat-image :src="$store.state.message.replyTarget.img"></small-chat-image>
      </div>
      <div class="text-container">
        <h3>{{$store.state.message.replyTarget.from}}</h3>
        <p>{{$store.state.message.replyTarget.text.slice(0,29)}}</p>
      </div>
    </div>
    <span class="material-symbols-outlined" @click="reset"> close </span>
  </div>
</template>

<script>
import store from '@/store/store';
import SmallChatImage from './SmallChatImage.vue';
export default {
  components: { SmallChatImage },
  data() {
    
  },
  methods: {
    reset() {
        store.commit('message/setReplyMsgRef', null)
        store.commit('message/setReplyTarget',null)
    },
    scrllToTarget() {
         store.state.message.replyMsgRef .scrollIntoView({block: "center", behavior: "smooth"})  
    }
  },
  props: {
    ref: Object,
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/colors';
.rep-container {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
   
   
  cursor: pointer;
  padding: 0px 10px 0px 1px;
  right: 0%;
  position: absolute;
  box-sizing: border-box;
  height: 100%;  
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  

  span {
    width: 35px;
    height: 35px;
    overflow: hidden;
    flex-shrink: 0;
    cursor: pointer;
    color: $second;
  }
  .target-info {
    display: flex;
    justify-content: start;
    flex-direction: row;
    max-width: 100%;
    align-items: start;

    .text-container {
      text-align: left;
      display: flex;
      flex-direction: column;
      margin-left: 5px;

      h3 {
        font-weight: 550;
        font-size: 1rem;

        color: $second;
      }
      p {
        font-weight: 500;
        font-size: 0.8rem;
        color: $text-main;
      }
    }
  }
}


.dark .rep-container {
  background-color: $content-main-l;
  .text-container {
    p {
      color: $text-main-l;
    }
   }
}
</style>
