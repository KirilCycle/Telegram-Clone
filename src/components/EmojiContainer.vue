<template>
     <div class="emoji-c" v-for="em in ar" :key="em[0]">
        <p>
          {{ em[0] }}
        </p>

        <!-- <div class="circle">
          <img :src="em.img" />
        </div> -->
      </div>
      
</template>

<script>
    export default {
        props: ['emojis'],
        data() {
            return {
                ar: Object.entries( this.emojis)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>