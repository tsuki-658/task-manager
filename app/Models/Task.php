<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    
    use HasFactory;

    protected $fillable = ['subject', 'class_name', 'creator_id'];

    // The teacher/admin who created the task
    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    // Subtasks of this task
    public function subTasks()
    {
        return $this->hasMany(SubTask::class);
    }
}
