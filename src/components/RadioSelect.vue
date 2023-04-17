<template>
  <div class="select-radios-wrp">
    <h2>{{ header }}</h2>
    <div class="btns-container">
      <label>
        <input @click="setLightTheme" type="radio" :value="false" name="light" />
    </label>
    <label>
        <input @click="setDarkTheme" type="radio"   :value="true" name="dark" />
    </label>
    </div>
  </div>
</template>

<script>
import { useDark } from "@vueuse/core";
export default {
  props: {
    header: String,
  },
  data() {
    return {
      header: this.header,
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
@import '@/styles/colors';
.select-radios-wrp {
  width: 100%;
  height: 60px;
  border-radius: 5px;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  background: $content-main ;
}
</style>
