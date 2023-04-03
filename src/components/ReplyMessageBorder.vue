<template>
  <div class="rep-container">
    <div @click="scrllToTarget" class="target-info">
      <span class="material-symbols-outlined"> reply </span>
      <div class="text-container">
        <h3>{{$store.state.chat.from.slice(0,30)}}</h3>
        <p>{{$store.state.chat.text.slice(0,29)}}</p>
      </div>
    </div>
    <span class="material-symbols-outlined" @click="reset"> close </span>
  </div>
</template>

<script>
import store from '@/store/store';
export default {
  data() {
    
  },
  methods: {
    reset() {
        store.commit('chat/setReplyMsgRef', null)
        store.commit('chat/setFrom',null)
        store.commit('chat/setText', null)
    },
    scrllToTarget() {
         store.state.chat.replyMsgRef .scrollIntoView({block: "center", behavior: "smooth"})  
    }
  },
  props: {
    ref: Object,
  },
};
</script>

<style lang="scss" scoped>
$custom-c2: rgb(32, 32, 32);
.rep-container {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
    $crazy_color: #00ff44;
   
  cursor: pointer;
  padding: 0px 1px 0px 1px;
  right: 0%;
  position: absolute;
  box-sizing: border-box;
  background-color: $custom-c2;
  height: 50px;  
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  bottom: 50px;

  span {
    width: 35px;
    height: 35px;
    overflow: hidden;
    flex-shrink: 0;
    cursor: pointer;
    color: $crazy_color;
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

        color: $crazy_color;
      }
      p {
        font-weight: 500;
        font-size: 0.8rem;
        color: white;
      }
    }
  }
}
</style>
