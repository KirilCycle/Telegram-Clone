<template>
  <div class="rep-container">
    <div class="target-info">
      <span class="material-symbols-outlined"> reply </span>
      <div class="text-container">
        <h3>Pavel Durov</h3>
        <p>Bllawdlaw ldwa ldlwa ldwal dlwad ld</p>
      </div>
    </div>
    <span class="material-symbols-outlined"> close </span>
  </div>
</template>

<script>
import store from "@/store/store";

export default {};
</script>

<style lang="scss" scoped>
.rep-container {
  cursor: pointer;
  $crazy_color: #00ff44;
  padding: 0px 10px 0px 10px;
  box-sizing: border-box;
  background-color: #1f1e1ed5;
  backdrop-filter: blur(5px);
  height: 51px;
  bottom: 50px;
  position: fixed;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  span {
    width: 35px;
    height: 35px;
    overflow: hidden;
    cursor: pointer;
    color: $crazy_color;
  }
  .target-info {
    display: flex;
    justify-content: start;
    flex-direction: row;
    max-width: 60%;
    align-items: start;

    .text-container {
      text-align: left;
      display: flex;
      flex-direction: column;
      margin-left: 5px;

      h3 {
        font-weight: 550;
        font-size: 1rem;

        color: $crazy_color;
      }
      p {
        font-weight: 500;
        font-size: 0.8rem;
        color: white;
      }
    }
  }
}
</style>
