export default {
  beforeMount(el, binding) {
    let rColor = Math.floor(Math.random() * 5);

    let res = ''

    switch (rColor) {
      case 1:
        res = "red";
        break;
      case 2:
        res = "green";
      case 3:
        res ="blue";
      default:
        res = "black";
    }

    el.style.fontSize = `${binding.value}rem`;
    el.style.color = res;
  },
  updated(el, binding) {
    let rColor = Math.floor(Math.random() * 4);
    
    
    let res = ''
    
    switch (rColor) {
      case 0:
        res = "red";
        break;
        case 1:
          res = "green";
          case 2:
            res ="blue";
      }
      console.log(rColor, res,'strange');
      
      el.style.fontSize = `${binding.value}rem`;
    el.style.color = res;
  },
  name: "font-size",
};
