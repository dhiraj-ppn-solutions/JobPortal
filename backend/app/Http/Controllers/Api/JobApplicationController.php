<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

class JobApplicationController extends Controller
{
    public function apply(Request $request, $jobListingId)
    {
        try {
            $job = JobListing::findOrFail($jobListingId);

            if ($job->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'This job listing is closed.'
                ], 422);
            }

            $candidate = $request->user();
            
            $profile = $candidate->candidateProfile;
            if (!$profile || !$profile->resume_path) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please upload a resume in your profile before applying.'
                ], 422);
            }

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
                'resume_path' => $profile->resume_path,
                'status' => 'applied'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Application submitted successfully',
                'application' => $application
            ], 201);
        } catch (Exception $e) {
            Log::error('Job Application Apply Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while submitting your job application.'
            ], 500);
        }
    }

    public function candidateApplications(Request $request)
    {
        try {
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
        } catch (Exception $e) {
            Log::error('Job Application CandidateList Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while loading your applications.'
            ], 500);
        }
    }

    public function jobApplications(Request $request, $jobListingId)
    {
        try {
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
        } catch (Exception $e) {
            Log::error('Job Application EmployerList Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while loading applications.'
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        try {
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
        } catch (Exception $e) {
            Log::error('Job Application UpdateStatus Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating application status.'
            ], 500);
        }
    }
}
