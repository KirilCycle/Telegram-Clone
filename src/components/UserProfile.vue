<template>     
        <Transition>
            <div :class="'user-profile'">  
                <div>
                   <img :src=" $store.state.chat?.selectedUser?.photoURL">
                </div>
            </div>
        </Transition>
</template>

<script>
import store from '@/store/store';
    export default {
        data() {
            return {
                v:false
            }
        }
    }
</script>

<style lang="scss" scoped>

.user-profile {
    position: absolute;
    z-index: 150;
    min-width: 320px;
    right: 0px;
    height: 100vh; /* Fallback for browsers that do not support Custom Properties */
    height: calc(var(--vh, 1vh) * 100);
    background-color: #000000;
}

</style>