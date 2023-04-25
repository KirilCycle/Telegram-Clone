<template>
  <div class="sub-cht">
    <div v-for="msg in chatPart" :key="msg" class="msg"></div>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";

export default {
  props: {
    getData: Object,
    required: true,
  },
  setup(props, { emit }) {
    const chatPart = ref([]);

    for (let i = 0; i < 10; i++) {
      chatPart.value.push(i + props.getData.localId);
    }

    emit(
      "dataToNextMove",
      chatPart.value[0],
      chatPart.value[9],
      props.getData.localId
    );

    watchEffect(() => {
      console.log("REFETCH :(", props.getData.opirniy, props.getData.type);

      const query = ref(null);
      //in case we saw a top observer

      switch (props.getData.type) {
        case "endBefore":
          query.value = messagesRef
            .orderBy("createdAt")
            .limitToLast(20)
            .endBefore(link.pivot.createdAt);

          break;

        case "startAfter":
          query.value = messagesRef
            .orderBy("createdAt")
            .startAfter( props.getData.opirniy)
            .limit(20);
      }

      query.onSnapshot((snapshot, parameters) => {
        chatPart.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        chat.value = newData;
      });
    });

    return {
      chatPart,
    };
  },
};
</script>

<style lang="scss" scoped>
.msg {
  width: 200px;
  height: 85px;
  margin: 5px;
  background-color: #00fa58;
}

.sub-cht {
  border-bottom: 1px solid rgb(46, 31, 255);
  border-top: 1px solid rgb(46, 31, 255);
}
</style>
