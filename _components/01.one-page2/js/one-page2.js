/* 
 *************************************
 * <!-- Full Page/One Page Transition 2 -->
 *************************************
 */
APP = ( function ( APP, $, window, document ) {
    'use strict';
	
    APP.ONEPAGE2               = APP.ONEPAGE2 || {};
	APP.ONEPAGE2.version       = '0.0.1';
    APP.ONEPAGE2.documentReady = function( $ ) {

        var $window      = $( window ),
		    windowWidth  = $window.width(),
		    windowHeight = $window.height();

		
	    //Determine the direction of a jQuery scroll event
		//Fix an issue for mousewheel event is too fast.
		var lastAnimation      = 0,
			quietPeriod        = 500, //Do not change it
			animationTime      = 1000,//According to page transition animation changes
			$sectionsContainer = $( '.uix-noemal-load__onepage-container2' ),
			$sections          = $sectionsContainer.find( '> section' ),
			sectionTotal       = $sections.length,
			topSectionSpacing  = 0,
			$primaryMenu       = $( '.uix-menu' ),
			$sidefixedMenu     = $( '.uix-menu-sidefixed' );
		
		
		//Prevent this module from loading in other pages
		if ( $sectionsContainer.length == 0 ) return false;
		
		
		//Init the sections style
		$sectionsContainer.css({
			'position' : 'relative'
		});
		
		var secIndex = 10;
		for ( var i = 0; i < sectionTotal; i++ ) {
			
			$sections.eq( i ).css({
				'position' : 'absolute',
				'width'    : '100%',
				'z-index'  : secIndex,
				'top'      : 0,
				'left'     : 0
			});		
			
			secIndex--;
			
			
		}
		
		


		// Prepare everything before binding wheel scroll
		$.each( $sections, function( i ) {
			$( this ).attr( 'data-index', i );
			if ( i == 0 ) {
				$( this ).addClass( 'active' );

			}
			
		});
		

		//Init the section location
		sectionStart();

		//Detect URL change
		$( window ).on( 'hashchange', function(){
			var hash = window.location.hash,
				locArr,
				loc;

			if ( hash ) {

				//Add hashchange event
				locArr = hash.split( 'section-' );
				loc    = locArr[1];
				moveTo( $sectionsContainer, false, loc );
			}
			
		} );
		
		
		
		
		
		/*
		 * Init the section location
		 *
		 * @return {Void}                - The constructor.
		 */
		function sectionStart() {
	
			setTimeout( function() {
				var hash = window.location.hash,
					locArr,
					loc, 
					curTab;

				if ( hash ) {
					
					//Add hashchange event
					locArr = hash.split( 'section-' );
					loc    = locArr[1];
					moveTo( $sectionsContainer, false, loc );
				} else {
					moveTo( $sectionsContainer, false, 1 );
				}

			}, quietPeriod );

		}
			
		

		/*
		 * Initialize the depth of all sections
		 *
		 * @param  {Number} nextIndex        - Index of next section.
		 * @param  {Number} currentIndex     - Index of current section.
		 * @return {Void}                    - The constructor.
		 */
		function sectionsDepthInit( nextIndex, currentIndex ) {
	
			var secIndex = 10;
			
			for ( var i = 0; i < sectionTotal; i++ ) {

				if ( nextIndex && i != nextIndex && i != currentIndex ) {
					$sections.eq( i ).css( 'z-index', secIndex );
				}
				 
				secIndex--;

			}
			
			
		}
		
		
		
		
		/*
		 * Scroll initialize
		 *
		 * @param  {Object} event        - The wheel event is fired when a wheel button of a pointing device (usually a mouse) is rotated. 
		 * @param  {String} dir          - Gets a value that indicates the amount that the mouse wheel has changed.
		 * @return {Void}                - The constructor.
		 */
		function scrollMoveInit( event, dir ) {
	
			var timeNow = new Date().getTime();
			// Cancel scroll if currently animating or within quiet period
			if( timeNow - lastAnimation < quietPeriod + animationTime) {
				event.preventDefault();
				return;
			}

			if ( dir == 'down' ) {
				//scroll down
				moveTo( $sectionsContainer, 'down', false );
				
			} else {
				//scroll up
				moveTo( $sectionsContainer, 'up', false );
				
			  
			}
			lastAnimation = timeNow;
		}
		
      
		
		/*
		 * Move Animation
		 *
		 * @param  {Object} el           - The container of each sections.
		 * @param  {String} dir          - Rolling direction indicator.
		 * @param  {Number} hashID       - ID of custom hashchange event.
		 * @return {Void}                - The constructor.
		 */
		function moveTo( el, dir, hashID ) {
			var index     = parseFloat( $sections.filter( '.active' ).attr( 'data-index' ) ),
				nextIndex = null,
				$next     = null,
				isNumeric = /^[-+]?(\d+|\d+\.\d*|\d*\.\d+)$/;
			
			
			if ( dir == 'down' || dir === false ) {
				nextIndex = index + 1;
			} else {
				nextIndex = index - 1;
			}
			
			//ID of custom hashchange event
			if ( isNumeric.test( hashID ) ) nextIndex = parseFloat( hashID - 1 );
			
			
			if ( nextIndex <= parseFloat( sectionTotal-1 ) && nextIndex >= 0 ) {
				
				if ( nextIndex > parseFloat( sectionTotal-1 ) ) nextIndex = parseFloat( sectionTotal-1 );
				if ( nextIndex < 0 ) nextIndex = 0;


				//Returns the target section
				$next = $sections.eq( nextIndex );

				if ( $next.length > 0 ) {

					TweenMax.set( $next, {
						css: {
							'z-index' : 12,
							'top'     : ( dir == 'down' || dir === false ) ? windowHeight : -windowHeight
						},
						onComplete: function() {

							//Reset sections z-index
							$sections.eq( index ).css( 'z-index', 11 );
							sectionsDepthInit( nextIndex, index );


							TweenMax.to( $sections.eq( index ), animationTime/1000, {
								css: {
									'top'     : ( dir == 'down' || dir === false ) ? -windowHeight/2 : windowHeight/2
								},
								ease: Power2.easeOut
							});		



							TweenMax.to( this.target, animationTime/2000, {
								css: {
									'top'     : 0
								},
								ease: Power2.easeOut,
								onComplete: function() {


									$sections.removeClass( 'leave' );
									$sections.eq( index ).addClass( 'leave' );

									$sections.removeClass( 'active' );
									$next.addClass( 'active' ).removeClass( 'leave' );



									//Changing The Site URL
									var curSectionIndex = $sections.filter( '.active' ).index() + 1,
										href            = window.location.href.substr( 0, window.location.href.indexOf( '#' ) ) + '#' + $sections.filter( '.active' ).attr( 'id' );

									
									// Save state on history stack
									// - First argument is any object that will let you restore state
									// - Second argument is a title (not the page title, and not currently used)
									// - Third argument is the URL - this will appear in the browser address bar
									history.pushState( {}, document.title, href );
									console.log( 'Section ' + curSectionIndex + ' loaded!' );

									// Highlight element when related content
									getAllNavigation( $primaryMenu ).removeClass( 'active' );
									getAllNavigation( $sidefixedMenu ).removeClass( 'active' );
									$primaryMenu.find( 'li' ).eq( nextIndex ).addClass( 'active' );
									$sidefixedMenu.find( 'li' ).eq( nextIndex ).addClass( 'active' );



								}
							});			

						}
					});



				}		
				
				
			}
			
			


			
	
			
		}
		
		
		
		/* 
		 ====================================================
		 *  Navigation Interaction
		 ====================================================
		 */
		goPageSection( $primaryMenu );
		goPageSection( $sidefixedMenu );

	
		//Activate the first item
		$primaryMenu.find( 'li:first' ).addClass( 'active' );
		$sidefixedMenu.find( 'li:first' ).addClass( 'active' );

		
		/*
		 * Get section or article by href
		 *
		 * @param  {String|Object} el  - The current selector or selector ID
		 * @return {Object}             - A new selector.
		 */
        function getRelatedContent( el ) {
            return $( $( el ).attr( 'href' ) );
        }

		
		/*
		 * Get all links by section or article
		 *
		 * @param  {Object} menuObj     - Returns the menu element within the document.
		 * @return {Object}             - A new selector.
		 */
        function getAllNavigation( menuObj ) {
            return menuObj.find( 'li' );
        } 	
		
		
		/*
		 * Smooth scroll to content
		 *
		 * @param  {Object} menuObj     - Returns the menu element within the document.
		 * @return {Void}               - The constructor.
		 */
        function goPageSection( menuObj ) {
			menuObj.find( 'li > a' ).on( 'click', function(e) {
				e.preventDefault();
				
				if ( $( this ).parent().hasClass( 'active' ) ) return false;
				
			
				var dir = 'down';
				
				if ( $sections.filter( '.active' ).index() > $( this ).parent().index() ) {
					dir = 'up';
				}
				moveTo( $sectionsContainer, dir, $( this ).parent( 'li' ).index() + 1 );
				
				
			});	
	
        } 	
        
	
		
		/* 
		 ====================================================
		 *  Mouse Wheel Method
		 ====================================================
		 */
		$( document ).on( 'wheel', function( e ) { 

			var dir;
			//Gets a value that indicates the amount that the mouse wheel has changed.
			var delta = e.originalEvent.deltaY;
			
			if( delta > 0 ) { 
				//scroll down
				dir = 'down';
				
			} else {
				//scroll up
				dir = 'up';
			}
			
			scrollMoveInit( e, dir );
			
			//prevent page fom scrolling
			return false;

		});
		
		
		/* 
		 ====================================================
		 *  Touch Method
		 ====================================================
		 */
			
		var startX,
			startY;


		$sectionsContainer.on( 'touchstart.ONEPAGE2', function( event ) {
			var touches = event.originalEvent.touches;
			if ( touches && touches.length ) {
				startX = touches[0].pageX;
				startY = touches[0].pageY;


				$sectionsContainer.on( 'touchmove.ONEPAGE2', function( event ) {

					var touches = event.originalEvent.touches;
					if ( touches && touches.length ) {
						var deltaX = startX - touches[0].pageX,
							deltaY = startY - touches[0].pageY;

						if ( deltaX >= 50) {
							//--- swipe left


						}
						if ( deltaX <= -50) {
							//--- swipe right
						


						}
						if ( deltaY >= 50) {
							//--- swipe up
							moveTo( $sectionsContainer, 'down', false );

						}
						if ( deltaY <= -50) {
							//--- swipe down
							moveTo( $sectionsContainer, 'up', false );
							

						}
						if ( Math.abs( deltaX ) >= 50 || Math.abs( deltaY ) >= 50 ) {
							$sectionsContainer.off( 'touchmove.ONEPAGE2' );
						}
					}

				});
			}	
		});

		
		
    };

    APP.components.documentReady.push( APP.ONEPAGE2.documentReady );
    return APP;

}( APP, jQuery, window, document ) );


