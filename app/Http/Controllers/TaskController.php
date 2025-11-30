<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
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
        $userRole = auth()->user()->role;

        if ($userRole === 'admin') {
            // Admin sees all tasks
            $tasks = Task::withCount('subTasks')->get();
        } elseif ($userRole === 'teacher') {
            // Teacher sees only their own created tasks
            $tasks = Task::where('creator_id', auth()->id())
                    ->withCount('subTasks')
                    ->get();
        } else {
            // Regular users see tasks for their class or tasks they are assigned to
            $tasks = Task::where('class_name', $userClass)
                ->orWhere('creator_id', auth()->id())
                ->withCount('subTasks')
                ->get();
        }

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
        $classUserCount = User::where('role', 'user') // Assuming 'user' role is a student
        ->where('class_name', $task->class_name)
        ->count();

        $task->class_user_count = $classUserCount;

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
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'class_name' => 'required|string|max:255',
        ]);

        // Authorization: only creator or non-user roles (teacher/admin) can update
        if (auth()->id() !== $task->creator_id && auth()->user()->role === 'user') {
            abort(403, 'Unauthorized');
        }

        $task->update([
            'subject' => $validated['subject'],
            'class_name' => $validated['class_name'],
        ]);

        return back()->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        // Authorization: only creator or non-user roles (teacher/admin) can delete
        if (auth()->id() !== $task->creator_id && auth()->user()->role === 'user') {
            abort(403, 'Unauthorized');
        }

        $task->delete();

        return back()->with('success', 'Task deleted successfully.');
    }
}
