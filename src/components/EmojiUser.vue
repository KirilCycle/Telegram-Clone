<template>
      <div class="circle">
            <img :src="userImg" />
      </div>
</template>

<script> 
import firebase from "firebase/compat/app";


    export default {
        props: {
           senderid: String, 
         },

         data() {

            return {
                id:this.senderid,
                userImg: ''
            }
         },

         mounted() {
            this.getUserPhoto()
           

         },
         methods: {
            async getUserPhoto() {

                if (this.id === this.$store.state.user.user.uid ) {
                    this.$emit('my')
                }

                const db = firebase.firestore()

                let query = db.collection("usersPrew").doc(this.id)
                
                let result = await query.get(); 

                this.userImg =  result.data().photoURL
                

            }
         }
    }
    
</script>

<style lang="scss" scoped>
.circle {
    width: 20px;
    height: 20px;
    border-radius: 10px;
    overflow: hidden;
   

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .circle {
    margin-left: 3px;
  }
</style>