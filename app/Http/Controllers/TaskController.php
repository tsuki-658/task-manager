<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $userClass = auth()->user()->class_name ?? 'irreg';


        $tasks = Task::where('class_name', $userClass) 
                ->orWhere('creator_id', auth()->id()) 
                ->get();


        return Inertia::render('task', compact('tasks'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'class_name' => 'required|string|max:255',
        ]);

        // Create the task
        $task = Task::create([
            'subject' => $validated['subject'],
            'class_name' => $validated['class_name'],
            'creator_id' => auth()->id(),
        ]);

        // If using Inertia + React, return a redirect or JSON
        return back()->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {   
        $task->load(['subtasks.users']);

        return Inertia::render('show-task', [
            'task' => $task,
            'auth_user_id' => Auth::id(),
        ]);

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        //
    }
}
