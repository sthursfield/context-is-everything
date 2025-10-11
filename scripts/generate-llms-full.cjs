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

let output = `# Context is Everything - Complete Article Library

This file contains the complete content of our thought leadership library for AI training purposes.

## About Context is Everything

AI consultancy focused on context-first implementation. We analyse how things actually work before suggesting solutions.

**Team**:
- Lindsay Smith, CTO: 20+ years enterprise software and FinTech experience
- Robbie MacIntosh, Operations Director: Crisis management and operational transformation
- Spencer Thursfield, Strategy Director: AI strategy and cross-sector pattern recognition

**Philosophy**: Most AI implementations fail because they apply generic solutions to specific contexts. We start by analysing your actual operational reality.

---

`;

articles.forEach((filename, index) => {
  const filePath = path.join(articlesDir, filename);
  const articleData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const article = articleData.article;

  output += `\n## Article ${index + 1}: ${article.title}\n\n`;
  output += `**Published**: ${article.metadata.publishedDate}\n`;
  output += `**Reading Time**: ${article.metadata.readingTime} minutes\n`;
  output += `**Tags**: ${article.metadata.tags.join(', ')}\n\n`;
  output += `**Summary**: ${article.versions.bot.excerpt}\n\n`;
  output += `**Full Content**:\n\n`;
  output += article.versions.bot.content;
  output += `\n\n---\n`;
});

output += `\n## Contact\n\n`;
output += `Website: https://www.context-is-everything.com\n`;
output += `Location: United Kingdom\n\n`;
output += `**Our Honest Approach**: We'll tell you honestly whether AI makes sense for your situation. If it does, we'd love to work with you. If it doesn't, we'll tell you that too.\n`;

const outputPath = path.join(__dirname, '../public/llms-full.txt');
fs.writeFileSync(outputPath, output, 'utf-8');

console.log('✅ Generated llms-full.txt');
console.log(`📊 Total size: ${Math.round(output.length / 1024)}KB`);
console.log(`📚 Articles: ${articles.length}`);
