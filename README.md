# 概要
- Typescript + railsでの学習のOutputのためのアプリ（ポートフォリオのつもり）開発。
- だったが、いまはALL Typescriptで開発している。
  - 理由はVercelにデプロイできるようにするため。

## 操作イメージ（2024/06時点のモノ）
![beta](https://github.com/musoukun/memoapp/assets/35359979/3976018d-fd0f-442b-9bd4-2a093790691e)


# 技術スタック
## プログラミング言語（フロントエンド＋バックエンド共通）
- TypeScript
- JavaScript

## フロントエンド
### 使用技術
- フレームワーク: Vite + React
- スタイル: Tailwind CSS
- パッケージ管理: npm
- ライブラリ: BlockNote,dnd-kit

## バックエンド
### 使用技術
  - フレームワーク: Express
  - ORM: Prisma
  - データベース:PostgreSQL (Prisma ORMによる管理)
## デプロイ
 - Vercel
 - Spabase

## 今後追加したい機能
- 機能ではないけど、もっとテストコード書かないとなぁと思う。
- まずはKanban機能。メモ内に入れるのがかなり困難なため、独自で画面を用意したい。
- 個人設定画面。タイトルの自動命名とか、ダークモードライトモードとか設定できるように。
- Markdownコードを張り付けたことを検知して、自動でMarkdownとして反映させたい。
- 別のチケット管理システムとのデータ連携（まずはRedmine）
  - データ連携できたらデータ分析機能も付けたい。
  - 逆にRedmineとかに登録しに行くみたいなこともできたい。 
