<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = ['sub_task_id', 'teacher_id', 'student_id', 'sender_id' ,'comment'];

    public function subTask()
    {
        return $this->belongsTo(SubTask::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
