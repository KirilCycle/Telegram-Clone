<template>

    <img class="profile-image" alt="sus" :src="source">

</template>

<script>
    export default {
        props: {
            source: String
        }
    }
</script>

<style lang="scss" scoped>
.profile-image {
     height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    pointer-events: none;
    width: 100%;
    object-position: top;
}


</style>