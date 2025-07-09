<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class CleanMediaTempFiles extends Command
{
    protected $signature = 'media:clean-temp';
    protected $description = 'Limpia archivos temporales de medios';

    public function handle()
    {
        $this->info('Limpiando archivos temporales de medios...');
        
        // Limpiar directorio temporal de medios
        $tempPath = storage_path('media-library/temp');
        
        if (File::exists($tempPath)) {
            $this->info("Limpiando: {$tempPath}");
            File::cleanDirectory($tempPath);
        }
        
        $this->info('Limpieza de archivos temporales completada.');
        
        return Command::SUCCESS;
    }
}
