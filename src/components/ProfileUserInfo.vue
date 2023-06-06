<template>
  <ul class="user-info-container">
    <li>
      <div class="ico">
        <span class="material-symbols-outlined"> alternate_email </span>
      </div>
      <div class="user_info_container_text_wrap">
        <p class="info-text">{{ username }}</p>
        <p>Username</p>
      </div>
    </li>

    <li v-if="bio">
      <div class="ico">
        <span class="material-symbols-outlined"> info </span>
      </div>

      <div class="user_info_container_text_wrap">
        <p class="info-text">{{ bio }}</p>
        <p>Bio</p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    username: String,
    bio: String,
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";
.user-info-container {
  height: auto;
  padding: 15px 5px 15px 5px;
  background-color: $content-main;
  width: 100%;
  box-sizing: border-box;

  %item-patt {
    width: 100%;
    height: 60px;
    border-radius: 5px;
    border-radius: 10px;
    display: flex;
    flex-direction: row;

    span {
      font-size: 1.8rem;
    }
  }
  .ico {
    width: 50px;
    height: 60px;
    display: flex;
    justify-content: center;
    overflow: hidden;
    align-items: center;
    font-size: 2rem;
    font-weight: 600;
    color: #808080;
  }

  .user_info_container_text_wrap {
    width: 80%;
    height: 100%;
    margin-top: 10px;
    text-align: left;

    .info-text {
      color: $text-main;
      font-size: 0.9rem;
    }

    p {
      color: #808080;
      font-size: 0.8rem;
    }
  }
  li {
    @extend %item-patt;
  }
  li {
    @extend %item-patt;
  }
}


.dark .user-info-container  {
  background-color: $content-main-l;
  box-shadow: 0px 7px 29px 0px rgba(100, 100, 111, 0.2);

  .user_info_container_text_wrap {

    .info-text  {
      color: $text-main-l;
    }
  }
}
</style>
