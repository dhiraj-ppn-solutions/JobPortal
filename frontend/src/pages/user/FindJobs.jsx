import { useFindJobs } from "../../hooks/useFindJobs";
import JobSearchForm from "../../components/user/JobSearchForm";
import JobList from "../../components/user/JobList";
import JobDetailsPanel from "../../components/user/JobDetailsPanel";

function FindJobs() {
  const {
    jobs,
    search,
    loading,
    selectedJob,
    coverLetter,
    appMessage,
    applying,
    handleSearchChange,
    handleSearchSubmit,
    handleSelectJob,
    handleApplySubmit,
    setCoverLetter,
    setSelectedJob,
  } = useFindJobs();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: selectedJob ? "1.2fr 1fr" : "1fr",
        gap: "2.5rem",
      }}
    >
      {/* Search and Listing Panel */}
      <div>
        <JobSearchForm
          search={search}
          handleSearchChange={handleSearchChange}
          handleSearchSubmit={handleSearchSubmit}
        />

        <JobList
          jobs={jobs}
          loading={loading}
          selectedJob={selectedJob}
          handleSelectJob={handleSelectJob}
        />
      </div>

      {/* Details and Apply Panel */}
      <JobDetailsPanel
        selectedJob={selectedJob}
        setSelectedJob={setSelectedJob}
        coverLetter={coverLetter}
        setCoverLetter={setCoverLetter}
        appMessage={appMessage}
        applying={applying}
        handleApplySubmit={handleApplySubmit}
      />
    </div>
  );
}

export default FindJobs;
