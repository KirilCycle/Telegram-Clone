<template>
  <div class="message-delete-action-wrap">
    <p class="actions-header">{{ header }}</p>
    <p class="description">{{ description }}</p>
    <div class="actions-wrp">
      <div class="actions-content">
        <button class="action" @click="action1.executeFn">
          {{ action1.title }}
        </button>
        <button class="action" @click="action2.executeFn">
          {{ action2.title }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    header: String,
    description: String,
    action1: Object,
    action2: Object,
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.message-delete-action-wrap {
  width: 320px;
  background-color: $content-main-dark;
  height: max-content;
  padding: 10px 15px 10px 15px;
  border-radius: 10px;
  text-align: left;
  color: #ffff;
}

.actions-header {
  font-size: 1.29rem;
  font-weight: 600;
}

.description {
  font-size: 1rem;
  margin-top: 5px;
}

.actions-wrp {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 60px;
  width: 100%;
  position: relative;
  color: $second;
}

.actions-content {
  width: max-content;
  position: absolute;
  right: 0px;
}

.action {
  cursor: pointer;
  padding: 10px 20px 10px 20px;
  border-radius: 5px;
  font-size: 1.2rem;
  font-weight: 0;
  transition: background-color 0.1s ease-in;
  &:hover {
    background-color: $hover;
  }
}

.action + .action {
  margin-left: 5px;
}

.dark .message-delete-action-wrap {
  background-color: $content-main-dark-l;
  color: black;
}
</style>
