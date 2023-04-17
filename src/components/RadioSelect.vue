<template>
  <div class="select-radios-wrp">
    <h3>{{ header }}</h3>

    <div class="btns-container">
     
      
      <label v-for="it in btnsArray" :key="it.name" class="container">
        <input
          class="radio-button"
          @click="it.execute"
          type="radio"
          v-model="selected"
          :value="it.value"
          :name="it.name"
        />
       {{ it.title}}
        <span>
        </span>
      </label>


     
      <!-- <label class="container">
        <input
          class="radio-button"
          @click="setDarkTheme"
          type="radio"
          v-model="selected"
          value="light"
          name="light"
        />
        Light
        <span>
        </span>
      </label> -->
     
    </div>
  </div>
</template>

<script>
import { useDark } from "@vueuse/core";
export default {
  props: {
    header: String,
    btnsRadioList: Array,
    selected: String,
    required: true,
  },
  data() {
    return {
      header: this.header,
      selected: this.selected,
      btnsArray: this.btnsRadioList,
   


    };
  },

 
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";
.select-radios-wrp {
  width: 100%;
  height: auto;
  padding: 10px 10px 0px 20px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  background: $content-main;

  h3 {
    color: gray;
    font-weight: normal;
    font-size: 1.1rem;

  }

  .btns-container {
    width: 140px;
    padding: 20px 0px 35px 0px;
    display: flex;
    flex-direction: column;
    z-index: 10;
    height: max-content;
        
    color: $text-main;
    font-weight: normal;
    font-size: 1.1rem;
    text-align: right;
   

    .container {
      position: relative;

      input[type="radio"] {
        display: none;
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

      }
      
    }
    
    
    .container + .container {
      margin-top: 39px;
    }
  
    .container span:after {
        
        content: "";
        visibility:visible;
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

  .container input[type="radio"]:checked ~ span::after{
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
    color: $text-main-l
  }
  
}

</style>
