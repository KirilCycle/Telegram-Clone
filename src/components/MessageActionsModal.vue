<template>
  <Teleport to="body">
    <div @click.prevent="$emit('closed',)" @touchmove.prevent="null" class="conatiner" v-if="visible">
      <div class="modal">
        <ul>
          <li>Delete</li>
          <li>Reply</li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  props: {
    messageid: String,
    visible: Boolean,
    required: true,
  },
  data() {
    return {
      capture: "",
      v: false,
      filePreview: null,
      photo: null,
    };
  },
};
</script>

<style lang="scss" scoped>
.conatiner {
  position: fixed;
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  z-index: 100;
  background-color: #00000087;

  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #232323d2;
    min-width: 230px;
    min-height: 310px;
    backdrop-filter: blur(7px);
    border-radius: 5px;
  }
}
</style>
