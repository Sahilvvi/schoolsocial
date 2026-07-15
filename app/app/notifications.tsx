import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

type NotifType = "admission" | "event" | "news" | "community" | "job" | "system";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: string;
  color: string;
  route?: string;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "admission",
    title: "Application Update",
    body: "Delhi Public School has received your application for Class 6. They will review it within 3-5 working days.",
    time: "2 hours ago",
    read: false,
    icon: "document-text-outline",
    color: "#2563EB",
    route: "/admissions",
  },
  {
    id: "n2",
    type: "event",
    title: "Event Reminder",
    body: "Open House at St. Mary's School is tomorrow at 10:00 AM. Don't forget to bring your documents.",
    time: "5 hours ago",
    read: false,
    icon: "calendar-outline",
    color: "#7C3AED",
    route: "/(tabs)/events",
  },
  {
    id: "n3",
    type: "community",
    title: "New Reply",
    body: "Priya Sharma replied to your post: 'Yes, Delhi Public School is excellent for CBSE board...'",
    time: "Yesterday",
    read: false,
    icon: "chatbubble-outline",
    color: "#10B981",
    route: "/community",
  },
  {
    id: "n4",
    type: "news",
    title: "New Article Published",
    body: "CBSE announces major changes to Class 10 & 12 board examination pattern for 2026-27 session.",
    time: "Yesterday",
    read: true,
    icon: "newspaper-outline",
    color: "#EF4444",
    route: "/news",
  },
  {
    id: "n5",
    type: "job",
    title: "Job Match Found",
    body: "A new Mathematics Teacher position at Sunrise Academy matches your profile. Apply before May 20.",
    time: "2 days ago",
    read: true,
    icon: "briefcase-outline",
    color: "#F59E0B",
    route: "/jobs",
  },
  {
    id: "n6",
    type: "system",
    title: "Profile Verified",
    body: "Your parent profile has been verified. You can now apply to any school on the platform.",
    time: "3 days ago",
    read: true,
    icon: "checkmark-circle-outline",
    color: "#10B981",
  },
  {
    id: "n7",
    type: "admission",
    title: "Visit Scheduled",
    body: "Your campus visit to Sunrise Academy has been scheduled for May 15, 2026 at 11:00 AM.",
    time: "4 days ago",
    read: true,
    icon: "home-outline",
    color: "#7C3AED",
    route: "/admissions",
  },
];

const TYPE_LABELS: Record<NotifType, string> = {
  admission: "Admissions",
  event: "Events",
  news: "News",
  community: "Community",
  job: "Jobs",
  system: "System",
};

const FILTER_TABS = ["All", "Unread", "Admissions", "Events", "Community"];

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === "All") return true;
    if (filter === "Unread") return !n.read;
    if (filter === "Admissions") return n.type === "admission";
    if (filter === "Events") return n.type === "event";
    if (filter === "Community") return n.type === "community";
    return true;
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const handlePress = (item: Notification) => {
    markRead(item.id);
    if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: "#EF4444" }]}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
          </Text>
        </View>
        {unreadCount > 0 && (
          <Pressable onPress={markAllRead} style={styles.markAllBtn}>
            <Text style={[styles.markAllText, { color: colors.primary }]}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      {/* Filter tabs */}
      <View style={[styles.filterRow, { borderBottomColor: colors.border }]}>
        <FlatList
          horizontal
          data={FILTER_TABS}
          keyExtractor={(t) => t}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChips}
          renderItem={({ item: tab }) => (
            <Pressable
              onPress={() => setFilter(tab)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filter === tab ? colors.primary : colors.muted,
                  borderColor: filter === tab ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.filterChipText, { color: filter === tab ? "#fff" : colors.mutedForeground }]}>
                {tab}
              </Text>
            </Pressable>
          )}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(n) => n.id}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 80 }]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.muted }]}>
              <Ionicons name="notifications-off-outline" size={40} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No notifications</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              You're all caught up! Check back later.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.notifRow,
              {
                backgroundColor: item.read ? colors.background : item.color + "08",
              },
            ]}
            onPress={() => handlePress(item)}
          >
            {/* Unread indicator */}
            {!item.read && (
              <View style={[styles.unreadDot, { backgroundColor: item.color }]} />
            )}

            {/* Icon */}
            <View style={[styles.iconWrap, { backgroundColor: item.color + "18" }]}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>

            {/* Content */}
            <View style={styles.notifContent}>
              <View style={styles.notifTop}>
                <Text style={[styles.notifTitle, { color: colors.foreground, fontWeight: item.read ? "600" : "800" }]}>
                  {item.title}
                </Text>
                <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>{item.time}</Text>
              </View>
              <Text style={[styles.notifBody, { color: colors.mutedForeground }]} numberOfLines={2}>
                {item.body}
              </Text>
              <View style={[styles.typePill, { backgroundColor: item.color + "18" }]}>
                <Text style={[styles.typeText, { color: item.color }]}>{TYPE_LABELS[item.type]}</Text>
              </View>
            </View>

            {item.route && (
              <Ionicons name="chevron-forward" size={15} color={colors.mutedForeground} />
            )}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: { marginTop: 2, padding: 2 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerTitle: { fontSize: 22, fontWeight: "800" as const, letterSpacing: -0.5 },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  unreadBadgeText: { color: "#fff", fontSize: 11, fontWeight: "800" as const },
  headerSub: { fontSize: 13, marginTop: 2 },
  markAllBtn: { paddingTop: 4 },
  markAllText: { fontSize: 13, fontWeight: "600" as const },

  filterRow: { borderBottomWidth: 1 },
  filterChips: { gap: 8, paddingHorizontal: 20, paddingVertical: 12 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: { fontSize: 13, fontWeight: "600" as const },

  list: { paddingTop: 4 },
  separator: { height: 1, marginLeft: 76 },

  notifRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    position: "relative",
  },
  unreadDot: {
    position: "absolute",
    left: 8,
    top: 18,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  notifContent: { flex: 1, gap: 4 },
  notifTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 8 },
  notifTitle: { fontSize: 14, flex: 1, lineHeight: 19 },
  notifTime: { fontSize: 11, flexShrink: 0, marginTop: 1 },
  notifBody: { fontSize: 13, lineHeight: 18 },
  typePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  typeText: { fontSize: 10, fontWeight: "700" as const },

  empty: { alignItems: "center", paddingTop: 80, gap: 12, paddingHorizontal: 40 },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 20, fontWeight: "800" as const },
  emptyText: { fontSize: 14, textAlign: "center", lineHeight: 21 },
});
