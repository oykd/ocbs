
/*
	OCBS 
		© 2018 onyokneesdog
		
	last edit: 02.07.2018	
	*using lackey.js
*/



(function($) {

/* Initialization -- */
$(document).ready(function() {
	/* For each structure */
	/*
	$('div.ocbs').each(function() {
		$(this).ocbs();
	})
	;
	*/	
	
	/* Ordinary */
	var settings = {
		controlPanelId: 'ocbs-panel',
		min: '0,350,500|0|0,0',
		proportion: '33.33,33.33,33.33|100|30,70',
		useCookies: true
	}
	$('#ocbs-structure').ocbs(settings);
});

$.fn.ocbs = function(settings) {

	/* Settings */
	var structure = this;
	var structureId = $(structure).attr("id");	
	var defaults = {
		controlPanelId: 'ocbs-panel',
		useCookies: false,
		cookiePrefix: 'ocbs',
		midget: 100,
		height: '',
		proportion: '',
		min: '',
		display: '',
		refreshOnResize: true,
		toggleCssType: ''
	}
	settings = $.extend(true, {}, defaults, settings);
	var lock = false;
	var mainWidth = $(structure).width();
	
	/* Set default arrays & add sticks*/
	var l = $(structure).find('.ocbs-row');	
	var elevation = new Array(l.length);
	var blockProportion = new Array(l.length);
	var blockMinWidth = new Array(l.length);
	var blockDisplay = new Array(l.length);	
	for (var i = 0; i < l.length; i++) {
		elevation[i] = settings.midget;
		var b = $(l[i]).find('.ocbs-block');
		blockProportion[i] = new Array(b.length);
		blockMinWidth[i] = new Array(b.length);
		blockDisplay[i] = new Array(b.length);
		for (var j = 0; j < b.length; j++) {
			blockProportion[i][j] = Math.round(1 / b.length * 10000) / 100;
			blockMinWidth[i][j] = 0;
			blockDisplay[i][j] = 1;
		}
		/* Add sticks */
		var tdiv = $('<div></div>');
		$(tdiv).addClass('ocbs-stick');
		$(tdiv).css('float', 'left');
		$(tdiv).css('width', '0px');
		$(tdiv).css('height', settings.midget + 'px');
		$(l[i]).append(tdiv);
	}
	
	/* Change arrays from settings */
	elevation 			= (settings.height != '') 			? Lackey.stringToMatrix(settings.height) 		: elevation;
	blockProportion 	= (settings.proportion != '') 	? Lackey.stringToMatrix(settings.proportion) : blockProportion;
	blockMinWidth 		= (settings.min != '') 				? Lackey.stringToMatrix(settings.min) 			: blockMinWidth;
	blockDisplay 		= (settings.display != '') 		? Lackey.stringToMatrix(settings.display) 	: blockDisplay;
	
	/* Read cookies */	
	if (settings.useCookies)
	{
		var s = Lackey.readCookie(settings.cookiePrefix + '_blockDisplay', '');
		blockDisplay = (s != '') ? Lackey.stringToMatrix(s) : blockDisplay;
	}
	
	/* 1st Repaint everything */
	refreshStructure();
	
	/* Closing */
	$(this).find('.ocbs-close').click(function() {
	
		if (lock) return false;
		lock = true;
		
		/* Refresh display array */	
		var x = $(this).parents('.ocbs-row').find('.ocbs-block').index($(this).parents('.ocbs-block'));
		var y = $(structure).find('.ocbs-row').index($(this).parents('.ocbs-row'));
		var n = $(structure).find('.ocbs-block').index($(this).parents('.ocbs-block'));
		blockDisplay[y][x] = 0;
		if (settings.useCookies)
			Lackey.createCookie(settings.cookiePrefix + '_blockDisplay', Lackey.matrixToString(blockDisplay), 3600);
			
		/* Animations */
		var toggle = $('#' + settings.controlPanelId).find('.ocbs-toggle').eq(n);
		var block = $(this).parents('.ocbs-block'); 
		var stick = $(structure).find('.ocbs-stick').eq(y);
		/* Stage I */
		$(toggle).css('visibility', 'visible');
		$(toggle).animate({ opacity: 1 }, 500);
		$(block).animate({ opacity: 0 }, 300);
		/* Stage II */
		window.setTimeout(function() {
			$(block).stop(true, true);
			var tdiv = $('<div></div>');
			$(tdiv).attr('id', 'ocbs-temp');
			$(tdiv).css('float', 'left');
			$(tdiv).css('height', '1px');
			$(block).after(tdiv);
			$(tdiv).css('width', $(block).outerWidth());
			$(block).css('display', 'none');
			$(tdiv).animate({	width: 0	}, 300);
		}, 300);
		/* Stage III */
		window.setTimeout(function() {
			$('#ocbs-temp').stop(true, true);
			$('#ocbs-temp').remove();
			$(toggle).stop(true,true);
			var t = 0;
			for (var i = 0; i < blockDisplay[y].length; i++)
				t = t + blockDisplay[y][i];
			if (t == 0){
				$(stick).animate({ height: 0 }, 300);
			}else{
				//animateTrains(z, z + 1);
			}
		}, 600);
		/* Stage IV */
		window.setTimeout(function() {
			$(stick).stop(true, true);
			rebuildRow(x, y);
			lock = false;
		}, 900);
		
	});
	
	/* Opening */
	$('#' + settings.controlPanelId).find('.ocbs-toggle').click(function() {
	
		if (lock) return false;
		lock = true;
		var n = $('#' + settings.controlPanelId).find('.ocbs-toggle').index(this);
		var block = $(structure).find('.ocbs-block').eq(n);
		
		/* Refresh display array */
		var x = $(block).parents('.ocbs-row').find('.ocbs-block').index(block);
		var y = $(structure).find('.ocbs-row').index($(block).parents('.ocbs-row'));	
		blockDisplay[y][x] = 1;
		if (settings.useCookies)
			Lackey.createCookie(settings.cookiePrefix + '_blockDisplay', Lackey.matrixToString(blockDisplay), 3600);	
		
		/* Animations */
		var toggle = this;
		var stick = $(structure).find('.ocbs-stick').eq(y);
		/* Stage I */
		$(toggle).animate({ opacity: 0 }, 350);
		var t = 0;
		for (var i = 0; i < blockDisplay[y].length; i++)
			t = t + blockDisplay[y][i];
		if (t == 1){
			var stickHeight = elevation[y] + getVerEdge(block);
			$(stick).animate({ height: stickHeight }, 300);
		}else{
			//animateTrains(z, z + 1);
		}
		/* Stage II */
		window.setTimeout(function() {
			$(stick).stop(true, true);
			$(toggle).stop(true, true);
			$(toggle).css('visibility', 'hidden');
			var tdiv = $('<div></div>');
			$(tdiv).attr('id', 'ocbs-temp');
			$(tdiv).css('float', 'left');
			$(tdiv).css('width', '0px');
			$(tdiv).css('height', '1px');
			var nw = rebuildRow(x, y);
			$(block).after(tdiv);
			$(tdiv).animate({	width: nw }, 200);
		}, 350);
		/* Stage III */
		window.setTimeout(function() {
			$('#ocbs-temp').stop(true, true);
			$('#ocbs-temp').remove();
			$(block).css('display', 'block');
			$(block).animate({ opacity: 1 }, 300);
		}, 550);
		/* Stage IV */
		window.setTimeout(function() {
			$(block).stop(true, true);
			lock = false;
		}, 900);
		
	});
	
	/* Get horizontal edges of element */
	function getHorEdge(b) {
		return parseFloat($(b).css('padding-left')) + parseFloat($(b).css('padding-right')) 
					+ parseFloat($(b).css('margin-left')) + parseFloat($(b).css('margin-right'))
					+ parseFloat($(b).css('border-left')) + parseFloat($(b).css('border-right'));
	}
	
	/* Get vertical edges of element */
	function getVerEdge(b) {
		return parseFloat($(b).css('padding-top')) + parseFloat($(b).css('padding-bottom')) 
					+ parseFloat($(b).css('margin-top')) + parseFloat($(b).css('margin-bottom'))
					+ parseFloat($(b).css('border-top')) + parseFloat($(b).css('border-bottom'));
	}	
	
	/* Generate & set new block widthes for specific row */
	function rebuildRow(x, y) {
	
		/* Lead-up */
		mainWidth = $(structure).width();
		var newBlockWidth;
		var row = $(structure).find('.ocbs-row').eq(y);
		var rowBlocks = $(row).find('.ocbs-block');
		var remainProportion = 0;
		var openedElementsCount = 0;
		for (var i = 0; i < rowBlocks.length; i++)
			if (blockDisplay[y][i] == 0)
				remainProportion += blockProportion[y][i];
			else
				openedElementsCount++;

		/* Set width percentage; get surplus & compressible place for each block */
		var surplus = 0;
		var compressible = new Array(rowBlocks.length);
		var percent = new Array(rowBlocks.length);
		for (var i = 0; i < rowBlocks.length; i++) {
			compressible[i] = 0;
			percent[i] = 0;
			var w = 0;
			var correction = 0; 
			var b = $(rowBlocks).eq(i);
			if (blockDisplay[y][i] == 1) {
				w = blockProportion[y][i] + Math.round(remainProportion / openedElementsCount * 100) / 100;
				if (mainWidth * w / 100 < blockMinWidth[y][i]) {
					var z = Math.round(blockMinWidth[y][i] / mainWidth * 10000) / 100;
					surplus += blockMinWidth[y][i] - mainWidth * w / 100;
					w = z;
				} else {
					compressible[i] = mainWidth * w / 100 - blockMinWidth[y][i];
				}
				percent[i] = w;
				$(b).width('calc(' + w + '% - ' + getHorEdge(b) + 'px)');
			} else {
				$(b).width('0%');
			}
			if (x == i) newBlockWidth = mainWidth * w / 100;
		}
		
		/* Admit surplus */ 
		while (surplus > 0.01 && Lackey.arraySum(compressible) > 0.01) {
			var c = Lackey.arrayCountElementsByRange(compressible, 0, 0);			
			for (var i = 0; i < compressible.length; i++) 
				if (compressible[i] > 0) {
					var part = surplus / c;
					part = (compressible[i] > part) ? part : compressible[i];
					var b = $(rowBlocks).eq(i);
					var w = Math.round((percent[i] - part / mainWidth * 100) * 100) / 100; 
					percent[i] = w;
					$(b).width('calc(' + w + '% - ' + getHorEdge(b) + 'px)');
					surplus -= part;
					compressible[i] -= part; 
					if (x == i) newBlockWidth = mainWidth * w / 100;
				}
		}
		
		return newBlockWidth;
	}
	
	/* Repaint everything */
	function refreshStructure() {
		var rows = $(structure).find('.ocbs-row');
		var sticks = $(structure).find('.ocbs-stick');
		var toggles = $('#' + settings.controlPanelId).find('.ocbs-toggle');
		var n = 0;
		for (var i = 0; i < rows.length; i++) {
			var blocks = $(rows[i]).find('.ocbs-block');
			$(blocks).height(elevation[i] + 'px');		
			rebuildRow(0, i);
			var t = 0;
			for (var j = 0; j < blocks.length; j++) {
				if (blockDisplay[i][j] == 1) {
					$(blocks[j]).css('display', 'block');
					$(toggles[n]).css('visibility', 'hidden');
					t++;
				} else {
					$(blocks[j]).css('display', 'none');
					$(toggles[n]).css('visibility', 'visible');
				}
				n++;
			}
			if (t > 0) {
				var stickHeight = elevation[i] + getVerEdge(blocks[0]);
				$(sticks[i]).height(stickHeight + 'px');
			} else {
				$(sticks[i]).height('0px');
			}
		}
	}
	
	/* Stretch & squeeze blocks correctly on window resize */
	$(window).resize(function() {
		if (settings.refreshOnResize)	refreshStructure();
	});
	
};

})(jQuery);


/*


function animateTrains(t1,t2){
	ww = window.innerWidth;
	if (ww < 1000) { ww = 1040; }
	$('#train'+t1).css('display', 'block');
	$('#train'+t2).css('display', 'block');
	$('#train'+t1).css('left', '0px');
	$('#train'+t2).css('left', '0px');
	$('#train'+t1).animate({
		left: Math.floor(ww * 0.9) - 50
	}, 350);
	$('#train'+t2).animate({
		left: Math.floor(ww * 0.9) - 50
	}, 350);
	window.setTimeout(function(){
		$('#train'+t1).css('display', 'none');
		$('#train'+t2).css('display', 'none');
	}, 350);
}


*/