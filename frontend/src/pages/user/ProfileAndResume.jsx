import { useProfileAndResume } from "../../hooks/useProfileAndResume";
import AccountSettingsForm from "../../components/user/AccountSettingsForm";
import ProfileForm from "../../components/user/ProfileForm";
import ResumeUploader from "../../components/user/ResumeUploader";

function ProfileAndResume() {
  const {
    user,
    profileData,
    accountData,
    profileMessage,
    resumeMessage,
    accountMessage,
    profileSubmitting,
    resumeSubmitting,
    accountSubmitting,
    currentResumeUrl,
    handleProfileChange,
    handleAccountChange,
    handleFileChange,
    handleProfileSubmit,
    handleAccountSubmit,
    handleResumeSubmit,
  } = useProfileAndResume();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.2fr",
        gap: "2.5rem",
      }}
    >
      <div>
        <AccountSettingsForm
          accountData={accountData}
          accountMessage={accountMessage}
          accountSubmitting={accountSubmitting}
          handleAccountChange={handleAccountChange}
          handleAccountSubmit={handleAccountSubmit}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        <ProfileForm
          profileData={profileData}
          profileMessage={profileMessage}
          profileSubmitting={profileSubmitting}
          handleProfileChange={handleProfileChange}
          handleProfileSubmit={handleProfileSubmit}
        />

        <ResumeUploader
          user={user}
          resumeMessage={resumeMessage}
          resumeSubmitting={resumeSubmitting}
          currentResumeUrl={currentResumeUrl}
          handleFileChange={handleFileChange}
          handleResumeSubmit={handleResumeSubmit}
        />
      </div>
    </div>
  );
}

export default ProfileAndResume;
