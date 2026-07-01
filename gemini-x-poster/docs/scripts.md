# scripts でできること

このプロジェクトの scripts 配下には、教材記事の生成・出力・公開を支える実行スクリプトが含まれています。

## 1. 記事生成

### `scripts/generate-article.js`

- `topics.json` から未着手の教材トピックを1件選びます。
- 対象トピックに基づいて Markdown 記事の雛形を `articles/` に生成します。
- 同時に公開用の HTML を `public/` に生成します。
- 記事メタデータを `articles/` 配下の JSON で保存します。
- 生成対象のトピック状態を `writing` に更新します。

実行例:

- `npm run generate:article`
- `npm run test:generate`

## 2. note 用 XML 出力

### `scripts/export-note.js`

- `articles/` 配下の Markdown 記事を読み込みます。
- 各記事を note 用 XML に変換し、`exports/note/` に出力します。
- 既存のテンプレートに合わせて出力内容を整えます。

実行例:

- `npm run export:note`
- `npm run test:export`

## 3. GitHub への公開

### `scripts/publish.js`

- `git add .` で変更内容をステージングします。
- `git commit -m ...` でコミットを作成します。
- `git push` で GitHub に反映します。

実行例:

- `npm run publish:git`

## 4. まとめて実行する入口

### `npm run generate:next`

- 記事生成
- note 出力
- GitHub 公開

を順番に実行します。

## 5. 主要なコマンド一覧

- `npm run generate:article`: 記事の雛形を生成
- `npm run test:generate`: 生成スクリプトの動作確認
- `npm run export:note`: note XML を出力
- `npm run test:export`: 出力スクリプトの動作確認
- `npm run publish:git`: GitHub へ公開
- `npm run generate:next`: 生成から公開まで一括実行
