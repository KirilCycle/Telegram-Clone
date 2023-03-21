<template>
  <div class="w">
    <button @click="c = c + 1">+</button>
    <h3>{{ c }}</h3>
    <button @click="c = c - 1">-</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      c: 0,
    };
  },
};
</script>

<style lang="scss" scoped>
.w {
  padding: 20px;
  display: flex;
  flex-direction: row;
}

button {
  padding: 10px;
  font-size: 2rem;
}

h3 {
  margin-left:10px;
  margin-right: 10px;
  font-size: 1.3rem;
}

</style>
