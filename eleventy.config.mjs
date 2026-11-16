import { execFileSync } from "node:child_process";
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
