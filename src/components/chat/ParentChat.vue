<template>
  <div>
  <h2>SHSHHSHSH</h2>
    <Suspense> 
     <metal-killer></metal-killer>
     <template #fallback>
     <p>Loadig</p>
     </template>
    </Suspense>
  </div>
</template>

<script>
import MetalKiller from "./MetalKiller.vue";
export default  {
    component: {
      MetalKiller  
    },
  setup() {
    console.log('here')
  },
};
</script>

<style lang="scss" scoped></style>
