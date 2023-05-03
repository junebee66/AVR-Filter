# anaGlyph()
* jQuery Plugin for Anaglyph effect
* 3D effect by Red/Cyan Anaglyph glasses
* Easy to use : Just put Selector on API  

* アナグリフ（赤青メガネで見る立体画像）に変換するjQuery用のプラグイン。
* セレクタを指定するだけで、その部分がアナグリフになります。  

## Usages

__$("div").anaGlyph();__

* You can scale 3D effect with Depth3D parameter by (px).  Default set to 24px. Negative Number will result Dent 3D effect.
* 立体を大きくしたい場合は、Depth3Dで指定。デフォルトは、12px　。マイナスの数字で、凹んだ立体画像になる。

__$("div").anaGlyph({Depth3D:36px});__

* アナグリフ用の眼鏡は、市販されていますし、セロハンで作ることも可能です。

## Sample

    <!DOCTYPE html>
    <html lang="ja">
    <body>
    <main>
        <h1>anaGlyph Sample Code</h1>
    </main>

    <script type="text/javascript">
      $(window).load(function(){
          $('main').anaGlyph();
      });
    </script>
    <script type="text/javascript" src="anaglyph_plugin.js"></script>
    </body>
    </html>

## [Demo Page](http://takwd.com/anaglyph/demo)

