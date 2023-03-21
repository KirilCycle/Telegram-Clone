<template>
  <div>
    <h2>{{ mutadedValue }}</h2>
    <button @click="selectedSort = !selectedSort ">set sort</button>
    <input
      @input="(e) => $emit('chaged', e.target.value)"
      v-model="value"
      placeholder="enter data"
    />
    <h2>Input test</h2>
    <input @input="(e) => post.title = e.target.value" laceholder="title"  />
    <input @input="(e) => post.body = e.target.value" placeholder="body" />
   </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      mutadedValue: "",
      selectedSort: false,
      post: {
        title: '',
        body: ''
      }
    };
  },
  computed: {
    mutadedValue() {
      console.log("mut");
      return this.value.toLocaleLowerCase().replaceAll("a", "%");
    },
  },
  watch: {
    post: {
     handler(newV,oldV) {
       console.log(oldV) 
     },
     deep: true,
     immediate: true
    },
  },
};
</script>

<style lang="scss" scoped></style>
