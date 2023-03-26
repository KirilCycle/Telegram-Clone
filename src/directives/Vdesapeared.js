export default {
    beforeMount(el, binding) {
      let options = {
        root: document.querySelector("#scrollArea"),
        rootMargin: "0px",
        threshold: 1.0,
      };
      
      // type conditions =  'visible' | 'always' | 'hided' 
  
      let callback = function (entries, observer) {
  
        if (!entries[0].isIntersecting) {
          binding.value(false);
        }
        if (entries[0].isIntersecting) {
          binding.value(true);
        }
      };
  
  
  
      let observer = new IntersectionObserver(callback, options);
      observer.observe(el);
    },
  
    name: "desapeared",
  };
  