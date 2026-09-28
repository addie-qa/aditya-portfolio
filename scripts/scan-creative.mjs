import fs from "node:fs";

const source = fs.readFileSync(process.env.TEMP + "\\CreativeApp.js", "utf8");
console.log("len", source.length);
const keys = [
  "sourceMappingURL",
  "PointerLock",
  "react-three",
  "@react-three/fiber",
  "THREE",
  "corridor",
  "Door",
  "gallery",
  "about",
  "contact",
  "gsap",
  "useFrame",
  "Html",
  "room",
];
for (const key of keys) {
  let count = 0;
  let index = 0;
  while ((index = source.indexOf(key, index)) !== -1) {
    count += 1;
    index += key.length;
    if (count > 20) break;
  }
  console.log(key, count);
}
console.log("tail", source.slice(-180));
const files = [...source.matchAll(/[A-Za-z0-9_./-]+\.(?:glb|gltf|png|jpg|webp|hdr|mp3|fbx)/g)].map(
  (match) => match[0],
);
console.log("files", [...new Set(files)].join("\n"));
