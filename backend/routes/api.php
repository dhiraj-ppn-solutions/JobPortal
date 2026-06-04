<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\CandidateController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\JobApplicationController;
use App\Http\Controllers\Api\EmployerDashboardController;

// Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public/Mutual Access Job Routes
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Candidate Specific Routes
    Route::middleware('candidate')->group(function () {
        Route::post('/candidate/resume', [CandidateController::class, 'uploadResume']);
        Route::put('/candidate/profile', [CandidateController::class, 'updateProfile']);
        Route::post('/jobs/{id}/apply', [JobApplicationController::class, 'apply']);
        Route::get('/candidate/applications', [JobApplicationController::class, 'candidateApplications']);
    });

    // Employer Specific Routes
    Route::middleware('employer')->group(function () {
        Route::post('/jobs', [JobController::class, 'store']);
        Route::put('/jobs/{id}', [JobController::class, 'update']);
        Route::delete('/jobs/{id}', [JobController::class, 'destroy']);
        Route::get('/jobs/{jobId}/applications', [JobApplicationController::class, 'jobApplications']);
        Route::put('/applications/{id}/status', [JobApplicationController::class, 'updateStatus']);
        Route::get('/employer/dashboard', [EmployerDashboardController::class, 'dashboard']);
    });

    // Admin Specific Routes
    Route::middleware('admin')->group(function () {
        Route::post('/admin/create-admin', [AdminController::class, 'createAdmin']);
    });
});