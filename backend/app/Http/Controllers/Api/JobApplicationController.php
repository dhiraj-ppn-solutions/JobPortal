<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\JobListing;
use Illuminate\Http\Request;

class JobApplicationController extends Controller
{
    /**
     * Apply for a job listing (Candidate-only).
     */
    public function apply(Request $request, $jobListingId)
    {
        $job = JobListing::findOrFail($jobListingId);

        if ($job->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'This job listing is closed.'
            ], 422);
        }

        $candidate = $request->user();
        
        // Ensure candidate has uploaded a resume
        $profile = $candidate->candidateProfile;
        if (!$profile || !$profile->resume_path) {
            return response()->json([
                'success' => false,
                'message' => 'Please upload a resume in your profile before applying.'
            ], 422);
        }

        // Prevent duplicate applications
        $alreadyApplied = JobApplication::where('job_listing_id', $jobListingId)
            ->where('candidate_id', $candidate->id)
            ->exists();

        if ($alreadyApplied) {
            return response()->json([
                'success' => false,
                'message' => 'You have already applied for this job listing.'
            ], 422);
        }

        $request->validate([
            'cover_letter' => 'nullable|string',
        ]);

        $application = JobApplication::create([
            'job_listing_id' => $jobListingId,
            'candidate_id' => $candidate->id,
            'cover_letter' => $request->cover_letter,
            'resume_path' => $profile->resume_path, // Snapshot resume path at time of application
            'status' => 'applied'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Application submitted successfully',
            'application' => $application
        ], 201);
    }

    /**
     * List candidate's own applications (Candidate-only).
     */
    public function candidateApplications(Request $request)
    {
        $applications = JobApplication::where('candidate_id', $request->user()->id)
            ->with(['jobListing' => function ($q) {
                $q->with('employer:id,name,email');
            }])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'applications' => $applications
        ]);
    }

    /**
     * List all applications for a specific job (Employer-only, checks ownership).
     */
    public function jobApplications(Request $request, $jobListingId)
    {
        $job = JobListing::findOrFail($jobListingId);

        if ($job->employer_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Access Denied. You do not own this job listing.'
            ], 403);
        }

        $applications = JobApplication::where('job_listing_id', $jobListingId)
            ->with(['candidate' => function($q) {
                $q->select('id', 'name', 'email')->with('candidateProfile');
            }])
            ->latest()
            ->get();

        // Map candidate details with resume URLs for easier consumption
        $applications->map(function ($app) {
            if ($app->resume_path) {
                $app->resume_url = asset('storage/' . $app->resume_path);
            }
            return $app;
        });

        return response()->json([
            'success' => true,
            'job_title' => $job->title,
            'applications' => $applications
        ]);
    }

    /**
     * Update application status (Employer-only, checks ownership of associated job).
     */
    public function updateStatus(Request $request, $id)
    {
        $application = JobApplication::with('jobListing')->findOrFail($id);

        if ($application->jobListing->employer_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Access Denied. You do not own the job listing associated with this application.'
            ], 403);
        }

        $request->validate([
            'status' => 'required|string|in:reviewing,shortlisted,rejected,accepted',
        ]);

        $application->update([
            'status' => $request->status
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Application status updated successfully',
            'application' => $application
        ]);
    }
}
