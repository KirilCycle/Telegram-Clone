<template>
    <div class="profile-conatainer">
        <img :src="profilePhotoUrl" />
      </div>
</template>

<script>
    export default {
        props: {
            profilePhotoUrl: String,
        }
    }
</script>

<style lang="scss" scoped>
.profile-conatainer {
    width: 35px;
    height: 35px;
    margin-top: 5px;
    border-radius: 50%;

    position: sticky;
    top: 60px;
    overflow: hidden;
    left: 5px;

    img {
      width: 100%;
      min-height: 100%;
      object-fit: cover;
    }
  }
</style>