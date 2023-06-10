<template>
  <div class="more-content">
    <ul class="more_list">
      <li @click="op.execute" :key="op.description" v-for="op in optionsList">
        <div v-html="op.htmlIcoEl"></div>
        <p class="action-name">{{ op.description }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    optionsList: Array,
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";
.more-content {
  width: 100%;
  height: max-content;
  position: absolute;
  z-index: 55;
  background-color: rgba(36, 36, 36, 0.916);
  backdrop-filter: blur(3px);
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  padding: 5px 5px 5px 5px;
  box-sizing: border-box;
  li {
    list-style: none;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 17px;
    cursor: pointer;
    color: #ffffff;
    border-radius: 5px;
    font-size: 1rem;
    height: 25px;
    transition: transform 0.4s ease;
    &:hover {
      background-color: #c4c4c419;
      color: #e4e4e4;
    }

    &:active {
      transform: scale(0.95);
    }

    .action-name {
      margin-left: 10px;
    }
  }
}

.dark .more-content {
  li {
    &:hover {
      background-color: #0b0b0b0f;
      color: #424242;
    }
  }
}

.dark .more-content {
  background-color: $transition-colors-l;
}
</style>
