<?php

use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\SubTaskController;
use App\Http\Controllers\StudentSubmissionController;


Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('student-submission', StudentSubmissionController::class);
    Route::resource('user-management', UserController::class);
    Route::resource('task', TaskController::class);

    Route::resource('sub-task', SubTaskController::class);
    // Route::resource('comment', CommentController::class);

    Route::post('/sub-task/{subTask}/turn-in', [SubTaskController::class, 'turnIn'])
     ->name('sub-task.turn-in');

     Route::get('/sub-task/{subtask}/submission', [SubTaskController::class, 'submissions']);
     // Show comments for a specific subtask
    Route::get('/sub-task/{subTask}/comment', [SubTaskController::class, 'showComments'])->name('sub-task.comment');

    // Store a new comment
    Route::post('/sub-task/{subTask}/comment', [SubTaskController::class, 'storeComment'])->name('sub-task.comment.store');


});

require __DIR__.'/settings.php';
