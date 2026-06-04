<?php

namespace Tests\Feature;

use App\Models\CandidateProfile;
use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class JobPortalTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_candidate_can_register_and_profile_is_initialized(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'John Candidate',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'candidate'
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('success', true);
        
        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'role' => 'candidate'
        ]);

        $user = User::where('email', 'john@example.com')->first();
        $this->assertDatabaseHas('candidate_profiles', [
            'user_id' => $user->id
        ]);
    }

    public function test_employer_can_register(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Acme Corporation',
            'email' => 'acme@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'employer'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', [
            'email' => 'acme@example.com',
            'role' => 'employer'
        ]);

        $user = User::where('email', 'acme@example.com')->first();
        $this->assertDatabaseMissing('candidate_profiles', [
            'user_id' => $user->id
        ]);
    }

    public function test_user_can_login_with_correct_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'login@example.com',
            'password' => bcrypt('password123'),
            'role' => 'candidate'
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'login@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('role', 'candidate');
    }

    public function test_candidate_can_update_profile(): void
    {
        $candidate = User::factory()->create(['role' => 'candidate']);
        $candidate->candidateProfile()->create();
        $token = $candidate->createToken('auth_token')->plainTextToken;

        $response = $this->withToken($token)->putJson('/api/candidate/profile', [
            'skills' => 'Laravel, React',
            'experience' => '3 years',
            'education' => 'B.Sc'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('candidate_profiles', [
            'user_id' => $candidate->id,
            'skills' => 'Laravel, React',
            'experience' => '3 years',
            'education' => 'B.Sc'
        ]);
    }

    public function test_candidate_can_upload_resume(): void
    {
        $candidate = User::factory()->create(['role' => 'candidate']);
        $candidate->candidateProfile()->create();
        $token = $candidate->createToken('auth_token')->plainTextToken;

        $file = UploadedFile::fake()->create('my_resume.pdf', 500, 'application/pdf');

        $response = $this->withToken($token)->postJson('/api/candidate/resume', [
            'resume' => $file
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);

        $profile = CandidateProfile::where('user_id', $candidate->id)->first();
        $this->assertNotNull($profile->resume_path);
        Storage::disk('public')->assertExists($profile->resume_path);
    }

    public function test_employer_can_create_job_listing(): void
    {
        $employer = User::factory()->create(['role' => 'employer']);
        $token = $employer->createToken('auth_token')->plainTextToken;

        $response = $this->withToken($token)->postJson('/api/jobs', [
            'title' => 'Laravel Developer',
            'company_name' => 'Laravel Experts',
            'location' => 'Remote',
            'salary' => '$80,000',
            'job_type' => 'Remote',
            'description' => 'Laravel exp required.',
            'requirements' => '5+ years'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('job_listings', [
            'employer_id' => $employer->id,
            'title' => 'Laravel Developer'
        ]);
    }

    public function test_employer_can_update_own_job_listing(): void
    {
        $employer = User::factory()->create(['role' => 'employer']);
        $token = $employer->createToken('auth_token')->plainTextToken;

        $job = JobListing::create([
            'employer_id' => $employer->id,
            'title' => 'Old Title',
            'company_name' => 'Acme Co',
            'location' => 'Remote',
            'job_type' => 'Remote',
            'description' => 'Some desc'
        ]);

        $response = $this->withToken($token)->putJson("/api/jobs/{$job->id}", [
            'title' => 'New Title',
            'company_name' => 'Acme Co',
            'location' => 'Remote',
            'job_type' => 'Remote',
            'description' => 'Some desc',
            'status' => 'active'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('job_listings', [
            'id' => $job->id,
            'title' => 'New Title'
        ]);
    }

    public function test_candidate_cannot_update_job_listing(): void
    {
        $employer = User::factory()->create(['role' => 'employer']);
        
        $job = JobListing::create([
            'employer_id' => $employer->id,
            'title' => 'Developer Job',
            'company_name' => 'Acme Co',
            'location' => 'Remote',
            'job_type' => 'Remote',
            'description' => 'Some desc'
        ]);

        $candidate = User::factory()->create(['role' => 'candidate']);
        $token = $candidate->createToken('auth_token')->plainTextToken;

        $response = $this->withToken($token)->putJson("/api/jobs/{$job->id}", [
            'title' => 'Hacked Title',
            'company_name' => 'Acme Co',
            'location' => 'Remote',
            'job_type' => 'Remote',
            'description' => 'Some desc',
            'status' => 'active'
        ]);

        $response->assertStatus(403);
    }

    public function test_employer_cannot_update_others_job_listing(): void
    {
        $employer1 = User::factory()->create(['role' => 'employer']);
        $employer2 = User::factory()->create(['role' => 'employer']);
        $token2 = $employer2->createToken('auth_token')->plainTextToken;

        $job = JobListing::create([
            'employer_id' => $employer1->id,
            'title' => 'Employer 1 Job',
            'company_name' => 'Acme Co',
            'location' => 'Remote',
            'job_type' => 'Remote',
            'description' => 'Some desc'
        ]);

        $response = $this->withToken($token2)->putJson("/api/jobs/{$job->id}", [
            'title' => 'Hacked Title',
            'company_name' => 'Acme Co',
            'location' => 'Remote',
            'job_type' => 'Remote',
            'description' => 'Some desc',
            'status' => 'active'
        ]);

        $response->assertStatus(403);
    }

    public function test_employer_can_delete_own_job_listing(): void
    {
        $employer = User::factory()->create(['role' => 'employer']);
        $token = $employer->createToken('auth_token')->plainTextToken;

        $job = JobListing::create([
            'employer_id' => $employer->id,
            'title' => 'Job to delete',
            'company_name' => 'Acme Co',
            'location' => 'Remote',
            'job_type' => 'Remote',
            'description' => 'Some desc'
        ]);

        $response = $this->withToken($token)->deleteJson("/api/jobs/{$job->id}");
        $response->assertStatus(200);
        $this->assertDatabaseMissing('job_listings', ['id' => $job->id]);
    }

    public function test_candidate_cannot_apply_without_resume(): void
    {
        $employer = User::factory()->create(['role' => 'employer']);
        $job = JobListing::create([
            'employer_id' => $employer->id,
            'title' => 'React Job',
            'company_name' => 'Acme Co',
            'location' => 'Remote',
            'job_type' => 'Remote',
            'description' => 'React'
        ]);

        $candidate = User::factory()->create(['role' => 'candidate']);
        $candidate->candidateProfile()->create(); // empty profile (no resume)
        $token = $candidate->createToken('auth_token')->plainTextToken;

        $response = $this->withToken($token)->postJson("/api/jobs/{$job->id}/apply", [
            'cover_letter' => 'My cover letter'
        ]);

        $response->assertStatus(422);
    }

    public function test_candidate_can_apply_with_resume(): void
    {
        $employer = User::factory()->create(['role' => 'employer']);
        $job = JobListing::create([
            'employer_id' => $employer->id,
            'title' => 'React Job',
            'company_name' => 'Acme Co',
            'location' => 'Remote',
            'job_type' => 'Remote',
            'description' => 'React'
        ]);

        $candidate = User::factory()->create(['role' => 'candidate']);
        $candidate->candidateProfile()->create([
            'resume_path' => 'resumes/test_resume.pdf'
        ]);
        $token = $candidate->createToken('auth_token')->plainTextToken;

        $response = $this->withToken($token)->postJson("/api/jobs/{$job->id}/apply", [
            'cover_letter' => 'My cover letter'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('job_applications', [
            'job_listing_id' => $job->id,
            'candidate_id' => $candidate->id,
            'cover_letter' => 'My cover letter',
            'resume_path' => 'resumes/test_resume.pdf'
        ]);
    }

    public function test_candidate_cannot_apply_duplicate(): void
    {
        $employer = User::factory()->create(['role' => 'employer']);
        $job = JobListing::create([
            'employer_id' => $employer->id,
            'title' => 'React Job',
            'company_name' => 'Acme Co',
            'location' => 'Remote',
            'job_type' => 'Remote',
            'description' => 'React'
        ]);

        $candidate = User::factory()->create(['role' => 'candidate']);
        $candidate->candidateProfile()->create([
            'resume_path' => 'resumes/test_resume.pdf'
        ]);
        $token = $candidate->createToken('auth_token')->plainTextToken;

        // Apply first time
        JobApplication::create([
            'job_listing_id' => $job->id,
            'candidate_id' => $candidate->id,
            'resume_path' => 'resumes/test_resume.pdf'
        ]);

        // Attempt second time
        $response = $this->withToken($token)->postJson("/api/jobs/{$job->id}/apply", [
            'cover_letter' => 'My cover letter'
        ]);

        $response->assertStatus(422);
    }

    public function test_employer_can_fetch_applications_for_job(): void
    {
        $employer = User::factory()->create(['role' => 'employer']);
        $token = $employer->createToken('auth_token')->plainTextToken;

        $job = JobListing::create([
            'employer_id' => $employer->id,
            'title' => 'React Job',
            'company_name' => 'Acme Co',
            'location' => 'Remote',
            'job_type' => 'Remote',
            'description' => 'React'
        ]);

        $candidate = User::factory()->create(['role' => 'candidate']);
        JobApplication::create([
            'job_listing_id' => $job->id,
            'candidate_id' => $candidate->id,
            'resume_path' => 'resumes/test_resume.pdf'
        ]);

        $response = $this->withToken($token)->getJson("/api/jobs/{$job->id}/applications");

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'applications');
    }

    public function test_employer_can_update_application_status(): void
    {
        $employer = User::factory()->create(['role' => 'employer']);
        $token = $employer->createToken('auth_token')->plainTextToken;

        $job = JobListing::create([
            'employer_id' => $employer->id,
            'title' => 'React Job',
            'company_name' => 'Acme Co',
            'location' => 'Remote',
            'job_type' => 'Remote',
            'description' => 'React'
        ]);

        $candidate = User::factory()->create(['role' => 'candidate']);
        $app = JobApplication::create([
            'job_listing_id' => $job->id,
            'candidate_id' => $candidate->id,
            'resume_path' => 'resumes/test_resume.pdf',
            'status' => 'applied'
        ]);

        $response = $this->withToken($token)->putJson("/api/applications/{$app->id}/status", [
            'status' => 'shortlisted'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('job_applications', [
            'id' => $app->id,
            'status' => 'shortlisted'
        ]);
    }

    public function test_employer_dashboard_analytics(): void
    {
        $employer = User::factory()->create(['role' => 'employer']);
        $token = $employer->createToken('auth_token')->plainTextToken;

        $job = JobListing::create([
            'employer_id' => $employer->id,
            'title' => 'React Job',
            'company_name' => 'Acme Co',
            'location' => 'Remote',
            'job_type' => 'Remote',
            'description' => 'React'
        ]);

        $candidate = User::factory()->create(['role' => 'candidate']);
        JobApplication::create([
            'job_listing_id' => $job->id,
            'candidate_id' => $candidate->id,
            'resume_path' => 'resumes/test_resume.pdf',
            'status' => 'applied'
        ]);

        $response = $this->withToken($token)->getJson('/api/employer/dashboard');

        $response->assertStatus(200);
        $response->assertJsonPath('analytics.total_jobs_posted', 1);
        $response->assertJsonPath('analytics.total_applications_received', 1);
        $response->assertJsonPath('analytics.status_breakdown.applied', 1);
    }
}
