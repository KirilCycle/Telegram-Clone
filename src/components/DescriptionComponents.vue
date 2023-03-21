<template>
    <div>
        <h3>Header{{uniqID}}</h3>
       <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            uniqID: String,
            required: true
        }
    }
</script>

<style lang="scss" scoped>

</style>