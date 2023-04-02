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
    flex-shrink: 0;
    height: 35px;
    margin-bottom: 0px ;
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