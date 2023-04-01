<template>
    <div class="new-chat">
        <h2>{{`This is start of your legendary conversation with ${user.displayName? user.displayName: user.email}`}} </h2>
    </div>
</template>

<script>
    export default {
        data() {
           return {
             user: this.user
           }
        },
        props: {
            user: Object
        }
    }
</script>

<style lang="scss" scoped>

.new-chat {
  padding-top: 70px;

  h2 {
    color: #393939;
  }

}

</style>