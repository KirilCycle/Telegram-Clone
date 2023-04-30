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
  position: absolute;
  padding: 20px;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  flex-direction: column;

  @media screen and(max-width: 700px) {
    transform: translate(0%, -0%);
    top: auto;
    left: auto;
  }
}
@media (max-width: 550px) {
  .form {
    width: 280px;
  }
}
</style>
