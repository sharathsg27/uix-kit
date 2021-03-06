/* 
 *************************************
 * <!-- Team Focus -->
 *************************************
 */
APP = ( function ( APP, $, window, document ) {
    'use strict';
	
    APP.TEAM_FOCUS               = APP.TEAM_FOCUS || {};
	APP.TEAM_FOCUS.version       = '0.0.2';
    APP.TEAM_FOCUS.documentReady = function( $ ) {

		var teamFocusContent = '.uix-team-focus',
			teamFocusMask    = '.uix-team-focus__mask';
			
			
		$( teamFocusContent ).each( function() {
			var $this           = $( this ),
				thisID          = 'uix-team-focus-' + UIX_GUID.newGuid(),
				hoverWidth      = $this.data( 'hover-width' ),
				targetWidth     = $this.data( 'target-width' ), // Div over width as a percentage 
				targetInfo      = $this.data( 'target-info' ), // Corresponding character details display
				closeBtn        = $this.data( 'close-btn' ),
				el              = '#' + thisID + '> div',
				total           = 0;
			
			
			
			$this.attr( 'id', thisID );
			
		
			if( typeof hoverWidth === typeof undefined ) {
				hoverWidth = 20;
			}	
			
			if( typeof targetWidth === typeof undefined ) {
				targetWidth = 80;
			}	
			
			if( typeof closeBtn === typeof undefined ) {
				closeBtn = '.close';
			}
			
			if( typeof targetInfo === typeof undefined ) {
				targetInfo = '.uix-team-focus__info';
			}		
		
			total = $( el ).length;
		

			TweenMax.set( el, {
				width: 100/total + '%'
			});
			
			
			//Add an index to each item
			$( el ).each( function( index )  {
				$( this ).attr( 'data-index', index );
			});
			

			//Create item hover overlay effects
			$( el ).on( 'mouseenter', function() {

				var $cur      = $( this ),
					$neighbor = $cur.siblings().not( '.focus' ); //Get the siblings of each element in the set of matched elements

				TweenMax.to( $cur, 0.3, {
					width: hoverWidth + '%'
				});

				TweenMax.to( $neighbor, 0.3, {
					width: ( 100 - hoverWidth )/( total - 1 ) + '%'
				});

			} );

			
			//Display the target item
			$( document ).on( 'click', el, function( e ) {
				e.preventDefault();

				var $cur        = $( this ),
					$neighbor   = $cur.siblings(), //Get the siblings of each element in the set of matched elements
					$cloneItem  = $cur.clone();
				
				//The mask prevent click and hover
				$( teamFocusMask ).show();
				
				$( el ).removeClass( 'active' );
				$cur.addClass( 'active' );
				
				
				
				var $info   = $( targetInfo ),
					cName   = $cur.data( 'name' ),
					cPo     = $cur.data( 'po' ),
					cIntro  = $cur.data( 'intro' );
					
				TweenMax.set( $info, {
					css: {
						opacity : 0,
						display : 'none'
					},
					onComplete : function() {
						
						TweenMax.to( this.target, 0.5, {
							css: {
								opacity    : 1,
								display    : 'block'
							}
						});		
						
					}
				});
				
				
				$info.find( 'h4 strong' ).html( cName );
				$info.find( 'h4 em' ).html( cPo );
				$info.find( '.uix-team-focus__info__text' ).html( cIntro );
				

				if ( !$cur.hasClass( 'focus' ) ) {
					$( el + '.focus' ).remove();


					TweenMax.set( $cloneItem, {
						alpha      : 0,
						onComplete : function() {

							this.target
								.prependTo( '#' + thisID )
								.addClass( 'focus' );

						}
					});

					TweenMax.to( el, 0.3, {
						alpha      : 1
					});


					TweenMax.to( $cur, 0.3, {
						alpha : 0
					});
					
					TweenMax.to( $neighbor, 0.3, {
						alpha : 0.3
					});
				}



			});

			
			//Close the focus item
			$( document ).on( 'click', el + '.focus, ' + closeBtn + ', ' + targetInfo + ', ' + teamFocusMask, function( e ) {
				e.preventDefault();
				
				//Remove the mask
				$( teamFocusMask ).hide();
				
				TweenMax.to( el, 0.3, {
					width : 100/total + '%',
					ease  : Back.easeOut
				});

				TweenMax.to( el + '.focus', 0.3, {
					alpha : 0,
					onComplete : function() {

						$( el + '.focus' ).remove();
						TweenMax.to( el, 0.3, {
							alpha : 1
						});
					}
				});

				
				var $info = $( targetInfo );
				TweenMax.to( $info, 0.5, {
					css: {
						opacity : 0,
						display : 'none'
					}
				});	
				
				$info.find( 'h4 strong' ).html( '' );
				$info.find( 'h4 em' ).html( '' );
				$info.find( '.uix-team-focus__info__text' ).html( '' );		


			});	
			
			
			
		});	


		
    };

    APP.components.documentReady.push( APP.TEAM_FOCUS.documentReady );
    return APP;

}( APP, jQuery, window, document ) );




