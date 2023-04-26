<template>
    <div class="skelets">
        <div class="fake-msg" v-for="i in number" :key="i"></div>
    </div>
</template>

<script>
    export default {
        props: {
            number: Number 
        },
        data() {
            return {
              number: this.number      
            }
        },
    }
</script>

<style lang="scss" scoped>
.fake-msg {
    width: 400px;
    height: 70px;
    border-radius: 20px;
    background-color: #1b345d;
}
</style>