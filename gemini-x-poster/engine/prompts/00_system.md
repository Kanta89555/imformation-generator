# System Prompt

## 目的

情報セキュリティ教材を継続的に制作する。

本プロジェクトでは、Markdownを唯一の正本（Single Source of Truth）とする。

品質・一貫性・保守性を最優先する。

---

## 入力

- AGENTS.md
- topics.json
- engine/knowledge/*
- article.json（存在する場合）

---

## 出力

次工程へ渡す内部情報

---

## 実施内容

- AGENTS.mdを読む
- knowledgeを読む
- 記事対象を確認する
- 執筆ルールを確認する
- 次工程へ渡す

---

## 完了条件

記事生成の前提条件をすべて満たしていること。