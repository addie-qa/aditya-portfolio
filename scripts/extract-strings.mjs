import fs from "node:fs";

const source = fs.readFileSync(process.env.TEMP + "\\CreativeApp.js", "utf8");
const strings = [];
const pattern = /"((?:[^"\\]|\\.){8,180})"/g;
let match;
while ((match = pattern.exec(source))) {
  const value = match[1];
  if (
    /[A-Za-z]/.test(value) &&
    !value.startsWith("http") &&
    !value.includes("webpack") &&
    !value.startsWith("/") &&
    !value.includes("function")
  ) {
    strings.push(value);
  }
}
const interesting = strings.filter((value) =>
  /room|door|gallery|about|contact|studio|walk|click|Aditya|project|skill|corridor|enter|pointer|WASD|arrow/i.test(
    value,
  ),
);
console.log("interesting", interesting.length);
console.log(interesting.slice(0, 200).join("\n"));
