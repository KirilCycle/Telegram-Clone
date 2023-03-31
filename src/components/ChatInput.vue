<template>
    <div class="input-container">
       <span>{{$store.state.chat.selectedUser?.new}}</span>
       <input v-model="value" placeholder="enter message">
      <button @click="send">
        enter
      </button>
    </div>
</template>

<script>
import store from '@/store/store';
    export default {
        props: {
            target: Boolean,
            sendMsg: Function,
            senFirstMsg: Function,
            required: true
        },
        
        data () {
            return {
               value: '',
               sendMsg: this.sendMsg,
               sendFisrtMsg: this.senFirstMsg,
               target: this.target
            }
        },
        methods: {
            send() {
                store.state.chat.selectedUser?.new?  console.log('t')   :  console.log('d')
                store.state.chat.selectedUser?.new?this.sendFisrtMsg(this.value):this.sendMsg(this.value)
            }
        },
    }
</script>

<style lang="scss" scoped>
.input-container {
    width: 100%;
    height: 60px;
    position: fixed;
    bottom: 0px;

    background-color: #292929;
}

</style>