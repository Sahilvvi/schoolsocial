import { useState, useEffect, useRef } from "react";
import { Bell, X, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function getToken() { return localStorage.getItem("myschool_token"); }
function getUser() { try { return JSON.parse(localStorage.getItem("myschool_user") || "{}"); } catch { return {}; } }

interface Notification { id: number; title: string; message: string; type: string; isRead: boolean; createdAt: string; }

export default function NotificationBell() {
  const user = getUser();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = () => {
    if (!user.userId) return;
    fetch(`${BASE}/api/notifications?userId=${user.userId}&schoolId=${user.schoolId || ""}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(d => { setNotifications(d.notifications || []); setUnread(d.unread || 0); })
      .catch(() => {});
  };

  useEffect(() => { fetchNotifications(); const t = setInterval(fetchNotifications, 30000); return () => clearInterval(t); }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markRead = async (id: number) => {
    await fetch(`${BASE}/api/notifications/${id}/read`, { method: "PUT", headers: { Authorization: `Bearer ${getToken()}` } });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnread(prev => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    await fetch(`${BASE}/api/notifications/mark-all-read`, { method: "PUT", headers: { Authorization: `Bearer ${getToken()}` } });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnread(0);
  };

  const TYPE_COLORS: Record<string, string> = {
    announcement: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    info: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    fee: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    attendance: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  <CheckCheck className="w-3 h-3"/>Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-4 h-4"/>
              </button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2"/>
                <p className="text-sm text-gray-400 dark:text-gray-500">No notifications</p>
              </div>
            ) : notifications.map(n => (
              <div key={n.id} onClick={() => !n.isRead && markRead(n.id)} className={`p-4 border-b border-gray-50 dark:border-gray-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-750 ${!n.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}>
                <div className="flex items-start gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[n.type] || TYPE_COLORS.info}`}>{n.type}</span>
                  {!n.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 ml-auto flex-shrink-0"/>}
                </div>
                <p className="font-medium text-sm text-gray-900 dark:text-white mt-1">{n.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(n.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
