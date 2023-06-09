<template>
  <div class="user-image-wrp">
    <user-image>
      <div class="profile-img-wrap">
        <slot name="img"></slot>
      </div>
      <div class="profile_img_wrap_text_wrp">
        <h2 class="fisrt-name">
          <slot name="firstxt"></slot>
        </h2>
        <h3 class="email">
          <slot name="secondtxt"></slot>
        </h3>
      </div>
    </user-image>
  </div>
</template>

<script>
import UserImage from "./UserImage.vue";

export default {
  components: { UserImage },
};
</script>

<style lang="scss" scoped>
.user-image-wrp {
  position: relative;
  width: 100%;
  top: 8%;

  @media screen and(min-width: 1400px) {
    top: 60px;
  }
}


.profile-img-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #222222;
  display: flex;
  height: inherit;
  min-height: 100%;
  min-width: 100%;
  position: relative;
  width: inherit;

  

}

.profile_img_wrap_text_wrp {
  .fisrt-name {
    z-index: 12;
    font-size: 1.2rem;
    font-weight: 700;
    color: #ffffff;
    position: absolute;
    bottom: 23px;
    left: 20px;
  }
  .email {
    color: #c8c8c8;
    position: absolute;
    bottom: 3px;
    left: 20px;
    font-size: 1rem;
    z-index: 10;
  }
}



.profile-user-info-wrp {
  position: relative;
  top: 8%;
  width: 100%;
}
</style>
UserImage
