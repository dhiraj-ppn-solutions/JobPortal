<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use Illuminate\Http\Request;

class JobController extends Controller
{
    /**
     * Get all active job listings (Public endpoint).
     */
    public function index(Request $request)
    {
        $query = JobListing::where('status', 'active')->with('employer:id,name,email');

        // Filter by keyword (title, company, description)
        if ($request->has('keyword') && !empty($request->keyword)) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'LIKE', "%{$keyword}%")
                  ->orWhere('company_name', 'LIKE', "%{$keyword}%")
                  ->orWhere('description', 'LIKE', "%{$keyword}%")
                  ->orWhere('requirements', 'LIKE', "%{$keyword}%");
            });
        }

        // Filter by location
        if ($request->has('location') && !empty($request->location)) {
            $query->where('location', 'LIKE', "%{$request->location}%");
        }

        // Filter by job type (Full-time, Part-time, Contract, Remote)
        if ($request->has('job_type') && !empty($request->job_type)) {
            $query->where('job_type', $request->job_type);
        }

        $jobs = $query->latest()->get();

        return response()->json([
            'success' => true,
            'count' => $jobs->count(),
            'jobs' => $jobs
        ]);
    }

    /**
     * Get single job listing details (Public endpoint).
     */
    public function show($id)
    {
        $job = JobListing::with('employer:id,name,email')->findOrFail($id);

        return response()->json([
            'success' => true,
            'job' => $job
        ]);
    }

    /**
     * Store new job listing (Employer-only).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'salary' => 'nullable|string|max:100',
            'job_type' => 'required|string|in:Full-time,Part-time,Contract,Remote',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
        ]);

        $job = $request->user()->jobListings()->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Job posted successfully',
            'job' => $job
        ], 201);
    }

    /**
     * Update job listing (Employer-only, checks ownership).
     */
    public function update(Request $request, $id)
    {
        $job = JobListing::findOrFail($id);

        if ($job->employer_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Access Denied. You do not own this job listing.'
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'salary' => 'nullable|string|max:100',
            'job_type' => 'required|string|in:Full-time,Part-time,Contract,Remote',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'status' => 'required|string|in:active,closed',
        ]);

        $job->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Job updated successfully',
            'job' => $job
        ]);
    }

    /**
     * Delete job listing (Employer-only, checks ownership).
     */
    public function destroy(Request $request, $id)
    {
        $job = JobListing::findOrFail($id);

        if ($job->employer_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Access Denied. You do not own this job listing.'
            ], 403);
        }

        $job->delete();

        return response()->json([
            'success' => true,
            'message' => 'Job deleted successfully'
        ]);
    }
}
