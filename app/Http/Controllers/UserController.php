<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
          
        $auth = auth()->user();

        $users = User::where('role' ,'!=',  'admin')->get();
        if ($auth->role === 'admin') {
       
        $users = User::where('role', '!=', 'admin')->get();
         } else if ($auth->role === 'teacher') {

        $users = User::where('role', 'user')->get();
        } else {
        abort(403); 
        }
        return Inertia::render('user-management', compact('users'));
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
        $auth = auth()->user();

    $request->validate([
        'name' => 'required',
        'email' => 'required|email|unique:users,email',
        'role' => 'required|in:admin,teacher,user',
        'password' => 'required|min:6',
    ]);

    // Teacher can only create regular users
    if ($auth->role === 'teacher' && $request->role !== 'user') {
        return back()->withErrors([
            'role' => 'Teacher can only create regular users.'
        ]);
    }

    // User cannot create anyone
    if ($auth->role === 'user') {
        abort(403);
    }

    User::create([
        'name' => $request->name,
        'email' => $request->email,
        'role' => $request->role,
        'password' => \Hash::make($request->password),
    ]);

    return back()->with('success', 'User created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $auth = auth()->user();
    $user = User::findOrFail($id);

    if ($auth->role === 'user') {
        abort(403);
    }

 
    if ($auth->role === 'teacher' && $user->role !== 'user') {
        abort(403);
    }

    $user->update($request->all());

    return back()->with('success', 'Updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $auth = auth()->user();
    $user = User::findOrFail($id);

    // User cannot delete anyone
    if ($auth->role === 'user') {
        abort(403);
    }

    // Teacher cannot delete teacher or admin
    if ($auth->role === 'teacher' && $user->role !== 'user') {
        abort(403);
    }

    $user->delete();

    return back()->with('success', 'User deleted successfully!');
    }
}
