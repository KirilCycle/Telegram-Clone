<template>
    <Teleport  to="body">
        
        <div class="msg-action-wrap">
            <div ref="modal" class="msg-actions">
                
            </div>
        </div>
  
    </Teleport>
</template>

<script>
import store from '@/store/store';
    export default {
    
        data() {
             return {

             }

        },
        

        mounted() {
            console.log(store.state.message.coords.x, store.state.message.coords.y, 'AAA')
            
            // this.$refs.modal.style.transform  = `translate(${store.state.message.coords.x}}px,${store.state.message.coords.y}px)`

            this.$refs.modal.style.transform = `translate(${ store.state.message.coords.x  }px, ${ store.state.message.coords.y}px)`
            // this.$refs.modal.style.transform = `translateY(${ -store.state.message.coords.y  }px)`
        }
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
    top:0%;
    width: 100px;
    height: 100px;
    background-color: #fff;
    position: absolute;

}

</style>