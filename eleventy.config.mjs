import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { imageSize } from "image-size";
import yaml from "js-yaml";

export default function (eleventyConfig) {
  // Tailwind compiles straight into the output folder before every build,
  // so templates and CSS can never drift apart.
  eleventyConfig.on("eleventy.before", () => {
    execFileSync("node_modules/.bin/tailwindcss", [
      "-i", "site/styles/main.css",
      "-o", "_site/css/style.css",
      "--minify",
    ], { stdio: "inherit" });
  });
  eleventyConfig.addWatchTarget("site/styles/");

  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));

  // Real pixel size of a photo, so <img> reserves its space before it loads.
  eleventyConfig.addFilter("dims", (file) => imageSize(readFileSync(`site/assets/photos/${file}`)));

  eleventyConfig.addPassthroughCopy("site/assets");
  eleventyConfig.addPassthroughCopy("site/CNAME");
  eleventyConfig.addPassthroughCopy("site/*.{ico,png,webmanifest}");

  return {
    dir: {
      input: "site",
      output: "_site",
    },
  };
}
