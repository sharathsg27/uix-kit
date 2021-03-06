/* 
 *************************************
 * <!-- Loader -->
 *************************************
 */
APP = ( function ( APP, $, window, document ) {
    'use strict';
	
    APP.LOADER               = APP.LOADER || {};
	APP.LOADER.version       = '0.0.2';
    APP.LOADER.documentReady = function( $ ) {

		// Disable devices scaling
		//-------------------------------------	
		document.addEventListener( 'touchstart', function (event) {
			if(event.touches.length>1){
				event.preventDefault();
			}
		});
		
		var lastTouchEnd=0;
		document.addEventListener( 'touchend', function (event) {
			var now=(new Date()).getTime();
			if( now-lastTouchEnd <= 300 ){
				event.preventDefault();
			}
			lastTouchEnd=now;
		},false);
		
		
		
		// Loader Process
		//-------------------------------------	
		$( 'body' ).waitForImages().progress( function( loaded, count, success ) {
			
			var per = parseInt( loaded/(count-1) * 100 );
			
			if ( $( 'img' ).length <= 1 ) {
				per = 100;
			}
			
			if ( isNaN( per ) ) per = 100;
			
			$( '.uix-loader-progress span' ).text( per + '%' );
			
			
		}).done( function() {
			
			//Event after loading is complete
			
			
			// Remove loader
			TweenMax.to( '.uix-loader, .uix-loader-progress', 0.5, {
				css: {
					opacity : 0,
					display : 'none'
				}
			});
							
			
			

		});    
		
    };

    APP.components.documentReady.push( APP.LOADER.documentReady );
    return APP;

}( APP, jQuery, window, document ) );



			