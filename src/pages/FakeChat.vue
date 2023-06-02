<template>
  <div class="main">
    <div ref="leftbars" class="left-bar">
      <div class="LEFTBAR-SUS"></div>
    </div>
    <div
      @click.stop="() => shoveRightSide(true)"
      ref="rightsides"
      class="right-side"
    >
      <div @click.stop="() => shoveRightSide(false)" class="test-block"></div>
    </div>
    <div class="save"></div>
  </div>
</template>

<script>
import { uuidv4 } from "@firebase/util";
import GroupMessageItemVue from "@/components/chat/GroupMessageItem.vue";
import { onMounted, ref } from "vue";
export default {
  components: {
    GroupMessageItemVue,
  },
  data() {
    return {};
  },
  setup() {
    const rightside = ref(null);
    const leftbar = ref(null);
    onMounted(() => {
      rightside.value = document.querySelector(".right-side");
      leftbar.value = document.querySelector(".left-bar");
      shoveRightSide(true);
    });

    function shoveRightSide(isBack) {
      if (window.innerWidth < 899) {
        const leftBarWdth = leftbar.value.offsetWidth;

        if (isBack) {
          // this.$refs.settings.style.transform = `translateX(${pos})`;
          console.log(leftBarWdth, rightside.value);
          rightside.value.style.transform = `translateX(${leftBarWdth}px)`;
          return;
        }
        rightside.value.style.transform = `translateX(${0}px)`;
      }
    }

    return {
      rightside,
      leftbar,
      shoveRightSide,
    };
  },
};
</script>

<style lang="scss" scoped>
.main {
  height: 100vh;
  max-height: 100%;
  min-height: 100%;
  overflow: hidden;
  display: flex;
  position: relative;
  width: 100%;
}

.LEFTBAR-SUS {
  width: 70px;
  height: 70px;
  background-color: #8a8a8a;
}

.left-bar {
    display: flex;
    left: 0;
    max-width: none;
    position: fixed;
    background-color: rebeccapurple;
    top: 0;
    flex-shrink: 0;
    width: 300px;
   
}

.right-side {
  width: 100vw;
  box-sizing: border-box;
  border: 1px solid red;
  height: 100%;
  padding: 30px;
  position: fixed;
  background-color: rgb(30, 30, 30);
  transition: transform 0.4s ease-in-out;
}

.test-block {
  width: 70%;
  height: 300px;
  background-color: green;
}

@media (max-width: 900px) {
  .right-side {
    flex-shrink: 0;
    position: absolute;
  }
}

@media (min-width: 900px) {
  .right-side {
    transform: translateX(0px) !important;
      position: relative;
  }

  .left-bar {
    position: relative;
  }
}
</style>
