import { useOutletContext } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, IndianRupee, FileText, Bell } from "lucide-react";

export default function PPNotifications() {
  const { notifications } = useOutletContext<any>();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">{notifications.filter((n: any) => !n.is_read).length} unread</p>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No notifications yet.</p>
          </div>
        ) : (
          notifications.map((notif: any) => (
            <Card key={notif.id} className={`backdrop-blur-sm border-border/30 ${!notif.is_read ? "bg-primary/5 border-primary/20" : "bg-card/60"}`}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-md shrink-0 ${
                  notif.type === "admission" ? "bg-gradient-to-br from-green-500 to-emerald-500" :
                  notif.type === "fee" ? "bg-gradient-to-br from-amber-500 to-orange-500" :
                  notif.type === "homework" ? "bg-gradient-to-br from-blue-500 to-cyan-500" :
                  "bg-gradient-to-br from-violet-500 to-purple-500"
                }`}>
                  {notif.type === "admission" ? <ClipboardList className="h-5 w-5 text-white" /> :
                   notif.type === "fee" ? <IndianRupee className="h-5 w-5 text-white" /> :
                   notif.type === "homework" ? <FileText className="h-5 w-5 text-white" /> :
                   <Bell className="h-5 w-5 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {!notif.is_read && <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
                    <p className="font-bold text-sm text-foreground">{notif.title}</p>
                    <span className="text-[10px] text-muted-foreground ml-auto">{new Date(notif.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notif.message}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
