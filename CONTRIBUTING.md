# 貢献ガイドライン

『Chrono Crossover』プロジェクトへの貢献に興味を持っていただき、ありがとうございます。このドキュメントでは、プロジェクトに貢献する際のガイドラインを説明します。

## 貢献の方法

### 1. Issue の報告

バグを発見した場合や新機能の提案がある場合は、GitHub Issues を使用してください。

**バグ報告の際は以下の情報を含めてください：**
- 発生した問題の詳細な説明
- 再現手順
- 期待される動作
- 実際の動作
- 使用環境（OS、Unityバージョンなど）

### 2. Pull Request の作成

コードの変更を提案する場合は、以下の手順に従ってください：

1. このリポジトリをフォークする
2. 新しいブランチを作成する (`git checkout -b feature/amazing-feature`)
3. 変更をコミットする (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュする (`git push origin feature/amazing-feature`)
5. Pull Request を作成する

### 3. コーディング規約

**C# コーディング規約：**
- Microsoft の C# コーディング規約に従う
- クラス名は PascalCase を使用
- メソッド名は PascalCase を使用
- 変数名は camelCase を使用
- 定数は UPPER_CASE を使用

**Unity 固有の規約：**
- MonoBehaviour を継承するクラスには適切なコメントを記述
- SerializeField を使用する際は、適切な変数名を付ける
- パブリックメソッドには XML ドキュメントコメントを記述

### 4. コミットメッセージ

コミットメッセージは以下の形式に従ってください：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type の例：**
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントの変更
- `style`: コードスタイルの変更
- `refactor`: リファクタリング
- `test`: テストの追加・修正
- `chore`: その他の変更

**例：**
```
feat(battle): 連携技システムの実装

- 2人キャラクターの連携技を追加
- 連携技発動条件の判定ロジックを実装
- 連携技エフェクトの基本フレームワークを作成

Closes #123
```

## 開発環境のセットアップ

### 必要なソフトウェア

- Unity 2022.3 LTS
- Visual Studio 2022 または Visual Studio Code
- Git

### セットアップ手順

1. リポジトリをクローンする
```bash
git clone https://github.com/taolido/chrono-crossover.git
cd chrono-crossover
```

2. Unity Hub でプロジェクトを開く

3. 必要なパッケージをインストールする（Package Manager から）

## テスト

新しい機能を追加する際は、適切なテストも併せて作成してください。

- Unit Test は NUnit を使用
- Integration Test は Unity Test Framework を使用

## ドキュメント

コードの変更に伴い、関連するドキュメントも更新してください。

- API の変更があった場合は、対応するドキュメントを更新
- 新機能を追加した場合は、使用方法を README に記載

## 質問・相談

開発に関する質問や相談がある場合は、以下の方法でお気軽にお声がけください：

- GitHub Discussions を使用
- Issue でラベル「question」を付けて投稿

## ライセンス

このプロジェクトに貢献することで、あなたの貢献が MIT License の下で公開されることに同意したものとみなされます。
