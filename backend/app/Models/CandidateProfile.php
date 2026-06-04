<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CandidateProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'resume_path',
        'skills',
        'experience',
        'education',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
