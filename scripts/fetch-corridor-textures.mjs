import fs from "node:fs";
import path from "node:path";

const files = [
  "textures/corridor/wall_texture.webp",
  "textures/corridor/kawalekpodlogi.webp",
  "textures/corridor/ceiling_texture.webp",
  "textures/corridor/doors/frame_sketch.webp",
  "textures/corridor/doors/drzwiabout.webp",
  "textures/corridor/doors/drzwiprojekty.webp",
  "textures/corridor/doors/drzwikontakt.webp",
  "textures/corridor/doors/drzwisocial.webp",
  "textures/corridor/doors/drzwiabout_painted.webp",
  "textures/corridor/doors/drzwiprojekty_painted.webp",
  "textures/corridor/doors/drzwikontakt_painted.webp",
  "textures/corridor/doors/drzwisocial_painted.webp",
];

const root = path.resolve("public/experience");

for (const file of files) {
  const destination = path.join(root, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const response = await fetch(`https://aditya-arora.vercel.app/${file}`);
  if (!response.ok) {
    console.log("FAIL", response.status, file);
    continue;
  }
  fs.writeFileSync(destination, Buffer.from(await response.arrayBuffer()));
  console.log("OK", file, fs.statSync(destination).size);
}
