import { getCompanySettings } from "./actions";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
    const settings = await getCompanySettings();

    return <SettingsClient initialSettings={settings} />;
}
