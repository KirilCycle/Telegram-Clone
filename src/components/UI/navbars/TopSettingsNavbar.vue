<template>
  <nav class="settings-nav">
    <slot name="close-btn" @click="() => this.$emit('sclose')"></slot>

    <div class="settings-title-wrap">
       <h1 class="settings-title">{{title}}</h1>
    </div>   

    <div class="settings_nav_right_side">
      <div class="action-wrap">
        <slot name="action1"></slot>
      </div>
      <div class="action-wrap">
        <slot name="action2"></slot>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
    props: {
        title: String
    }
};
</script>
<style lang="scss" scoped>
@import "@/styles/colors";

.settings-nav {
  width: 100%;
  background-color: $content-main;
  height: 8%;
  max-height: 60px;
  position: fixed;
  box-sizing: border-box;
  top: 0px;
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 5px;
  padding-right: 5px;

  .settings_nav_right_side {
    width: auto;
    display: flex;
    justify-content: space-between;

    .action-wrap + .action-wrap {
      margin-left: 5px;
    }
  }
}

.dark .settings-nav {
  background-color: $content-main-l;
}

.settings-title-wrap {
    text-align: left;
    width: 100%;
    padding-left: 10px;
}

.settings-title {
  color: $text-main;
  font-size: 1.25rem;
  font-weight: 550;
  margin: 0% auto;
}

.dark .settings-title {
  color: $text-main-l;
}
</style>
