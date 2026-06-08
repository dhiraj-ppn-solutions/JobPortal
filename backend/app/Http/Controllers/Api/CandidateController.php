<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Exception;

class CandidateController extends Controller
{
    public function uploadResume(Request $request)
    {
        try {
            $request->validate([
                'resume' => 'required|file|mimes:pdf,doc,docx|max:5120',
            ]);

            $user = $request->user();
            
            $profile = $user->candidateProfile;
            if (!$profile) {
                $profile = $user->candidateProfile()->create();
            }

            if ($profile->resume_path && Storage::disk('public')->exists($profile->resume_path)) {
                Storage::disk('public')->delete($profile->resume_path);
            }

            $path = $request->file('resume')->store('resumes', 'public');

            $profile->update([
                'resume_path' => $path
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Resume uploaded successfully',
                'resume_path' => $path,
                'resume_url' => asset('storage/' . $path)
            ]);
        } catch (Exception $e) {
            Log::error('Resume Upload Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during resume upload.'
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $request->validate([
                'skills' => 'nullable|string',
                'experience' => 'nullable|string',
                'education' => 'nullable|string',
            ]);

            $user = $request->user();
            
            $profile = $user->candidateProfile;
            if (!$profile) {
                $profile = $user->candidateProfile()->create();
            }

            $profile->update([
                'skills' => $request->skills,
                'experience' => $request->experience,
                'education' => $request->education,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'profile' => $profile
            ]);
        } catch (Exception $e) {
            Log::error('Candidate Profile Update Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating profile.'
            ], 500);
        }
    }
}
