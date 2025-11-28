<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Comment;
use App\Models\SubTask;
use App\Models\SubTaskUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubTaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        $validated = $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);

        $order = Subtask::where('task_id', $validated['task_id'])->max('order') + 1;

        Subtask::create([
            'task_id' => $validated['task_id'],
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'order' => $order,
            'due_date' => $validated['due_date'] ?? null,
        ]);

    }

    /**
     * Display the specified resource.
     */
    public function show(SubTask $subTask)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SubTask $subTask)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SubTask $subTask)
    {
        $user = Auth::user();

        // Check if previous subtask exists and is done for this user
        $previousSubtask = SubTask::where('task_id', $subTask->task_id)
                                    ->where('order', '<', $subTask->order ?? 0)
                                    ->orderBy('order', 'desc')
                                    ->first();

        if ($previousSubtask) {
            $completed = SubTaskUser::where('user_id', $user->id)
                                    ->where('subtask_id', $previousSubtask->id)
                                    ->exists();

            if (!$completed) {
                return back()->with('error', 'You must complete the previous subtask first.');
            }
        }

        // Mark this subtask as done for the current user
        SubTaskUser::updateOrCreate(
            [
                'user_id' => $user->id,
                'subtask_id' => $subTask->id,
            ],
            []
        );

        return response()->json([
            'message' => 'Subtask marked as done.'
        ]);
    }

    public function turnIn(Request $request, SubTask $subTask)
    {
        $user = Auth::user();
        
        // Check if previous subtask exists and is done for this user
        $previousSubtask = SubTask::where('task_id', $subTask->task_id)
            ->where('order', '<', $subTask->order ?? 0)
            ->orderBy('order', 'desc')
            ->first();

        if ($previousSubtask) {
            $completed = SubTaskUser::where('user_id', $user->id)
                ->where('sub_task_id', $previousSubtask->id)
                ->exists();
            
            if (!$completed) {
                return back()->with('error', 'You must complete the previous subtask first.');
            }
        }
        
        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('subtask_files', 'public');
        }

        $subTaskUser = SubTaskUser::firstOrNew([
            'user_id' => $user->id,
            'sub_task_id' => $subTask->id,
            'turned_in_at' => now(),
        ]);
        

        if ($subTask->due_date && now() > $subTask->due_date) {
            $subTaskUser->status = 'missing';


            $subTaskUser->save();

            return back()->with('error', 'missing, you turned in after due date.');
        } else {
            $subTaskUser->file = $filePath;
            $subTaskUser->status = 'submitted';
            $subTaskUser->save();

            return back()->with('success', 'Subtask turned in successfully.');
        }
        

    }

    public function submissions(SubTask $subtask)
    {
        $subtask->load(['users' => function($q) {
            $q->withPivot(['status', 'file', 'turned_in_at']);
        }]);

        return Inertia::render('student-submission', [
            'subtask' => $subtask,
            'students' => $subtask->users,
        ]);
    }

    public function showComments(SubTask $subTask, $studentId)
    {
        $subTask->load('task');
        $comments = Comment::where('sub_task_id', $subTask->id)
            ->where('student_id', $studentId)
            ->orderBy('created_at', 'asc')
            ->get();

        $student = User::where('id', $studentId)->first();
        // creator of the task

        $creator = User::where('id', $subTask->task->creator_id)->first();

        return Inertia::render('comment', [
            'subTask' => $subTask,
            'student' => $student,
            'creator' => $creator,
            'comments' => $comments,
        ]);
    }


    public function storeComment(Request $request, SubTask $subTask)
    {

        $request->validate([
            'comment' => 'required|string'
        ]);

        Comment::create([
            'sub_task_id' => $subTask->id,
            'teacher_id' => $request->teacher_id,
            'student_id' => $request->student_id,
            'sender_id' => auth()->id(),
            'comment' => $request->comment,
        ]);

        return back();
    }





    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SubTask $subTask)
    {
        //
    }
}
