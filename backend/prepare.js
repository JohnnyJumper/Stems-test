// Reading the file using default
// fs npm package
const fs = require("fs");
csv = fs.readFileSync("main_dataset.csv");

// Convert the data to String and
// split it in an array
var array = csv.toString().split("\n");

// All the rows of the CSV will be
// converted to JSON objects which
// will be added to result in an array
let result = {};

// The array[0] contains all the
// header columns so we store them
// in headers array
let headers = array[0].split(", ");
// Since headers are separated, we
// need to traverse remaining n-1 rows.
let group1 = [];
let group2 = [];
let group3 = [];
for (let i = 1; i < array.length - 1; i++) {
  // Create an empty object to later add
  // values of the current row to it
  // Declare string str as current array
  // value to change the delimiter and
  // store the generated string in a new
  // string s
  let str = array[i];
  let s = "";
  // By Default, we get the comma separated
  // values of a cell in quotes " " so we
  // use flag to keep track of quotes and
  // split the string accordingly
  // If we encounter opening quote (")
  // then we keep commas as it is otherwise
  // we replace them with pipe |
  // We keep adding the characters we
  // traverse to a String s
  let flag = 0;
  for (let ch of str) {
    if (ch === '"' && flag === 0) {
      flag = 1;
    } else if (ch === '"' && flag == 1) flag = 0;
    if (ch === ", " && flag === 0) ch = "|";
    if (ch !== '"') s += ch;
  }

  // Split the string using pipe delimiter |
  // and store the values in a properties array
  let properties = s.split(",");

  if (!properties[1]) {
    continue;
  }
  if (group1.length <= 1000) {
    group1.push({ name: properties[1] });
  } else if (group2.length <= 1000) {
    group2.push({ name: properties[1] });
  } else if (group3.length <= 1000) {
    group3.push({ name: properties[1] });
  }
}

Object.assign(result, { group1, group2, group3 });

// Convert the resultant array to json and
// generate the JSON output file.
let json = JSON.stringify(result);
fs.writeFileSync("main_dataset.json", json);
