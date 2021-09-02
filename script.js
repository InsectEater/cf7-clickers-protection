jQuery( document ).ready( function() {
    let $form = jQuery( 'form.cf7cp-enabled' );
    if ( ! $form.length ) {
        return;
    }

    //Since the form submit event is not compatible with wpcf7, we count on the submit button clicking
    $form.find( '.wpcf7-submit' ).click (function( event ) {
        let $form = jQuery( this ).closest( 'form.cf7cp-enabled' );

        //Form is submitting right now, so we do not allow the submit requested
        if ( $form.hasClass( 'cf7cp-submitting' ) ) {
            cf7cp_dispatch_custom_event( 'cf7cpSubmitIgnored', $form )
            event.preventDefault();
            return false;
        }

        //Form is not submitting right now, add protection class
        $form.addClass( 'cf7cp-submitting', true );
        cf7cp_dispatch_custom_event( 'cf7cpProtectionAdded', $form )
    });

    /**
     * Triggers custom events
     * 
     * @param {string} eventName    The name of the event to be triggered
     * @param {object} element      The jquery form object which triggers the event
     * @since Version 1.0.0
     */
    function cf7cp_dispatch_custom_event( eventName, element ) {
        const cf7cp_event = new CustomEvent( eventName, {
            bubbles: true,
            detail: {
                form: element
            }
        });
        element[0].dispatchEvent( cf7cp_event );
    }

    /**
     * Removes the submit protection from a form
     * 
     * @param {object} event The event passed from wpcf7 DOM events
     * @since Version 1.0.0
     */
    function cf7cp_allow_submit( event ) {
        if ( ! event.detail.unitTag ) {
            return;
        }

        let $form = jQuery( '#' + event.detail.unitTag + ' form.cf7cp-enabled' );
        $form.removeClass( 'cf7cp-submitting' );

        cf7cp_dispatch_custom_event( 'cf7cpProtectionRemoved', $form );
    }
    
    document.addEventListener( 'wpcf7invalid', cf7cp_allow_submit );
    document.addEventListener( 'wpcf7mailsent', cf7cp_allow_submit );
    document.addEventListener( 'wpcf7mailfailed', cf7cp_allow_submit );
});
