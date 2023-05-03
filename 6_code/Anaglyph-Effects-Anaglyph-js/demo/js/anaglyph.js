
// JavaScript Document
$(window).load(function(){
	
	$('#2d3dswitch').change(function(){
		
		if($(this).is(':checked')){
//			toggle Switch
			$('p.switch-text').text("3D");

			// anaGraph Plugin Demo
			$('main').anaGlyph();
		} else {
//			alert("2Dになります。");
			location.reload();
		}
	});
});
