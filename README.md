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

## インストール

本ツールは Deno の `deno compile` でビルドされたバイナリとして配布されています。  
Deno のインストールは不要です。  
[リリースページ](https://github.com/yoshikawa11/tasklog/releases)から配布されたバイナリ（例: `tasklog` または `tasklog.exe`）を任意のディレクトリに配置し、実行権限を付与してください。

```sh
chmod +x ./tasklog
```

<details>
<summary>パスの通し方を見る</summary>

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

</details>

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

#### 表示イメージ

```
ID       | Title                          | Planned    | Actual     | Status  
---------+--------------------------------+------------+------------+-------------
ed091db3 | new task                       | 120 min    | 1 min      | completed
96926cbb | スーパーに買い物に行く             | 120 min    | 64 min     | in_progress
a16179c0 | new task3                      | 10 min     | -          | pending 
```

- `ID` … タスクIDの先頭8文字
- `Title` … タスク名
- `Planned` … 予定時間（分）
- `Actual` … 実績時間（分、未着手は「-」）
- `Status` … タスクの状態（pending, in_progress, completed など）

### 7. タスクデータの全削除

```sh
tasklog clear
```

---

## フィルター機能

`list` コマンドでは、さまざまなフィルターオプションを指定してタスクを絞り込むことができます。

- **ステータスで絞り込み**  
  `--status` オプションでカンマ区切り指定が可能です。  
  例:  
  ```sh
  tasklog list --status=pending,completed
  ```

- **タイトルで部分一致検索**  
  `--title` オプションでタイトルに含まれる文字列で絞り込みます。  
  例:  
  ```sh
  tasklog list --title=開発
  ```

- **予定時間で絞り込み**  
  `--plannedMinutes` オプションで指定した分数以下のタスクのみ表示します。  
  例:  
  ```sh
  tasklog list --plannedMinutes=30
  ```

- **予定時間超過タスクのみ表示**  
  `--overtime=true` で予定時間を超過したタスクのみ表示します。  
  例:  
  ```sh
  tasklog list --overtime=true
  ```

複数のフィルターを組み合わせて使うことはできません。

---

## 注意事項

- タスクデータやログはカレントディレクトリのJSONファイルとして保存されます。
- タスクIDは`list`コマンドで確認できます（先頭数文字でも指定可能）。
- 複数の環境で利用する場合はデータファイルの同期にご注意ください。

---

## ライセンス

MIT
