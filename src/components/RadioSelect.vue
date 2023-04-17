<template>
  <div class="select-radios-wrp">
    <h2>{{ header }}</h2>

    <div class="btns-container">
      <label class="container">
        <input
          class="radio-button"
          @click="setLightTheme"
          type="radio"
          v-model="selectedOption"
          value="dark"
          name="light"
        />
        <span>
        </span>
      </label>
      <label class="container">
        <input
          class="radio-button"
          @click="setDarkTheme"
          type="radio"
          v-model="selectedOption"
          value="light"
          name="dark"
        />
        <span>
        </span>
      </label>
    </div>
  </div>
</template>

<script>
import { useDark } from "@vueuse/core";
export default {
  props: {
    header: String,
    executeFn1: Function,
    executeFn2: Function,
    required: true,
  },
  data() {
    return {
      header: this.header,
      selectedOption: "light",
    };
  },
  setup() {
    const isDark = useDark();

    function setLightTheme() {
      isDark.value = false;
      const root = document.querySelector("#app");
      root.classList.remove("dark-theme");
    }

    function setDarkTheme() {
      isDark.value = true;
      const root = document.querySelector("#app");
      root.classList.add("dark-theme");
    }

    return {
      isDark,
      setLightTheme,
      setDarkTheme,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";
.select-radios-wrp {
  width: 100%;
  height: auto;
  padding: 10px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  background: $content-main;

  h2 {
    color: $text-main;
  }

  .btns-container {
    width: 200px;
    padding: 10px 0px 10px 0px;
    display: flex;
    flex-direction: column;
    background-color: #dc2a2a;
    z-index: 10;
    height: 60px;

    .container {
      position: relative;

      input[type="radio"] {
        display: none;
      }

      span {
        height: 20px;
        width: 20px;
        border-radius: 10px;
        border: 3px solid rgba(0, 128, 0, 0.671);
        position: absolute;
        z-index: 10;
        left: 0px;
        top: 0px;
     
        
      }
      
    }
    
    
    .container + .container {
      margin-top: 30px;
    }
  
    .container span:after {
        
        content: "";
        visibility:visible;
        background-color: #2348ff;
        position: absolute;
        z-index: 1111;
        top: 50%;
        display: block;
        left: 50%;
        height: 8px;
        width: 8px;
        transform: translate(-50%, -50%) scale(1);
        border-radius: 50%;
        transition: 300ms ease-in-out;
  
      
    } 
  
  }


}
</style>
