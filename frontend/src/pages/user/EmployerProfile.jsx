import { useProfileAndResume } from "../../hooks/useProfileAndResume";
import AccountSettingsForm from "../../components/user/AccountSettingsForm";

function EmployerProfile() {
  const {
    accountData,
    accountMessage,
    accountSubmitting,
    handleAccountChange,
    handleAccountSubmit,
  } = useProfileAndResume();

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <AccountSettingsForm
        accountData={accountData}
        accountMessage={accountMessage}
        accountSubmitting={accountSubmitting}
        handleAccountChange={handleAccountChange}
        handleAccountSubmit={handleAccountSubmit}
      />
    </div>
  );
}

export default EmployerProfile;
