<template>
   <button class="stop-loading-btn">
      <div class="spinner">
        <div class="spinner-inner"></div>
        <span class="material-symbols-outlined"> close</span>
      </div>
    </button>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
.stop-loading-btn {
  cursor: pointer;
  width: 50px;
  height: 50px;
  background-color: #0000009b;

  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;

  .spinner {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  span {
    color: white;
    font-size: 2.1rem;
  }
}

.spinner {
  position: relative;
  width: 40px;
  height: 40px;
}

.spinner-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #ccc;
  border-top-color: #888;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

</style>