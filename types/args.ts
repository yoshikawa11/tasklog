export interface Args {
  _: (string | number)[];
  [key: string]: unknown; // 名前付きオプション引数
}
