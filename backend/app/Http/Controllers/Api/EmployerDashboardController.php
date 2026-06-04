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

        return response()->json([
            'success' => true,
            'analytics' => [
                'total_jobs_posted' => $totalJobs,
                'active_jobs' => $activeJobs,
                'total_applications_received' => $totalApplications,
                'status_breakdown' => $statusBreakdown
            ],
            'recent_applications' => $recentApplications,
            'active_job_listings' => $activeJobListings
        ]);
    }
}
