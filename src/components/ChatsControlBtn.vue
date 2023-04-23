<template>
  <button @click="v = !v" class="control">
    <ul v-if="v" class="chat-controll-actions-list">
      <li>
          <span v-show="v" class="material-symbols-outlined"> chat </span>
          <p>New Chat</p>
        </li>
        <li>
          <span v-show="v" class="material-symbols-outlined"> group </span>
        <p>New Group</p>
      </li>
    </ul>
    <span v-show="!v" class="material-symbols-outlined"> edit </span>
    <span v-show="v" class="material-symbols-outlined"> close </span>
  </button>
</template>

<script>
export default {
  data() {
    return {
      v: false,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.control {
  cursor: pointer;
  width: 55px;
  height: 55px;
  border-radius: 27.5px;
  display: flex;
  margin: 0% auto;
  justify-content: center;
  align-items: center;
  background-color: $second;

  &:hover {
    background-color: $main;
  }

  .chat-controll-actions-list {
    width: 200px;
    padding: 9px 2px 9px 2px;
    position: absolute;
    border-radius: 10px;
    bottom: 60px;
    right: 0px;
    background-color: $content-main-dark;
    list-style: none;

    li {
      font-size: 0.9rem;
      text-align: left;
      display: flex;
      flex-direction: row;
      padding: 9px 0px 9px 9px;
      color: $text-main;
      &:hover {
        background-color: $hover;
      }

      p {
        margin-left: 3px;
      }

      span {
        font-size: 0.9rem;
      }
    }
  }

  span {
    color: white;
    font-size: 1.8rem;
  }
}
</style>
