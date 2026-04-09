import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotifications, useMarkNotificationRead } from "@/hooks/useErp";
import { useAuth } from "@/hooks/useAuth";

export default function NotificationBell() {
  const { user } = useAuth();
  const { data: notifications = [] } = useNotifications(user?.id);
  const markRead = useMarkNotificationRead();
  const unread = notifications.filter((n: any) => !n.is_read).length;

  if (!user) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg relative">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">{unread > 9 ? "9+" : unread}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b border-border/30">
          <h4 className="font-semibold text-sm">Notifications</h4>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">No notifications</p>
          ) : (
            notifications.map((n: any) => (
              <div key={n.id} className={`p-3 border-b border-border/20 text-sm hover:bg-accent/30 transition-colors ${n.is_read ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-xs">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                  </div>
                  {!n.is_read && (
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => markRead.mutate(n.id)}>
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
