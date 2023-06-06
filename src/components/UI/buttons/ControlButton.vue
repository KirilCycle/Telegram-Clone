<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "control-button",
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
  overflow: hidden;
  align-items: center;
  width: 40px;
  flex-shrink: 0;
  height: 40px;
  border-radius: 20px;
}
.dark .btn:hover {
  background-color: rgba(0, 0, 0, 0.039);
}

.btn:hover {
  background-color: rgba(255, 255, 255, 0.108);
}

.btn:active {
  background-color: rgba(223, 223, 223, 0.547);
}

.btn + .btn {
  margin-left: 5px;
}
</style>
