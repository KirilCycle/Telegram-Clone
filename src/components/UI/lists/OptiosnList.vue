<template>
  <div class="more-content">
    <ul class="more_list">
      <li @click="op.execute" :key="op.description" v-for="op in optionsList">
        <div v-html="op.htmlIcoEl"></div>
        <p>{{op.description}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
    props: {
        optionsList: Array 
    } 
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";
.more-content {
  width: 180px;
  height: max-content;
  position: absolute;
  z-index: 55;
  right: 15px;
  background-color: $transition-colors;
  top: 45px;
  backdrop-filter: blur(3px);
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  padding: 7px 2px 7px 2px;
  li {
    list-style: none;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 5px;
    justify-content: space-around;
    font-size: 1rem;
    height: 30px;
  }
  li :hover {
    background-color: $hover;
    color: $text-main;
  }
}

.dark .more-content {
  background-color: $transition-colors-l;
}
</style>
