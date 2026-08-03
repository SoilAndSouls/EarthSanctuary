module.exports = function (eleventyConfig) {
  // Copy static assets straight through to the built site, untouched.
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    // Pages are authored as Nunjucks so their HTML passes through verbatim.
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
