/**
 * I strive to keep the `.eleventy.js` file clean and uncluttered. Most adjustments must be made in:
 *  - `src/config/collections.js`
 *  - `src/config/filters.js`
 *  - `src/config/plugins.js`
 *  - `src/config/shortcodes.js`
 *  - `src/config/transforms.js`
 */

// get package.json
const pkg = require('./package.json');

// module import filters
const {
  limit,
  toHtml,
  where,
  every,
  some,
  categoryFilter,
  toISOString,
  formatDate,
  formatDateES,
  formatDateDE,
  toAbsoluteUrl,
  stripHtml,
  minifyCss,
  minifyJs,
  mdInline,
  splitlines,
  getWebmentionsForUrl,
  webmentionSize,
  webmentionsByType,
  isOwnWebmention
} = require('./config/filters/index.js');

// module import shortcodes
const {
  getProjectsEN,
  getBlogsEN,
  getProjectsES,
  getBlogsES,
  getProjectsDE,
  getBlogsDE,
  getBlogsAllLang
} = require('./config/collections/index.js');

const {
  asideShortcode,
  breakoutShortcode,
  insertionShortcode,
  imageShortcode,
  imageShortcodePlaceholder,
  liteYoutube
} = require('./config/shortcodes/index.js');

// module import transforms
// const {
// ...
// } = require('./config/transforms/index.js');

// plugins
const markdownLib = require('./config/plugins/markdown.js');
const {EleventyRenderPlugin} = require('@11ty/eleventy');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const {slugifyString} = require('./config/utils');
const {escape} = require('lodash');
const pluginRss = require('@11ty/eleventy-plugin-rss');

// module import events
const {afterBuild} = require('./config/events/index.js');

module.exports = eleventyConfig => {
  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  eleventyConfig.setUseGitIgnore(false);

  // 	--------------------- Custom Watch Targets -----------------------
  eleventyConfig.addWatchTarget('./src/assets');
  eleventyConfig.addWatchTarget('./utils/*.js');

  // --------------------- layout aliases -----------------------
  eleventyConfig.addLayoutAlias('base', 'base.njk');
  eleventyConfig.addLayoutAlias('page', 'page.njk');
  eleventyConfig.addLayoutAlias('home', 'home.njk');
  eleventyConfig.addLayoutAlias('about', 'about.njk');
  eleventyConfig.addLayoutAlias('services', 'services.njk');
  eleventyConfig.addLayoutAlias('projects', 'projects.njk');
  eleventyConfig.addLayoutAlias('blog', 'blog.njk');
  eleventyConfig.addLayoutAlias('post', 'post.njk');
  eleventyConfig.addLayoutAlias('feed', 'feed.njk');
  eleventyConfig.addLayoutAlias('error404', 'error404.njk');

  // 	---------------------  Custom filters -----------------------
  eleventyConfig.addFilter('limit', limit);
  eleventyConfig.addFilter('where', where);
  eleventyConfig.addFilter('every', every);
  eleventyConfig.addFilter('some', some);
  eleventyConfig.addFilter('categoryFilter', categoryFilter);
  eleventyConfig.addFilter('escape', escape);
  eleventyConfig.addFilter('toHtml', toHtml);
  eleventyConfig.addFilter('toIsoString', toISOString);
  eleventyConfig.addFilter('formatDate', formatDate);
  eleventyConfig.addFilter('formatDateES', formatDateES);
  eleventyConfig.addFilter('formatDateDE', formatDateDE);
  eleventyConfig.addFilter('toAbsoluteUrl', toAbsoluteUrl);
  eleventyConfig.addFilter('stripHtml', stripHtml);
  eleventyConfig.addFilter('slugify', slugifyString);
  eleventyConfig.addFilter('toJson', JSON.stringify);
  eleventyConfig.addFilter('fromJson', JSON.parse);
  eleventyConfig.addFilter('cssmin', minifyCss);
  eleventyConfig.addNunjucksAsyncFilter('jsmin', minifyJs);
  eleventyConfig.addFilter('md', mdInline);
  eleventyConfig.addFilter('splitlines', splitlines);
  eleventyConfig.addFilter('getWebmentionsForUrl', getWebmentionsForUrl);
  eleventyConfig.addFilter('webmentionSize', webmentionSize);
  eleventyConfig.addFilter('webmentionsByType', webmentionsByType);
  eleventyConfig.addFilter('isOwnWebmention', isOwnWebmention);
  eleventyConfig.addFilter('keys', Object.keys);
  eleventyConfig.addFilter('values', Object.values);
  eleventyConfig.addFilter('entries', Object.entries);

  // 	--------------------- Custom shortcodes ---------------------
  eleventyConfig.addPairedShortcode('aside', asideShortcode);
  eleventyConfig.addPairedShortcode('breakout', breakoutShortcode);
  eleventyConfig.addPairedShortcode('insertion', insertionShortcode);
  eleventyConfig.addNunjucksAsyncShortcode('image', imageShortcode);
  eleventyConfig.addNunjucksAsyncShortcode('imagePlaceholder', imageShortcodePlaceholder);
  eleventyConfig.addShortcode('youtube', liteYoutube);
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`); // current year, stephanie eckles

  // 	--------------------- Custom collections -----------------------
  eleventyConfig.addCollection('projects_en', getProjectsEN);
  eleventyConfig.addCollection('blog_en', getBlogsEN);
  eleventyConfig.addCollection('projects_es', getProjectsES);
  eleventyConfig.addCollection('blog_es', getBlogsES);
  eleventyConfig.addCollection('projects_de', getProjectsDE);
  eleventyConfig.addCollection('blog_de', getBlogsDE);

  eleventyConfig.addCollection('blog_all', getBlogsAllLang);

  // 	--------------------- Transforms ---------------------

  // 	--------------------- Custom Template Languages, partial imported as plugin ---------------------

  eleventyConfig.addPlugin(require('./config/template-formats/js-config.js'));

  // 	--------------------- Plugins ---------------------
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.setLibrary('md', markdownLib);
  eleventyConfig.addPlugin(pluginRss);

  // 	--------------------- Passthrough copies ---------------------

  eleventyConfig.addPassthroughCopy('src/assets/fonts/');
  eleventyConfig.addPassthroughCopy('src/assets/images/');
  eleventyConfig.addPassthroughCopy('src/assets/sounds/');

  // all social icons and manifest to root directory
  eleventyConfig.addPassthroughCopy({
    'src/assets/images/favicon/*': '/'
  });

  // 	--------------------- Events ---------------------
  eleventyConfig.on('afterBuild', afterBuild);

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_includes',
      layouts: '_layouts'
    },
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk'
  };
};
