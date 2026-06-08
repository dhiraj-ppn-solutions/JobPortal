import { usePostJob } from "../../hooks/usePostJob";
import JobForm from "../../components/user/JobForm";

function PostJob({ jobToEdit, onSuccess }) {
  const { formData, loading, message, handleChange, handleSubmit } =
    usePostJob(jobToEdit, onSuccess);

  return (
    <div
      style={{
        background: "var(--card-bg)",
        padding: "2.5rem",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h2>{jobToEdit ? "Edit Job Listing" : "Post a New Job"}</h2>
      <p className="text-muted">
        {jobToEdit
          ? "Modify opening details"
          : "Create a new role opening to search for talent"}
      </p>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <JobForm
        formData={formData}
        loading={loading}
        jobToEdit={jobToEdit}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        onSuccess={onSuccess}
      />
    </div>
  );
}

export default PostJob;
