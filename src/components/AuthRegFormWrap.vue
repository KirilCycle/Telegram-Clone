<template>
  <form class="form">
    <slot></slot>
  </form>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.form {
  width: 380px;
  height: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
@media (max-width: 550px) {
  .form {
    width: 280px;
  }
}
</style>
