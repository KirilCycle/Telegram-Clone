<template>
  <div class="select-radios-wrp">
    <h3 >{{ header }}</h3>

    <div class="btns-container">
      <label v-for="it in btnsArray" :key="it.name" class="container">
        <input
          class="radio-button"
          @click="it.execute"
          type="radio"
          v-model="selectedNow"
          :value="it.value"
          :name="it.name"
        />
        <span> </span>
        <p class="option-title">
          {{ it.title }}
        </p>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    header: String,
    btnsRadioList: Array,
    selected: String,
    required: true,
  },
  data() {
    return {
      selectedNow: this.selected,
      btnsArray: this.btnsRadioList,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";

.option-title {
  margin-left: 40%;
}

.select-radios-wrp {
  width: 100%;
  height: auto;
  padding: 10px 20px 0px 20px;
  margin-top: 10px;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  background: $content-main;
  text-align: left;

  h3 {
    color: gray;
    font-weight: normal;
    font-size: 1.1rem;
  }

  .btns-container {
    width: 100%;
    padding: 20px 0px 35px 0px;
    display: flex;
    flex-direction: column;
    z-index: 10;
    height: max-content;
    box-sizing: border-box;
    color: $text-main;
    font-weight: normal;
    font-size: 1.1rem;

    .container {
      position: relative;
      cursor: pointer;

      input[type="radio"] {
        display: none;
        cursor: pointer;
      }

      span {
        height: 18px;
        width: 18px;
        border-radius: 50%;
        border: 2px solid rgba(90, 90, 90, 0.996);
        position: absolute;
        z-index: 10;
        left: 0px;
        top: 0px;
        transition: 300ms ease-in-out;
        cursor: pointer;
      }
    }

    .container + .container {
      margin-top: 39px;
    }

    .container span:after {
      content: "";
      visibility: visible;
      background-color: $main;
      position: absolute;
      z-index: 11;
      top: 50%;
      display: block;
      left: 50%;
      height: 15px;
      width: 15px;
      transform: translate(-50%, -50%) scale(0);
      border-radius: 50%;
      transition: 300ms ease-in-out;
    }
  }

  .container input[type="radio"]:checked ~ span::after {
    transform: translate(-50%, -50%) scale(1);
  }

  .container input[type="radio"]:checked ~ span {
    border: 2px solid $main;
  }
}

.dark .select-radios-wrp {
  background: $content-main-l;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

  .btns-container {
    color: $text-main-l;
  }
}
</style>
