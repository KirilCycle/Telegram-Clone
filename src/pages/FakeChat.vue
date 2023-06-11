<template>
  <div class="main">
    <group-message-item-vue v-for="msg in msgs" :key="msg.id" :message="msg"></group-message-item-vue>
  </div>
</template>

<script>
import { uuidv4 } from "@firebase/util";
import GroupMessageItemVue from "@/components/chat/group-msg-item/GroupMessageItem.vue";
import { onMounted, ref } from "vue";
export default {
  components: {
    GroupMessageItemVue,
  },
  data() {
    return {
      msgs: [
        {
          id: "23400",
          text: "suuus",
          userId: "5SEC8Idp9mPbOD4C0kEQSPMfDdA2",
          source: {
            type: "img",
            src: "https://wallpaperaccess.com/full/2472396.png",
          },
          createdAt: { seconds: 189323223, nanoseconds: 2000222 },
        },
        {
          id: "23400",
          text: "suuus",
          userId: "5SEC8Idp9mPbOD4C0kEQSPMfDdA2",
          source: {
            type: "img",
            src: "https://apriori-center.org/wp-content/uploads/2016/07/Evolution_by_will_yen-500x500.png",
          },
          createdAt: { seconds: 189323223, nanoseconds: 2000222 },
        },
        {
          id: "23400",
          text: "suuus",
          userId: "5SEC8Idp9mPbOD4C0kEQSPMfDdA2",
          source: {
            type: "img",
            src: "https://wallpaperaccess.com/full/144124.jpg",
          },
          createdAt: { seconds: 189323223, nanoseconds: 2000222 },
        },
        {
          id: "23400",
          text: "suuus",
          userId: "5SEC8Idp9mPbOD4C0kEQSPMfDdA2",
          source: {
            type: "img",
            src: "https://wallpaperaccess.com/full/2472396.png",
          },
          createdAt: { seconds: 189323223, nanoseconds: 2000222 },
        },
        {
          id: "23400",
          text: "suuus",
          userId: "5SEC8Idp9mPbOD4C0kEQSPMfDdA2",
          source: {
            type: "img",
            src: "https://wallpaperaccess.com/full/424456.jpg",
          },
          createdAt: { seconds: 189323223, nanoseconds: 2000222 },
        },
      ],
    };
  },
  setup() {},
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 10000px;
  background-color: white;
}
</style>
