<template>
  <input :value="modelValue" @input="updateInput" class="input" type="text" />
</template>

<script>
export default {
  name: "main-input",
  props: {
    modelValue: [String, Number],
  },
  methods: {
    updateInput(event) {
      this.$emit("update:modelValue", event.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";


.input {
  padding: 0px 0px 0px 5px;
  width: 100%;
  height: 50px;
  border-radius: 15px;
  box-sizing: border-box;
  border: 1px solid rgb(81, 81, 81);
  font-size: 1rem;
  color: $text-main;
  &:focus {
    border: 1px solid $input-main-color;
    box-shadow: rgb(34, 137, 255) 0px 0px 0px 1px;
  }
  &:hover {
    border: 1px solid $input-main-color;
  }
}

.dark .input {
  color: $text-main-l;
}
</style>
