<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'control-button'
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";
$def-gray: #b2b2b2;


.btn {
  cursor: pointer;
  color: $def-gray;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 20px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.039);
  }
}

.btn + .btn {
  margin-left: 5px;
}
</style>
