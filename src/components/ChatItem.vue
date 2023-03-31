<template>
  <div class="cht-i" :class="{ active: isActive, 'text-danger': hasError }">
    <div class="img-conatiner">
      <div class="img-wrap">
        <img
          :src="pthUrl"
        />
      </div>
    </div>
    <div class="chatitem_info_container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        pthUrl: this.pthUrl
    }
  },
  props: {
    pthUrl: String,
    required: true,
  },
};
</script>

<style lang="scss" scoped>
.cht-i {
  width: 100%;
  height: 70px;
  overflow: hidden;
  display: flex;
  &:hover{
    background-color: #ffffff3b;
  }
  flex-direction: row;
  align-items: center;

  .img-conatiner {
    padding-left: 5px;
    padding-right: 5px;
    height: 100%;
    flex-shrink: 0;
    display: flex;
    align-items: center;

    .img-wrap {
      margin: 0% auto;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        min-height: 100%;
        object-fit: cover;
      }
    }
  }
  .chatitem_info_container {
  
    text-align: left;
  }

}

 
</style>
