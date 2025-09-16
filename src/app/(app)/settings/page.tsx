import { PageHeader } from "@/components/page-header";
import { SettingsForm } from "@/components/settings-form";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account and application settings."
      />
      <SettingsForm />
    </>
  );
}
