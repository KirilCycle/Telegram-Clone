<template>
    <div class="edit-wrap">

    </div>
</template>

<script>
    export default {
        props: {
            v: Boolean
        },
        data() {
          
            return {
                v: this.v
            }
          
        }
    }
</script>

<style lang="scss" scoped>
.edit-wrap {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: absolute;
    z-index: 120;
}
</style>