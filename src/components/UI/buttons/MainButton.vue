<template>
    <button class="button">
       <slot></slot>
    </button>
</template>

<script>
    export default {
        name: 'main-button'
    }
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss'; 
.button {
    border-radius: 15px;
    box-sizing: border-box;
    background-color: $second;
    font-size: 1.2rem;
    color: #fff;
    cursor: pointer;
}

.button:hover {
    background-color: $main;
}
</style>