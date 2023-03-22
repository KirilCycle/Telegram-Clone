<template>
  <div class="item">
    <p>{{ message.text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    message: Object,
    isMy: Boolean,
    required: true,
  },
  setup(props) {},
};
</script>

<style lang="scss" scoped>
.item {
  width: 70%;
  padding: 10px;
  color: white;
  background: rgb(35, 35, 35);
  display: flex;
  margin-bottom: 15px;
  flex-wrap: wrap;
  position: relative;
  right: 0px;
  margin-left: 10px;
  border-radius: 5px;

  .time {
    font-size: 0.6rem;
    color: gray;
  }
}

.my_item {
   
        width: 70%;
        padding: 10px;
        color: rgb(255, 255, 255);
        background: rgb(28, 243, 67);
        margin-top: 15px;
        margin: 15px;
        display: flex;
        flex-wrap: wrap;
        position: relative;
        right: 0px;
        border-radius: 5px;
      
        .time {
          font-size: 0.6rem;
          color: gray;
        }
      
}

</style>
