<template>
  <div class="main">
    <div ref="leftbars" class="left-bar"></div>
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
  width: 100%;
  display: flex;
  overflow-x: hidden;
}
.left-bar {
  width: 350px;
  flex-shrink: 0;
  height: 100vh;
  background-color: #616161;
}
.right-side {
  width: 70%;
  height: 100vh;
  padding: 30px;
  background-color: rgb(30, 30, 30);
  transition: transform 0.4s ease-in-out;

  .test-block {
    width: 70%;
    height: 300px;
    background-color: green;
  }
}
@media (max-width: 900px) {
  .right-side {
    width: 100%;
    flex-shrink: 0;
    position: absolute;
  }
}

@media (min-width: 900px) {
  .right-side {transform: translateX(0px)!important}


}
</style>
