<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

class JobController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = JobListing::where('status', 'active')->with('employer:id,name,email');

            if ($request->has('keyword') && !empty($request->keyword)) {
                $keyword = $request->keyword;
                $query->where(function ($q) use ($keyword) {
                    $q->where('title', 'LIKE', "%{$keyword}%")
                      ->orWhere('company_name', 'LIKE', "%{$keyword}%")
                      ->orWhere('description', 'LIKE', "%{$keyword}%")
                      ->orWhere('requirements', 'LIKE', "%{$keyword}%");
                });
            }

            if ($request->has('location') && !empty($request->location)) {
                $query->where('location', 'LIKE', "%{$request->location}%");
            }

            if ($request->has('job_type') && !empty($request->job_type)) {
                $query->where('job_type', $request->job_type);
            }

            $jobs = $query->latest()->get();

            return response()->json([
                'success' => true,
                'count' => $jobs->count(),
                'jobs' => $jobs
            ]);
        } catch (Exception $e) {
            Log::error('Job Index Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while loading job listings.'
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $job = JobListing::with('employer:id,name,email')->findOrFail($id);

            return response()->json([
                'success' => true,
                'job' => $job
            ]);
        } catch (Exception $e) {
            Log::error('Job Show Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Job listing not found.'
            ], 404);
        }
    }

    public function store(Request $request)
    {
        try {
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
        } catch (Exception $e) {
            Log::error('Job Store Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while posting the job opening.'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
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
        } catch (Exception $e) {
            Log::error('Job Update Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the job opening.'
            ], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        try {
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
        } catch (Exception $e) {
            Log::error('Job Destroy Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the job listing.'
            ], 500);
        }
    }
}
