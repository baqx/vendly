"use client";

import { useState } from "react";
import useSWR from "swr";
import { swrFetcher } from "@/lib/swr";
import { apiJson } from "@/lib/api";
import { Bell, Check, ShoppingBag, MessageSquare, Info, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "ORDER" | "CHAT" | "SYSTEM";
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications, mutate, isLoading } = useSWR<Notification[]>("/notifications", swrFetcher as any, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });
  const { data: unreadCountResp } = useSWR<number>("/notifications/unread-count", swrFetcher as any, {
    refreshInterval: 30000,
  });

  const unreadCount = unreadCountResp || 0;

  const markAsRead = async (id: string) => {
    try {
      await apiJson(`/notifications/${id}/read`, "PATCH");
      mutate();
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiJson("/notifications/read-all", "PATCH");
      mutate();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "ORDER": return <ShoppingBag size={16} className="text-blue-600" />;
      case "CHAT": return <MessageSquare size={16} className="text-green-600" />;
      default: return <Info size={16} className="text-amber-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-muted-foreground hover:bg-muted rounded-[4px] transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-background text-[10px] font-black text-white flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border shadow-xl rounded-[4px] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <h3 className="text-sm font-black text-foreground uppercase tracking-wider">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold text-green-700 dark:text-green-500 hover:underline px-2 py-1"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto no-scrollbar">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-green-700" size={24} />
                </div>
              ) : notifications?.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <Bell size={32} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">All caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {notifications?.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => !notif.isRead && markAsRead(notif.id)}
                      className={`p-4 flex gap-4 transition-colors cursor-pointer ${notif.isRead ? 'bg-background hover:bg-muted/30' : 'bg-green-50/50 dark:bg-green-900/10 hover:bg-green-50 dark:hover:bg-green-900/20'}`}
                    >
                      <div className={`w-10 h-10 rounded-[4px] shrink-0 flex items-center justify-center border border-border/50 ${notif.isRead ? 'bg-muted/50' : 'bg-white dark:bg-card shadow-sm'}`}>
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm tracking-tight ${notif.isRead ? 'font-bold text-foreground/80' : 'font-black text-foreground'}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium mt-2">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!notif.isRead && (
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-border bg-muted/20 text-center">
              <button 
                className="text-[11px] font-black text-foreground hover:text-green-700 transition-colors uppercase tracking-widest"
                onClick={() => setIsOpen(false)}
              >
                Close Panel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
