#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const topicsPath = path.join(rootDir, 'topics.json');
const templatePath = path.join(rootDir, 'engine', 'templates', 'page.html');

function readTopics() {
  return JSON.parse(fs.readFileSync(topicsPath, 'utf8'));
}

function flattenTopics(nodes) {
  return (nodes || []).reduce((acc, node) => {
    acc.push(node);
    if (Array.isArray(node.children) && node.children.length > 0) {
      acc.push(...flattenTopics(node.children));
    }
    return acc;
  }, []);
}

function findNextArticleTopic(topicsJson) {
  const topics = topicsJson.topics || [];
  const flattened = flattenTopics(topics);
  const preferred = flattened.find((topic) => topic.article === true && topic.status === 'todo' && topic.slug === 'confidentiality');
  if (preferred) {
    return preferred;
  }
  return flattened.find((topic) => topic.article === true && topic.status === 'todo') || null;
}

function buildArticleMarkdown(topic) {
  const title = topic.title || 'Untitled';
  const slug = topic.slug || title;
  return [
    `# ${title}`,
    '',
    '## はじめに',
    '',
    `この節では「${title}」について、初心者にもわかるように整理して説明します。`,
    '',
    '## まず理解したいこと',
    '',
    `- ${title}の概要を把握する`,
    `- どのような場面で重要かを知る`,
    `- 具体的な対策や注意点を整理する`,
    '',
    '## 本文',
    '',
    `${title}は、情報セキュリティの学習において基礎的な概念として扱われます。`,
    '',
    'ここでは、まず全体像を整理し、その後に実務や試験で押さえるポイントをまとめます。',
    '',
    '## 具体例',
    '',
    'たとえば、日常的な業務でファイル共有や認証設定を扱う場面では、この概念が関係します。',
    '',
    '## 試験対策',
    '',
    '- 定義を言葉で説明できるようにする',
    '- 重要な用語と関連概念を整理する',
    '- 具体例を使って説明できるようにする',
    '',
    '## まとめ',
    '',
    `本稿では${title}の基礎を整理し、${slug}の理解を深めるための入口を示しました。`,
    '',
  ].join('\n');
}

function buildHtmlDocument(title, markdownBody) {
  const template = fs.existsSync(templatePath)
    ? fs.readFileSync(templatePath, 'utf8')
    : '<!-- Generated HTML page template placeholder. -->';

  const bodyHtml = markdownBody
    .split('\n')
    .map((line) => {
      if (/^#\s+/.test(line)) return `<h1>${line.replace(/^#\s+/, '')}</h1>`;
      if (/^##\s+/.test(line)) return `<h2>${line.replace(/^##\s+/, '')}</h2>`;
      if (/^-\s+/.test(line)) return `<li>${line.replace(/^-\s+/, '')}</li>`;
      if (line.trim() === '') return '';
      return `<p>${line}</p>`;
    })
    .join('\n');

  const htmlBody = `<main><article>${bodyHtml}</article></main>`;
  const document = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
  </head>
  <body>${htmlBody}</body>
</html>`;
  if (template.includes('<!-- Generated HTML page template placeholder. -->')) {
    return document;
  }
  return template.replace('<!-- Generated HTML page template placeholder. -->', document).replace('{body}', htmlBody).replace('{title}', title);
}

function updateTopicStatus(topicsJson, topicId, status) {
  const topics = topicsJson.topics || [];
  const flattened = flattenTopics(topics);
  const target = flattened.find((item) => item.id === topicId);
  if (!target) {
    return false;
  }
  target.status = status;
  return true;
}

function markTopicCompleted(topicsJson, topicId) {
  return updateTopicStatus(topicsJson, topicId, 'completed');
}

function writeArticleFiles(topic, options = {}) {
  if (!topic) {
    throw new Error('No todo article topic found.');
  }

  const targetRootDir = options.rootDir ? path.resolve(options.rootDir) : rootDir;
  const articlesDir = path.join(targetRootDir, 'articles');
  const publicDir = path.join(targetRootDir, 'public');
  const metadataDir = path.join(targetRootDir, 'articles');

  fs.mkdirSync(articlesDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });

  const markdown = buildArticleMarkdown(topic);
  const markdownPath = path.join(articlesDir, `${topic.slug}.md`);
  const htmlPath = path.join(publicDir, `${topic.slug}.html`);
  const metadataPath = path.join(metadataDir, `${topic.slug}.json`);
  const metadata = {
    id: topic.id,
    title: topic.title,
    slug: topic.slug,
    status: 'draft',
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(markdownPath, markdown, 'utf8');
  fs.writeFileSync(htmlPath, buildHtmlDocument(topic.title, markdown), 'utf8');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');

  return {
    markdownPath: path.relative(targetRootDir, markdownPath),
    htmlPath: path.relative(targetRootDir, htmlPath),
    metadataPath: path.relative(targetRootDir, metadataPath),
    topic,
  };
}

function run(cliArgs = process.argv.slice(2)) {
  const shouldWrite = cliArgs.includes('--write');
  const topicsJson = readTopics();
  const topic = findNextArticleTopic(topicsJson);

  if (!topic) {
    console.log('No todo article topics found.');
    return { topic: null, wroteFiles: false };
  }

  if (!shouldWrite) {
    console.log(`Next article candidate: ${topic.title} (${topic.slug})`);
    return { topic, wroteFiles: false };
  }

  const result = writeArticleFiles(topic);
  const updated = updateTopicStatus(topicsJson, topic.id, 'writing');
  if (updated) {
    fs.writeFileSync(topicsPath, JSON.stringify(topicsJson, null, 2), 'utf8');
  }
  console.log(`Generated article scaffold at ${result.markdownPath}`);
  console.log(`Generated HTML output at ${result.htmlPath}`);
  return { ...result, wroteFiles: true, updatedTopicStatus: updated };
}

if (require.main === module) {
  try {
    run();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  buildArticleMarkdown,
  buildHtmlDocument,
  findNextArticleTopic,
  flattenTopics,
  markTopicCompleted,
  readTopics,
  run,
  updateTopicStatus,
  writeArticleFiles,
};
