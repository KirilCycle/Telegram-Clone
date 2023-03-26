<template>
  <div class="item">
    <div class="image-container" v-if="photoURL" >
      <img  :src="photoURL" />
    </div>

    <p>{{ message.text }}</p>
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
.item {
  width: 70%;
  padding: 10px;
  color: white;
  background: rgb(35, 35, 35);
  display: flex;
  margin-bottom: 15px;
  flex-wrap: wrap;
  position: relative;
  right: 0px;
  margin-left: 10px;
  border-radius: 5px;

  .image-container {
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
