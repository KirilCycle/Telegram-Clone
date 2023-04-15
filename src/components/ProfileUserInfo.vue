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
  data() {
    return {
      username: this.username,
      bio: this.bio,
    };
  },
  
};
</script>

<style lang="scss" scoped>
$custom-c4: rgb(31, 31, 31);
.user-info-container {
  height: auto;
  padding: 15px 10px 15px 10px;
  background-color: $custom-c4;
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
    align-items: center;
    font-size: 2rem;
    font-weight: 600;
    color: #808080;
  }

  .user_info_container_text_wrap {
    width: 80%;
    height: 100%;
    margin-top: 10px;

    .info-text {
      color: #ffffff;
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
</style>
