# 📬 Ai32

> [!NOTE]
> This is created by me for me

![img](/public/lp/img3.png "スクリーンショット")

## Feature

- ワンクリックで `@i32.jp`のメールアドレスが使える
- AIによるメールボックスの要約

  - AIがメールボックスにあるメールを要約して重要なメールを見逃しません!
- シンプルなUI

  - シンプルなUIで余計な情報をそぎ落とし、ユーザーに迷いを与えません!

## TODO

* [X] メール送信
* [X] メール作成のテンプレート
* [X] android端末において、emailがfetchされない、もしくは描写されない
* [X] 擬似的な動的ルーティング
  * [X] Cloudflare Dynamic Redirectを使う
    1. `wildcard_replace(http.request.full_uri, "/email/*", "/email?id=${1}")`
    2. `wimdow.history.pushState("/email/${id}")`
* [ ] Backend非依存化
  * [ ] 毎時Github Actionでjson fileの生成
  * [ ] Clientからそのjson fileをfetchする
* [ ] デザイン変える
  * [ ] メールを開くときにサイドバー的なので開いて一気に見やすくする

## よくわからないはなし

さて、一応ファイル構成や技術スタックを説明しておきます

**ファイル構造**

- `index.html`, `email.html`

  - `email.html`は現時点で使ってないので置いといて、これらのファイルは何もしませんただ
    いわゆる `static`なサイトだと.htmlではないとサイトを表示できないから使っているだけです
    この後の為に少しコードの説明を

    ```html
    <meta name="loadscript" src="/pages/inbox.js">
    <meta name="loadpage" src="/inbox.html">
    <script type="module" src="./src/dom/init.js"></script>
    ```

    `html`は基本的に `init.js`を読み込ませるためだけのファイルです
    `init.js`でページ間の移動の制御や `meta`に書いてある `/pages/index.js`などを読み込みを行います
- `src`

  - Ai32は基本的にhtmlを使いません、全て `Virtual DOM`でできています、つまり `DOM`は全てjsのobjectです
    それは `html`よりも `js`の方が優れていて、管理が楽であるという思想からきています
    今回はライブラリが使えない為  `src/dom/virtualdom.js`が基本的に全て行なっているので見てみてください
    ちゃんと0から作っています ~~別ワークスペースで作ってたからほぼ1コミット目で完成してるけど~~
- `pages`

  - `html`の代わりに作成された `js`が入っています
    `react`などのフレームワークを触っていれば理解できるはずです~~そうであってほしい~~
- `hook`, `components`

  - `react`使いなら説明不要ですね!

**技術スタック**

- vanilla js
- vanilla html
- vanilla css

### 与太話

- テストコードを書こうと思ったのですが、テストする場所も特にないし、`vanilla`だとuiのテストなどがとてつもなく面倒なので諦めました
- それと、みんなも `vanilla`で書く必要が出てきたらとりあえず `virtual dom`を実装しよう、楽だよ、`html`だったら動的に要素を追加したりとかめんどいけど `js`だったら一瞬だよ、何も考えなくていい
- メールがある程度すでに届いてるアカウントが必要なら `newsletters` ( `newsletters@i32.jp` )をお使いください
