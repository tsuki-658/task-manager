<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subtask extends Model
{
    protected $table = 'sub_tasks';

    // In SubTask model
    protected $casts = [
        'due_date' => 'datetime',
    ];

    
    protected $fillable = ['task_id', 'title', 'description', 'order', 'due_date'];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'sub_task_users', 'sub_task_id', 'user_id')
                    ->withPivot('status', 'file', 'turned_in_at')
                    ->withTimestamps();
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'sub_task_id');
    }

}
