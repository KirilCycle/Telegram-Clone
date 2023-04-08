<template>
    <Teleport v-if="$store.state.message.replyMsgRef"  to="body">
        
        <div  class="msg-action-wrap">
            <div class="msg-actions">
                
            </div>
        </div>
  
    </Teleport>
</template>

<script>
import store from '@/store/store';
    export default {
         
    }
</script>

<style lang="scss" scoped>
.msg-action-wrap {

    width: 100%;
    height: 100%;
    position: fixed;
    background-color: #464646a6;

}

.msg-actions {

    width: 100px;
    height: 100px;
    background-color: #fff;
    position: absolute;

}

</style>