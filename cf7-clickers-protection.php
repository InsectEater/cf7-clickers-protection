<?php
/**
* Plugin Name: CF7 Protection Against Nervous Clickers
* Plugin URI: http://bdwm.be/
* Description: Prevents a Contact Form to be sent multiple times before the initial submit finishes.
* For example because of fast multiple clicking on submit button
* Author: Gancho Donev
* Version: 1.0.0
* Author URI: https://www.facebook.com/gancho.donev
* Text Domain: cf7-clickers-protection
* License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/

if ( ! class_exists( 'CF7_Clickers_Protection' ) ) {
    class CF7_Clickers_Protection {
        public const VERSION = '1.0.0';
        
        /**
         * Init necessary hook handlers
         * 
         * @return void 
         * @since Version 1.0.0
         */
        public static function init() {
            add_filter( 'wpcf7_form_class_attr', [get_called_class(),  'add_protection_class'] );
            add_action( 'wp_enqueue_scripts', [get_called_class(),  'enqueue_scripts'] );
        }

        /**
         * Adds appropriate css class to the form if necessary
         *
         * @param string $wpcf7_class css class to be filtered
         * @since Version 1.0.0
         * @return string filtered form css class
         */
        public static function add_protection_class( $wpcf7_class ) {
            $form = WPCF7_ContactForm::get_current();
            if ( $form->is_true( 'clickers_protection' ) ) {
                return $wpcf7_class . ' ' . 'cf7cp-enabled';
            }
            return $wpcf7_class;
        }

        /**
         * Adds frontend logic
         *
         * @since Version 1.0.0
         * @return void
         */
        public static function enqueue_scripts() {
            wp_enqueue_script( 'cf7cp-script', plugin_dir_url( __FILE__ ) . 'script.js', array('jquery'), self::VERSION, true );
        }
    }

    CF7_Clickers_Protection::init();
}
