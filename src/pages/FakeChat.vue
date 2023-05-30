<template>
  <div>
    <message-item-vue
      v-for="it in msgs"
      :key="it.id"
      :message="it"
      :isMy="it.userId.includes('my')"
    ></message-item-vue>
  </div>
</template>

<script>
import MessageItemVue from "@/components/MessageItem.vue";
import { uuidv4 } from "@firebase/util";
export default {
  components: {
    MessageItemVue,
  },
  data() {
    return {
      msgs: [],
      msgGroupUtil: 0,
    };
  },
  mounted() {
    const imgExample =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Los_Angeles_with_Mount_Baldy.jpg/1200px-Los_Angeles_with_Mount_Baldy.jpg";
    const videExample = " https://youtu.be/QIA8CTQspmQ";

    const firestoreTimestampExample = {
      seconds: 1622385623,
      nanoseconds: 500000000,
    };

    const generateRandomText = () => {
      const texts = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Sed euismod nisi nec mauris ullamcorper, nec commodo tortor efficitur.",
        "Fusce condimentum risus sed dolor ullamcorper rhoncus.",
        "Nullam consectetur mauris a nisl semper, a semper libero mattis.",
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      ];
      return texts[Math.floor(Math.random() * texts.length)];
    };

    const generateTimestamp = (daysAgo) => {
      const now = new Date();
      now.setDate(now.getDate() - daysAgo);
      const seconds = Math.floor(now.getTime() / 1000);
      return {
        seconds,
        nanoseconds: 0,
      };
    };

    const createMessage = (id, text, createdAt, userId) => {
      return { id, text, createdAt, userId };
    };

    let currentMsg = "my";
    let groupCount = 3

    for (let i = 1; i <= 52; i++) {
      const isToday = Math.ceil(i / 10) % 2 === 0;
      const daysAgo = isToday ? 0 : Math.ceil(i / 10);
      const createdAt = generateTimestamp(daysAgo);

      let hasVideo = false;
      if (Math.floor(Math.random() * 10) === 3) {
        hasVideo = true;
      }

      const id = i + uuidv4();

      this.msgGroupUtil += 1;

      if (this.msgGroupUtil > groupCount) {
        currentMsg === "my" ? (currentMsg = "somebody") : (currentMsg = "my");
        this.msgGroupUtil = 0;

         groupCount = Math.floor(Math.random() * 4)

      }

      const userId = currentMsg;

      const text = generateRandomText();

      this.msgs.push(createMessage(id, text, createdAt, userId));
    }
  },
};
</script>

<style lang="scss" scoped></style>
