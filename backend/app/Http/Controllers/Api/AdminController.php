<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\JobListing;
use App\Models\JobApplication;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Exception;

class AdminController extends Controller
{
    public function createAdmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:3|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'admin',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Admin user created successfully',
                'user' => $user
            ], 201);

        } catch (Exception $e) {
            Log::error('Admin Creation Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'An internal server error occurred while creating the admin account.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function dashboardOverview()
    {
        try {
            $totalCandidates = User::where('role', 'candidate')->count();
            $totalEmployers = User::where('role', 'employer')->count();
            $totalAdmins = User::where('role', 'admin')->count();
            $totalJobs = JobListing::count();
            $totalApplications = JobApplication::count();

            $recentUsers = User::orderBy('created_at', 'desc')->limit(5)->get();
            $recentJobs = JobListing::orderBy('created_at', 'desc')->limit(5)->get();

            return response()->json([
                'success' => true,
                'analytics' => [
                    'total_candidates' => $totalCandidates,
                    'total_employers' => $totalEmployers,
                    'total_admins' => $totalAdmins,
                    'total_jobs' => $totalJobs,
                    'total_applications' => $totalApplications,
                ],
                'recent_users' => $recentUsers,
                'recent_jobs' => $recentJobs,
            ]);
        } catch (Exception $e) {
            Log::error('Admin Overview Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load dashboard overview stats.'
            ], 500);
        }
    }

    public function listUsers()
    {
        try {
            $users = User::with('candidateProfile')->get();
            return response()->json([
                'success' => true,
                'users' => $users
            ]);
        } catch (Exception $e) {
            Log::error('Admin List Users Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load users list.'
            ], 500);
        }
    }

    public function deleteUser(Request $request, $id)
    {
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found.'
                ], 404);
            }

            if ($request->user()->id === (int)$id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot delete your own administrative account.'
                ], 400);
            }

            if ($user->role === 'candidate') {
                if ($user->candidateProfile) {
                    $user->candidateProfile()->delete();
                }
                $user->jobApplications()->delete();
            } elseif ($user->role === 'employer') {
                foreach ($user->jobListings as $job) {
                    $job->applications()->delete();
                    $job->delete();
                }
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User account and all related data deleted successfully.'
            ]);
        } catch (Exception $e) {
            Log::error('Admin Delete User Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user account.'
            ], 500);
        }
    }

    public function listJobs()
    {
        try {
            $jobs = JobListing::with('employer')->get();
            return response()->json([
                'success' => true,
                'jobs' => $jobs
            ]);
        } catch (Exception $e) {
            Log::error('Admin List Jobs Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load jobs.'
            ], 500);
        }
    }

    public function deleteJob($id)
    {
        try {
            $job = JobListing::find($id);
            if (!$job) {
                return response()->json([
                    'success' => false,
                    'message' => 'Job listing not found.'
                ], 404);
            }

            $job->applications()->delete();
            $job->delete();

            return response()->json([
                'success' => true,
                'message' => 'Job listing deleted successfully.'
            ]);
        } catch (Exception $e) {
            Log::error('Admin Delete Job Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete job listing.'
            ], 500);
        }
    }

    public function listApplications()
    {
        try {
            $applications = JobApplication::with(['candidate', 'jobListing'])->get();
            return response()->json([
                'success' => true,
                'applications' => $applications
            ]);
        } catch (Exception $e) {
            Log::error('Admin List Applications Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load applications.'
            ], 500);
        }
    }

    public function deleteApplication($id)
    {
        try {
            $application = JobApplication::find($id);
            if (!$application) {
                return response()->json([
                    'success' => false,
                    'message' => 'Application not found.'
                ], 404);
            }

            $application->delete();

            return response()->json([
                'success' => true,
                'message' => 'Application record deleted successfully.'
            ]);
        } catch (Exception $e) {
            Log::error('Admin Delete Application Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete application record.'
            ], 500);
        }
    }

    public function listEmployers()
    {
        try {
            $employers = User::where('role', 'employer')->get();
            
            $employers->map(function ($emp) {
                if ($emp->company_document) {
                    $emp->company_document_url = asset('storage/' . $emp->company_document);
                } else {
                    $emp->company_document_url = null;
                }
                return $emp;
            });

            return response()->json([
                'success' => true,
                'employers' => $employers
            ]);
        } catch (Exception $e) {
            Log::error('Admin List Employers Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load employers list.'
            ], 500);
        }
    }

    public function verifyEmployer(Request $request, $id)
    {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'status' => 'required|string|in:approved,rejected',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $employer = User::where('role', 'employer')->where('id', $id)->first();
            if (!$employer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Employer not found.'
                ], 404);
            }

            $employer->update([
                'employer_status' => $request->status
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Employer account has been successfully ' . $request->status . '.',
                'employer' => $employer
            ]);
        } catch (Exception $e) {
            Log::error('Admin Verify Employer Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update employer verification status.'
            ], 500);
        }
    }
}