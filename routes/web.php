<?php

use App\Http\Controllers\StudentSubmissionController;
use App\Http\Controllers\SubTaskController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


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

    Route::post('/sub-task/{subTask}/turn-in', [SubTaskController::class, 'turnIn'])
     ->name('sub-task.turn-in');

});

require __DIR__.'/settings.php';
