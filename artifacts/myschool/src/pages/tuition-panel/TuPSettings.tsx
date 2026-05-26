import { useOutletContext } from "react-router-dom";
import { Settings, Bell, Lock, Globe } from "lucide-react";
import { useState } from "react";

export default function TuPSettings() {
  const ctx = useOutletContext<any>();
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true });
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Settings className="h-5 w-5 text-blue-600" /> Account Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your tuition center preferences</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center"><Globe className="h-4 w-4 text-blue-600" /></div>
            <div><h3 className="font-bold text-gray-900 text-sm">Profile Visibility</h3><p className="text-xs text-gray-500">Control how your center appears on SchoolSocial</p></div>
          </div>
          <div className="space-y-3 pl-12">
            <label className="flex items-center justify-between"><span className="text-sm text-gray-700">Show center on search results</span><input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" /></label>
            <label className="flex items-center justify-between"><span className="text-sm text-gray-700">Allow parents to send enquiries</span><input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" /></label>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-purple-50 flex items-center justify-center"><Bell className="h-4 w-4 text-purple-600" /></div>
            <div><h3 className="font-bold text-gray-900 text-sm">Notifications</h3><p className="text-xs text-gray-500">Choose how you receive notifications</p></div>
          </div>
          <div className="space-y-3 pl-12">
            <label className="flex items-center justify-between"><span className="text-sm text-gray-700">Email notifications</span><input type="checkbox" checked={notifications.email} onChange={e => setNotifications(n => ({ ...n, email: e.target.checked }))} className="h-4 w-4 text-blue-600 rounded" /></label>
            <label className="flex items-center justify-between"><span className="text-sm text-gray-700">SMS notifications</span><input type="checkbox" checked={notifications.sms} onChange={e => setNotifications(n => ({ ...n, sms: e.target.checked }))} className="h-4 w-4 text-blue-600 rounded" /></label>
            <label className="flex items-center justify-between"><span className="text-sm text-gray-700">Push notifications</span><input type="checkbox" checked={notifications.push} onChange={e => setNotifications(n => ({ ...n, push: e.target.checked }))} className="h-4 w-4 text-blue-600 rounded" /></label>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-red-50 flex items-center justify-center"><Lock className="h-4 w-4 text-red-600" /></div>
            <div><h3 className="font-bold text-gray-900 text-sm">Security</h3><p className="text-xs text-gray-500">Account security settings</p></div>
          </div>
          <div className="space-y-3 pl-12">
            <button className="text-sm text-blue-600 font-semibold hover:text-blue-700">Change Password</button><br/>
            <button className="text-sm text-blue-600 font-semibold hover:text-blue-700">Enable Two-Factor Authentication</button>
          </div>
        </div>
      </div>
      <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700">Save Settings</button>
    </div>
  );
}
