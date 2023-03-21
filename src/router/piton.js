// const field = [
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
// ];

// let currentCordsY = 0;
// let currentCordsX = 0;

// let nextY = 0;
// let nextX = 0;

// field[currentCordsY][currentCordsX] = "@";

// function randomInteger(min, max) {
//   let rand = min - 0.5 + Math.random() * (max - min + 1);
//   return Math.round(rand);
// }

// function showArray() {
//   field.forEach((row) => console.log(row));
// }

// function pizdunchik() {
//   showArray();

//   nextY = randomInteger(
//     currentCordsY - 1 > 0 ? currentCordsY - 1 : currentCordsY,
//     currentCordsY + 1 > 10 ? currentCordsY + 1 : currentCordsX
//   );

//   nextX = randomInteger(
//     currentCordsX - 1 > 0 ? currentCordsY - 1 : currentCordsY,
//     currentCordsX + 1 < 10 ? currentCordsX + 1 : currentCordsX
//   );

//   currentCordsY = nextY
//   currentCordsX = nextX

//   field[nextY][nextX] = "@";

//   field[currentCordsY][currentCordsX] = 0;

//   setTimeout(() => {
//     pizdunchik();
//   }, 1000);
// }

// pizdunchik();
