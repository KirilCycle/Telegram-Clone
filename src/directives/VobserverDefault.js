export default {
    beforeMount(el, binding ) {
      let options = {
        root: document.querySelector("#scrollArea"),
        rootMargin: "0px",
        threshold: 1.0,
      };
      
      
  
      let callback = function (entries, observer) {
  
          binding.value();
        
      };
  
     
  
  
      let observer = new IntersectionObserver(callback, options);
      observer.observe(el);
    },
  
    name: "observerdef",
  };
  