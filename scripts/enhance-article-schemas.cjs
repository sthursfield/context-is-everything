const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, '../thought_leadership/articles');
const articles = [
  'article-01-ai-projects-fail.json',
  'article-02-worthless-technology-stack.json',
  'article-03-hidden-vendor-costs.json',
  'article-04-complete-cost-of-ai.json',
  'article-05-signs-you-need-ai.json',
  'article-06-faster-cheaper-better.json'
];

const slugMap = {
  'article-01-ai-projects-fail': 'why-ai-projects-fail',
  'article-02-worthless-technology-stack': 'worthless-technology-stack',
  'article-03-hidden-vendor-costs': 'hidden-vendor-costs',
  'article-04-complete-cost-of-ai': 'complete-cost-of-ai',
  'article-05-signs-you-need-ai': 'signs-you-need-ai',
  'article-06-faster-cheaper-better': 'faster-cheaper-better-ai'
};

articles.forEach((filename) => {
  const filePath = path.join(articlesDir, filename);
  const articleData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const article = articleData.article;
  const slug = slugMap[article.id];

  // Enhance structured data with missing fields
  if (article.versions.bot.structuredData) {
    article.versions.bot.structuredData = {
      ...article.versions.bot.structuredData,
      "publisher": {
        "@type": "Organization",
        "name": "Context is Everything",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.context-is-everything.com/assets/CIE_stacked_cropped.png"
        }
      },
      "dateModified": article.metadata.lastUpdated,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.context-is-everything.com/insights/${slug}`
      }
    };
  }

  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(articleData, null, 2), 'utf-8');
  console.log(`✅ Enhanced ${filename}`);
});

console.log('\n🎉 All article schemas enhanced successfully!');
