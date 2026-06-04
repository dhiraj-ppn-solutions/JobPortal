<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CandidateController extends Controller
{
    /**
     * Upload resume for candidate.
     */
    public function uploadResume(Request $request)
    {
        $request->validate([
            'resume' => 'required|file|mimes:pdf,doc,docx|max:5120', // Max 5MB
        ]);

        $user = $request->user();
        
        // Ensure profile exists
        $profile = $user->candidateProfile;
        if (!$profile) {
            $profile = $user->candidateProfile()->create();
        }

        // Delete old resume file if exists
        if ($profile->resume_path && Storage::disk('public')->exists($profile->resume_path)) {
            Storage::disk('public')->delete($profile->resume_path);
        }

        // Store new file in 'resumes' directory in public disk
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
    }

    /**
     * Update candidate profile skills/experience/education.
     */
    public function updateProfile(Request $request)
    {
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
    }
}
