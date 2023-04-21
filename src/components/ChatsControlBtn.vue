<template>
  <button class="control">
    <span class="material-symbols-outlined"> edit </span>
  </button>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.control {
  cursor: pointer;
  width: 55px;
  height: 55px;
  border-radius: 27.5px;
  display: flex;
  margin: 0% auto;
  justify-content: center;
  align-items: center;
  background-color: $second;
 
 

  &:hover {
    background-color: $main;
  }

  span {
    color: white;
    font-size: 1.8rem;
  }
}
</style>
