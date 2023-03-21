<template>
    <div class="container">
        <button @click="visible = !visible">Show alert</button>
       
        <Teleport to="body">
            <div v-if="visible" class="modal">
                Modal
              <slot></slot>
            </div>
        </Teleport>
       
    </div>
</template>

<script>
    export default {
        data() {
            return {
                visible: false
            }
        },
    }
</script>

<style lang="scss" scoped>

.container {
    border-color: blue;
    width: 30%;
    height: 30%;
}

.modal {
    position: fixed;
    z-index: 999;
    width: 100%;
    height: 100%;
    background-color: green;
}
</style>