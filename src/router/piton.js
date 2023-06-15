let list1 = [1,2,2,3,4,4,5];
let list2 = [1,1,1,2,2,3, 3, 4];
//1,1,2,3,4,4

function merge(arr, arr2) {
  const res = [];

  for (let i = 0; i < arr.length; i++) {
    let curr = arr[i];

    for (let j = 0; j < arr2.length; j++) {
      if (curr === arr2[j]) {
         arr2.splice(j, j + 1, curr);
        
      } else if (curr < arr2[j + 1] && curr > arr2[j - 1]) {
          arr2.splice(j, j + 1, curr);
        
      }
      
    }
  }

  return res;
}

merge(list1, list2);
console.log(list2);
