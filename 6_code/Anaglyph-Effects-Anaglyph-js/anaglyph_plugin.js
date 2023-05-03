
;(function( $ ) {
    $.fn.anaGlyph = function(params) {
		
		// Default Parameters
		var defs = {
			Depth3D: '24px'
		};
		var config = $.extend({}, defs, params);
		
		$(this).wrapInner("<div class='anaGlyph-wrapper'></div>");
		
		$(this).find('img').each(function(){
			$(this).wrap("<div></div>");
				
			var src = 'url(./' + $(this).attr('src') + ')';
			var width = $(this).css('width');
			var height = $(this).css('height');
			var margin = $(this).css('margin');
			$(this).parent().css("background-image",src);
			$(this).parent().css("background-size","cover");
			$(this).parent().css("width",width);
			$(this).parent().css("height",height);
			$(this).parent().css("margin",margin);	
			$(this).css("display","none");
		});
						
		$(".anaGlyph-wrapper").wrapInner("<div class='anaGlyph-bg'></div>");
		$(".anaGlyph-bg").clone().insertAfter(".anaGlyph-bg").addClass('anaGlyph-r').removeClass('anaGlyph-bg');
		
		// anaGlyph Left Eyes (Red)
		$('.anaGlyph-r *').each(function(){changeRgba($(this), 255, 0, 0);});
		// anaGlyph Right Eyes (Cyan)
		$('.anaGlyph-bg *').each(function(){changeRgba($(this), 0, 255, 255);});
		
			// Layout
			// Mapping R Dimension and BG Dimension
		
			var wrapperHeight = $(".anaGlyph-bg").css("height");
			var wrapperWidth = (parseInt($(".anaGlyph-bg").css("width"),10) + parseInt(config.Depth3D,10)) + "px";

			$(".anaGlyph-wrapper").css({'height':wrapperHeight, 'width':wrapperWidth, 'position':'relative'});
			$(".anaGlyph-bg").css({'position':'absolute'});
			$(".anaGlyph-r").css({'position':'absolute'});

			$('.anaGlyph-r').css({"top":'0px',"left":'0px',"opacity":'0.25'});
			$('.anaGlyph-bg').css({"top":'0px',"left":config.Depth3D,"opacity":'1'});		

		// thisを返す
        return this;
    };
})( jQuery );

function changeRgba($selector, $red, $green, $blue) {
				
				$rgba = "rgba(" + $red + "," + $green + "," + $blue + ",1)";

				if ($selector.css("background-image") !== 'none'){
					// Use backgtound-blend-mode with setting R channel filter
					$selector.css({'background-color':$rgba,'background-blend-mode': 'lighten'});
				} else {
					// No Background Imange -> need to calculate RGB (R:+255, G:+0, B:+0)
					if ($selector.css("background-color") !== 'rgba(0, 0, 0, 0)'){
						var bgColor = $selector.css("background-color");
						bgColor = bgColor.replace("rgba(","");
						bgColor = bgColor.replace("rgb(","");
						bgColor = bgColor.replace(")","");
						bgColor = bgColor.split(",");
						bgColor[0] = Math.min(255, parseInt(bgColor[0]) + $red);
						bgColor[1] = Math.min(255, parseInt(bgColor[1]) + $green);
						bgColor[2] = Math.min(255, parseInt(bgColor[2]) + $blue);
						var bgColorVal = "rgba(" + bgColor[0] + "," + bgColor[1] + "," + bgColor[2] + ",1)";
						$selector.css({'background-color':bgColorVal});
					}
				}
			
				// Font Color Change
				var fontColor = $selector.css("color");
				fontColor = fontColor.replace("rgba(","");
				fontColor = fontColor.replace("rgb(","");
				fontColor = fontColor.replace(")","");
				fontColor = fontColor.split(",");
				fontColor[0] = Math.min(255, parseInt(fontColor[0]) + $red);
				fontColor[1] = Math.min(255, parseInt(fontColor[1]) + $green);
				fontColor[2] = Math.min(255, parseInt(fontColor[2]) + $blue);
				var fontColorVal = "rgba(" + fontColor[0] + "," + fontColor[1] + "," + fontColor[2] + ",1)";
				$selector.css({'color':fontColorVal});
}
