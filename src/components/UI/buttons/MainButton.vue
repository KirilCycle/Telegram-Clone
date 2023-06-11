<template>
  <button class="button">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "main-button",
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.button {
  box-sizing: border-box;
  background-color: $main;
  flex-shrink: 0;
  color: #fff;
  overflow: hidden;
  cursor: pointer;
}

.button:hover {
  background-color: $main-hover;
}
</style>
