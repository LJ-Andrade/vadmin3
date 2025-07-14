<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class CleanOrphanedMedia extends Command
{
    protected $signature = 'media:clean-orphaned';
    protected $description = 'Clean orphaned media records that have no physical files';

    public function handle()
    {
        $this->info('Searching for orphaned media records...');
        
        $orphaned = Media::all()->filter(function($media) {
            return !file_exists($media->getPath());
        });
        
        $this->info("Found {$orphaned->count()} orphaned media records.");
        
        if ($orphaned->count() > 0) {
            if ($this->confirm('Do you want to delete these orphaned records?')) {
                $orphaned->each(function($media) {
                    $this->line("Deleting media ID: {$media->id} - Path: {$media->getPath()}");
                    $media->delete();
                });
                
                $this->info('Orphaned media records cleaned successfully!');
            }
        } else {
            $this->info('No orphaned media records found.');
        }
        
        return 0;
    }
}
