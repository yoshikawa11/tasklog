# TaskLog CLI

TaskLog CLIは、タスクの追加・開始・停止・完了・削除・一覧表示・全削除などをコマンドラインから管理できるタスクログツールです。  
タスクの作業時間やイベントログも自動で記録されます。

---

## 主な機能

- タスクの追加（add）
- タスクの開始（start）
- タスクの停止（stop）
- タスクの完了（done）
- タスクの削除（delete）
- タスクの一覧表示（list）
- タスクデータの全削除（clear）
- タスクごとの実績時間自動集計
- イベントログ・タイムログの記録

---

## インストール(準備中)

本ツールは Deno の `deno compile` でビルドされたバイナリとして配布されています。  
Deno のインストールは不要です。  
配布されたバイナリ（例: `tasklog` または `tasklog.exe`）を任意のディレクトリに配置し、実行権限を付与してください。

```sh
chmod +x ./tasklog
```

---

## パスの通し方

バイナリをどこからでも実行できるようにするには、バイナリをパスの通ったディレクトリ（例: `~/bin` や `/usr/local/bin`）に移動するか、  
またはパスを通してください。

### 例1: `/usr/local/bin` に移動

```sh
sudo mv ./tasklog /usr/local/bin/tasklog
```

### 例2: `~/bin` ディレクトリを作成してパスを通す

```sh
mkdir -p ~/bin
mv ./tasklog ~/bin/
echo 'export PATH="$PATH:$HOME/bin"' >> ~/.bashrc   # bashの場合
echo 'export PATH="$PATH:$HOME/bin"' >> ~/.zshrc    # zshの場合
source ~/.bashrc   # または source ~/.zshrc
```

これで、どのディレクトリからでも `tasklog` コマンドとして実行できます。

---

## 使い方

### 1. タスクの追加

```sh
tasklog add "タスク名" [予定時間(分)]
```

### 2. タスクの開始

```sh
tasklog start <タスクID>
```

### 3. タスクの停止

```sh
tasklog stop <タスクID>
```

### 4. タスクの完了

```sh
tasklog done <タスクID>
```

### 5. タスクの削除

```sh
tasklog delete <タスクID>
```

### 6. タスクの一覧表示

```sh
tasklog list
```

### 7. タスクデータの全削除

```sh
tasklog clear
```

---

## 注意事項

- タスクデータやログはカレントディレクトリのJSONファイルとして保存されます。
- タスクIDは`list`コマンドで確認できます（先頭数文字でも指定可能）。
- 複数の環境で利用する場合はデータファイルの同期にご注意ください。

---

## ライセンス

MIT
