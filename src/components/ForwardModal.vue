<template>
  <div class="forward">
    <div class="forward_modal">
      <div class="forward_modal_top_content">
        <button>
          <span class="material-symbols-outlined"> close </span>
        </button>

        <input v-model="q" placeholder="Forward to..."  />
      </div>
      <div class="forward_modal_list"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      v: "",
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.forward {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.354);
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;

  .forward_modal {
    width: 420px;
    height: 80%;
    max-height: 900px;
    background-color: $content-main;
    border-radius: 20px;
    position: relative;

    .forward_modal_top_content {
      width: 100%;
      height: 60px;
      position: absolute;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 10px;
      top: 0px;

      button {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:hover {
          background-color: $hover;
        }

        span {
          font-size: 1.6rem;
          color: gray;
        }
      }

      input {
        caret-color: $second;
        font-size: 1.2rem;
        height: 40px;
      }
    }
  }
}

.dark .forward {
  .forward_modal {
    background-color: $content-main-l;
  }
}
</style>
