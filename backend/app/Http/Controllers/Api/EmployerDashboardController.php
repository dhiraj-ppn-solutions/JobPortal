<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\JobListing;
use Illuminate\Http\Request;

class EmployerDashboardController extends Controller
{
    /**
     * Get employer dashboard analytics.
     */
    public function dashboard(Request $request)
    {
        $employer = $request->user();

        // Get job IDs posted by this employer
        $jobIds = JobListing::where('employer_id', $employer->id)->pluck('id');

        $totalJobs = $jobIds->count();
        $activeJobs = JobListing::where('employer_id', $employer->id)->where('status', 'active')->count();

        // Applications received across all postings
        $totalApplications = JobApplication::whereIn('job_listing_id', $jobIds)->count();

        // Applications status breakdown
        $statusBreakdown = [
            'applied' => JobApplication::whereIn('job_listing_id', $jobIds)->where('status', 'applied')->count(),
            'reviewing' => JobApplication::whereIn('job_listing_id', $jobIds)->where('status', 'reviewing')->count(),
            'shortlisted' => JobApplication::whereIn('job_listing_id', $jobIds)->where('status', 'shortlisted')->count(),
            'rejected' => JobApplication::whereIn('job_listing_id', $jobIds)->where('status', 'rejected')->count(),
            'accepted' => JobApplication::whereIn('job_listing_id', $jobIds)->where('status', 'accepted')->count(),
        ];

        // Recent applications (limit 5) with candidate and job listing details
        $recentApplications = JobApplication::whereIn('job_listing_id', $jobIds)
            ->with([
                'candidate:id,name,email', 
                'jobListing:id,title,company_name'
            ])
            ->latest()
            ->limit(5)
            ->get();

        // Add file URLs to recent applications
        $recentApplications->map(function ($app) {
            if ($app->resume_path) {
                $app->resume_url = asset('storage/' . $app->resume_path);
            }
            return $app;
        });

        // Active job listings list
        $activeJobListings = JobListing::where('employer_id', $employer->id)
            ->where('status', 'active')
            ->latest()
            ->get();

        // All job listings list (both active and inactive)
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
    }

    /**
     * Get employer verification company details.
     */
    public function getVerification(Request $request)
    {
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
    }

    /**
     * Submit/update employer verification company details and documents.
     */
    public function submitVerification(Request $request)
    {
        $employer = $request->user();

        // If they already have a document, it's optional to upload a new one.
        // Otherwise, a document is required.
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
            'employer_status' => 'pending', // Reverts to pending when updated
        ];

        if ($request->hasFile('company_document')) {
            // Delete old document if it exists
            if ($employer->company_document && \Illuminate\Support\Facades\Storage::disk('public')->exists($employer->company_document)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($employer->company_document);
            }
            
            // Store new document
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
    }
}
