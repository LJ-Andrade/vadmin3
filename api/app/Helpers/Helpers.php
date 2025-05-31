<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Log;

abstract class DebugHelper {

    public static function ddJson( $data, $success = false, $status = 400, bool $log = false ) : string  {

        if( $log ) {
            self::log( $data, 'debug' );
        }

        return response()->json([
            'success' => $success,
            'message'    => $data,
        ], $status);

    }

    public static function log( $data, $context ) : void {
        Log::debug( $data, $context );
    }

}