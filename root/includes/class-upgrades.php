<?php
// don't call the file directly
if ( !defined( 'ABSPATH' ) ) exit;

/**
 * Plugin Upgrade Routine
 *
 * @since 1.0.0
 */
class {%= prefix %}_Upgrades {

    /**
     * The upgrades
     *
     * @var array
     */
    private static $upgrades = array(
        // '1.0'    => 'updates/update-1.0.php',
    );

    /**
     * Get the plugin version
     *
     * @return string
     */
    public function get_version() {
        return get_option( '{%= function_prefix %}_version' );
    }

    /**
     * Check if the plugin needs any update
     *
     * @return boolean
     */
    public function needs_update() {

        // may be it's the first install
        if ( ! $this->get_version() ) {
            return false;
        }

        if ( version_compare( $this->get_version(), '{%= function_prefix %}_VERSION', '<' ) ) {
            return true;
        }

        return false;
    }

    /**
     * Perform all the necessary upgrade routines
     *
     * @return void
     */
    function perform_updates() {
        $installed_version = $this->get_version();
        $path              = trailingslashit( dirname( __FILE__ ) );

        foreach ( self::$upgrades as $version => $file ) {
            if ( version_compare( $installed_version, $version, '<' ) ) {
                include $path . $file;
                update_option( '{%= function_prefix %}_version', $version );
            }
        }

        update_option( '{%= function_prefix %}_version', '{%= function_prefix %}_VERSION' );
    }
}
new {%= prefix %}_Upgrades();
