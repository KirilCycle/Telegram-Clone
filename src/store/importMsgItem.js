export  function importGroup() {
  return defineAsyncComponent(() => {
   return import(
      `../components/chat/${
       true ? "group-msg-item-mobile" : "group-msg-item"
      }/GroupMessageItem.vue`
    );
  });
}
