const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { findNextArticleTopic, buildArticleMarkdown, buildHtmlDocument, updateTopicStatus, writeArticleFiles } = require('./generate-article');

const topicsJson = {
  topics: [
    {
      id: 'security',
      title: '情報セキュリティ',
      slug: 'security',
      article: false,
      status: 'completed',
      children: [
        {
          id: 'fundamentals',
          title: '情報セキュリティの基礎',
          slug: 'fundamentals',
          article: true,
          status: 'todo',
          children: [],
        },
      ],
    },
  ],
};

const topic = findNextArticleTopic(topicsJson);
assert.ok(topic, 'should find a todo article topic');
assert.equal(topic.slug, 'fundamentals');

const prioritizedTopicsJson = {
  topics: [
    {
      id: 'security',
      title: '情報セキュリティ',
      slug: 'security',
      article: false,
      status: 'completed',
      children: [
        {
          id: 'fundamentals',
          title: '情報セキュリティの基礎',
          slug: 'fundamentals',
          article: true,
          status: 'writing',
          children: [
            {
              id: 'information-asset',
              title: '情報資産とは',
              slug: 'information-asset',
              article: true,
              status: 'writing',
              children: [],
            },
            {
              id: 'vulnerability',
              title: '脆弱性の種類',
              slug: 'vulnerability',
              article: true,
              status: 'todo',
              children: [],
            },
          ],
        },
        {
          id: 'cia',
          title: 'CIA（情報セキュリティの7要素）',
          slug: 'cia',
          article: true,
          status: 'todo',
          children: [
            {
              id: 'confidentiality',
              title: '機密性',
              slug: 'confidentiality',
              article: true,
              status: 'todo',
              children: [],
            },
          ],
        },
      ],
    },
  ],
};
const prioritizedTopic = findNextArticleTopic(prioritizedTopicsJson);
assert.ok(prioritizedTopic, 'should prioritize confidentiality when present');
assert.equal(prioritizedTopic.slug, 'confidentiality');

const markdown = buildArticleMarkdown(topic);
assert.match(markdown, /# 情報セキュリティの基礎/);
assert.match(markdown, /## 具体例/);

const html = buildHtmlDocument(topic.title, markdown);
assert.match(html, /<h1>情報セキュリティの基礎<\/h1>/);
assert.match(html, /<main>/);
assert.match(html, /<meta charset="utf-8">/);

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'generate-article-'));
const output = writeArticleFiles(topic, { rootDir: tempDir });
assert.ok(fs.existsSync(path.join(tempDir, 'articles', 'fundamentals.md')));
assert.ok(fs.existsSync(path.join(tempDir, 'articles', 'fundamentals.json')));
assert.ok(fs.existsSync(path.join(tempDir, 'public', 'fundamentals.html')));
assert.match(output.markdownPath, /fundamentals\.md/);

const topicsWithStatus = { topics: [{ id: 'security', title: '情報セキュリティ', slug: 'security', article: false, status: 'completed', children: [{ id: 'fundamentals', title: '情報セキュリティの基礎', slug: 'fundamentals', article: true, status: 'todo', children: [] }] }] };
assert.equal(updateTopicStatus(topicsWithStatus, 'fundamentals', 'writing'), true);
assert.equal(topicsWithStatus.topics[0].children[0].status, 'writing');

console.log('generate-article tests passed');
