<template>
  <div class="chat-part">
    <div v-for="it in 30" :key="it" class="item"></div>
  </div>
</template>

<script>
import { watchEffect,watch,   } from 'vue';


export default {
  props: {
    chatId: String,
    start: String,
    nextstart: String,
    nextend: String,
    end:String,
  },
  data() {
    return {
      messages: 20,
    };
  },
 
  setup(pops, { emit }) {
    watchEffect(() => {
        if (pops.nextstart !== pops.start && pops.nextend !== pops.end ) {
                console.log(pops.start, pops.end, 'FETCH')
               
                //if nextstart 
                //fetch prev

                //if nextend
                //fetch next

              
                emit('msgsWasReceived')
        } else {
          console.log(  'same');
        }
    })
  } 

};
</script>

<style lang="scss" scoped>
.chat-part {
  width: 100%;
  height: auto;
  
  margin: 5px;
  background-color: #363636;

}

.item {
    width: 100px;
    height: 30px;
    margin: 10px;
    background-color: #c94cff;
}
</style>
