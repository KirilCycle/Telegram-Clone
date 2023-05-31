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
    width: 24px;
    height: 24px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0%;
   

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