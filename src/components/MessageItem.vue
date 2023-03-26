<template>
  <div class="item">
    <div class="profile-conatainer">
      <img :src="message.userPhotoURl">
    </div>
    <div class="item-body">
      <p class="user-name"> {{message.userName.slice(0,18)}}</p>
      <div class="image-container" v-if="photoURL" >
        <img  :src="photoURL" />
      </div>
      <p class="item_body_text">{{ message.text }}</p>
    </div>

  </div>
</template>

<script>
import { ref } from "vue";
import { getStorage, getDownloadURL } from "firebase/storage";
import store from "@/store/store";

export default {
  props: {
    message: Object,
    isMy: Boolean,
    required: true,
  },
  setup(props) {
    const photoURL = ref(null);

    const storage = getStorage();
    // async function SUS (){
    //   getDownloadURL(pathReference).then((url) => {
    //           console.log(url,'AS PATH');
    //           console.log(it)
    //         });
    // }

    if (props.message.imageRef) {
      const pathReference = store.state.user.customStorageRef(
        storage,
        `${props.message.imageRef}`
      );

      console.log(pathReference);

      getDownloadURL(pathReference).then((url) => {
        console.log(url, "AS PATH");
        photoURL.value = url;
      });
    }

    // let photoSrc = ref(null);

    return {
      // photoSrc,
      photoURL,
    };
  },
};
</script>

<style lang="scss" scoped>

$crazy_color: #00ff44;
.item {
  width: 80%;
  position: relative;
  display: flex;

  .profile-conatainer {
    width: 35px;
    height: 35px;
    margin-top: 5px;
    border-radius: 50%;
    background-color: $crazy_color;
    position: sticky;
    top: 60px;
    overflow: hidden;
    left: 5px;

    img {
      width: 100%;
      min-height: 100%;
      object-fit:cover;
    }
    
  }
  .item-body {
     left: 0px;
    .item_body_text {
      font-size: 0.9rem;
      margin-top: 15px;
    }
    .user-name {
      font-size: 1rem;
      position: absolute;
      font-weight: 500;
      top: 5px;
      left: 13px;
      color: $crazy_color;
    }

    padding: 13px;
    color: white;
    background: rgb(35, 35, 35);
    display: flex;
    margin-bottom: 15px;
    flex-wrap: wrap;
    position: relative;
    right: 0px;
    margin-left: 10px;
    border-radius: 5px;
    width: 70%;
   
  }

  .image-container {
    margin-top: 15px;
    width: 100%;

     img {
      max-width: 100%;
      min-width: 100%;
     }

  }

  .time {
    font-size: 0.6rem;
    color: gray;
  }
}

.my_item {
  width: 70%;
  padding: 10px;
  color: rgb(255, 255, 255);
  background: rgb(28, 243, 67);
  margin-top: 15px;
  margin: 15px;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  right: 0px;
  border-radius: 5px;

  .time {
    font-size: 0.6rem;
    color: gray;
  }
}
</style>
