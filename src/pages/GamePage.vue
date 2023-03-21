<template>
  <div>
    <h2>{{value}}</h2>
    <button @click="setCurrent('CounterComponent')">count</button>
    <button @click="setCurrent('DescriptionComponents')">description</button>
    <button @click="setCurrent('InputComponent')">input</button>
    <input v-model="value" type="text">
    <div class="container">
    
       <test-component></test-component>
      <KeepAlive exclude="DescriptionComponents">
        <component @chaged="aa" :is="current"></component>
      </KeepAlive>
    
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import AlertModalt from "@/components/AlertModalt.vue";
import CounterComponent from "../components/CounterComponent.vue";
import DescriptionComponents from "../components/DescriptionComponents.vue";
import InputComponent from "../components/InputComponent.vue";
import TestComponent from "@/components/TestComponent.vue";


export default {
  
  components: {
    AlertModalt,
    CounterComponent,
    DescriptionComponents,
    InputComponent,
    TestComponent
    
  },
  data() {
    return {
      current: "CounterComponent",
      value: "def",
    };
  },

  methods: {
    setCurrent(type) {
      this.current = type;
    },
    aa(v) {
      console.log("EEE", v);
    },
  },
  setup(props) {},
};
</script>

<style lang="scss" scoped>
.container {
  width: 300px;
  height: 300px;
  margin: 0% auto;
}

.field {
  width: 500px;
  height: 500px;
  background-color: black;
  margin: 0% auto;
  display: flex;
  flex-wrap: wrap;
}
.item {
  width: 49px;
  height: 49px;
  background-color: red;
  border: 1px solid green;
}

button {
  margin: 5px;
}
</style>
