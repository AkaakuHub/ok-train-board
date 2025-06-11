# OK Train Board

**OK Train Board** は、電車の発車時刻、種別、行先などを美しいUIで表示するWebアプリケーションです。駅の発車標のような見た目で、リアルタイムな列車情報を確認できます。

## 🚅 特徴

- **モダンなデザイン**: ネオンカラーとグラスモーフィズムを採用したサイバーパンク風のUI
- **レスポンシブ対応**: デスクトップ・タブレット・スマートフォンに対応
- **リアルタイム更新**: 自動更新機能と手動更新機能を搭載
- **列車種別別の色分け**: 特急、急行、快速などを視覚的に区別
- **遅延情報**: 列車の遅延時間を表示
- **通過情報**: 通過列車の表示

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 15.3.2
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS 4.1.6
- **パッケージマネージャー**: pnpm
- **アイコン**: React Icons

## 📁 プロジェクト構成

```
src/
├── app/                      # Next.js App Router
│   ├── globals.css          # グローバルスタイル
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # メインページ
│   └── welcome/             # ウェルカムページ
├── components/              # Reactコンポーネント
│   ├── Train/               # 列車関連コンポーネント
│   │   ├── TrainBoard.tsx           # メインボードコンポーネント
│   │   ├── TrainBoardHeader.tsx     # ヘッダー部分
│   │   ├── TrainBoardControls.tsx   # 更新コントロール
│   │   ├── TrainBoardGridHeader.tsx # グリッドヘッダー
│   │   ├── TrainBoardFooter.tsx     # フッター部分
│   │   ├── TrainList.tsx            # 列車リスト
│   │   ├── TrainRow.tsx             # 個別の列車行
│   │   ├── TrainTypeBadge.tsx       # 列車種別バッジ
│   │   ├── TrainStatus.tsx          # 列車ステータス
│   │   └── useTrainSorter.ts        # 列車ソート用カスタムフック
│   └── UI/                  # 汎用UIコンポーネント
│       └── CircleLoader.tsx # サークルローダー
└── types/                   # TypeScript型定義
    └── api.ts               # API関連の型定義
```

## 🎨 コンポーネント設計

このプロジェクトでは、**Single Responsibility Principle（単一責任の原則）** に基づいてコンポーネントを細かく分割しています：

### Train関連コンポーネント

- **TrainBoard**: メインのボードコンポーネント（統合）
- **TrainBoardHeader**: タイトルと更新コントロールを含むヘッダー
- **TrainBoardControls**: 自動更新トグルと手動更新ボタン
- **TrainBoardGridHeader**: テーブルのヘッダー行
- **TrainBoardFooter**: 最終更新時刻などのフッター情報
- **TrainList**: 列車のリスト表示
- **TrainRow**: 個別の列車情報行
- **TrainTypeBadge**: 列車種別のカラフルなバッジ
- **TrainStatus**: 通過・遅延情報の表示

### カスタムフック

- **useTrainSorter**: 列車データのソート・フィルタリングロジック

## 🚀 開発・実行

### 前提条件

- Node.js 18以上
- pnpm

### インストール

```bash
# リポジトリのクローン
git clone <repository-url>
cd ok-train-board

# 依存関係のインストール
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認してください。

### ビルド

```bash
# プロダクションビルド
pnpm build

# プロダクションサーバーの起動
pnpm start
```

### リンティング

```bash
pnpm lint
```

## 🎯 主な機能

### 列車情報表示
- 発車時刻
- 列車種別（特急、急行、快速など）
- 行先
- 遅延情報
- 通過情報
- 備考

### 更新機能
- 自動更新（ON/OFF切り替え可能）
- 手動更新（クールダウン機能付き）
- 更新状況の視覚的フィードバック

### UI/UX
- ダークテーマのサイバーパンク風デザイン
- アニメーション効果
- レスポンシブデザイン
- アクセシビリティ対応
