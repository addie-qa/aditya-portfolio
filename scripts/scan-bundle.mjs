import fs from "node:fs";

const source = fs.readFileSync(process.env.TEMP + "\\creative.js", "utf8");
const urls = [...source.matchAll(/assets\/[A-Za-z0-9_.-]+\.(?:js|css)/g)].map((match) => match[0]);
console.log("chunks", [...new Set(urls)].join("\n"));
const files = [...source.matchAll(/[A-Za-z0-9_./-]+\.(?:glb|gltf|png|jpg|webp|hdr|mp3|woff2)/g)].map(
  (match) => match[0],
);
console.log("files", [...new Set(files)].slice(0, 80).join("\n"));
const start = source.indexOf("TheFinpedia");
console.log(source.slice(Math.max(0, start - 400), start + 800));
