<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

class EmployerDashboardController extends Controller
{
    public function dashboard(Request $request)
    {
        try {
            $employer = $request->user();

            $jobIds = JobListing::where('employer_id', $employer->id)->pluck('id');

            $totalJobs = $jobIds->count();
            $activeJobs = JobListing::where('employer_id', $employer->id)->where('status', 'active')->count();

            $totalApplications = JobApplication::whereIn('job_listing_id', $jobIds)->count();

            $statusBreakdown = [
                'applied' => JobApplication::whereIn('job_listing_id', $jobIds)->where('status', 'applied')->count(),
                'reviewing' => JobApplication::whereIn('job_listing_id', $jobIds)->where('status', 'reviewing')->count(),
                'shortlisted' => JobApplication::whereIn('job_listing_id', $jobIds)->where('status', 'shortlisted')->count(),
                'rejected' => JobApplication::whereIn('job_listing_id', $jobIds)->where('status', 'rejected')->count(),
                'accepted' => JobApplication::whereIn('job_listing_id', $jobIds)->where('status', 'accepted')->count(),
            ];

            $recentApplications = JobApplication::whereIn('job_listing_id', $jobIds)
                ->with([
                    'candidate:id,name,email', 
                    'jobListing:id,title,company_name'
                ])
                ->latest()
                ->limit(5)
                ->get();

            $recentApplications->map(function ($app) {
                if ($app->resume_path) {
                    $app->resume_url = asset('storage/' . $app->resume_path);
                }
                return $app;
            });

            $activeJobListings = JobListing::where('employer_id', $employer->id)
                ->where('status', 'active')
                ->latest()
                ->get();

            $allJobListings = JobListing::where('employer_id', $employer->id)
                ->latest()
                ->get();

            return response()->json([
                'success' => true,
                'analytics' => [
                    'total_jobs_posted' => $totalJobs,
                    'active_jobs' => $activeJobs,
                    'total_applications_received' => $totalApplications,
                    'status_breakdown' => $statusBreakdown
                ],
                'recent_applications' => $recentApplications,
                'active_job_listings' => $activeJobListings,
                'all_job_listings' => $allJobListings
            ]);
        } catch (Exception $e) {
            Log::error('Employer Dashboard Analytics Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while loading dashboard metrics.'
            ], 500);
        }
    }

    public function getVerification(Request $request)
    {
        try {
            $employer = $request->user();
            
            $documentUrl = null;
            if ($employer->company_document) {
                $documentUrl = asset('storage/' . $employer->company_document);
            }

            return response()->json([
                'success' => true,
                'company_name' => $employer->company_name,
                'company_website' => $employer->company_website,
                'company_description' => $employer->company_description,
                'company_document' => $employer->company_document,
                'company_document_url' => $documentUrl,
                'employer_status' => $employer->employer_status,
            ]);
        } catch (Exception $e) {
            Log::error('Employer Get Verification Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while loading company verification details.'
            ], 500);
        }
    }

    public function submitVerification(Request $request)
    {
        try {
            $employer = $request->user();

            $documentRule = $employer->company_document ? 'nullable|file|mimes:pdf,jpg,png,jpeg,doc,docx|max:5120' : 'required|file|mimes:pdf,jpg,png,jpeg,doc,docx|max:5120';

            $request->validate([
                'company_name' => 'required|string|min:3|max:100',
                'company_website' => 'required|url|max:255',
                'company_description' => 'required|string|min:10',
                'company_document' => $documentRule,
            ]);

            $data = [
                'company_name' => $request->company_name,
                'company_website' => $request->company_website,
                'company_description' => $request->company_description,
                'employer_status' => 'pending',
            ];

            if ($request->hasFile('company_document')) {
                if ($employer->company_document && \Illuminate\Support\Facades\Storage::disk('public')->exists($employer->company_document)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($employer->company_document);
                }
                
                $path = $request->file('company_document')->store('employer_documents', 'public');
                $data['company_document'] = $path;
            }

            $employer->update($data);

            $documentUrl = null;
            if ($employer->company_document) {
                $documentUrl = asset('storage/' . $employer->company_document);
            }

            return response()->json([
                'success' => true,
                'message' => 'Verification details submitted successfully. Awaiting admin approval.',
                'user' => $employer,
                'company_document_url' => $documentUrl
            ]);
        } catch (Exception $e) {
            Log::error('Employer Submit Verification Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while submitting company verification details.'
            ], 500);
        }
    }
}
