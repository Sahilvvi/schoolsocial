import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

/* ─── Static demo data ─────────────────────────────── */
const PARENT_CHILDREN = [
  { name: "Aryan Sharma", grade: "Class 6", school: "Delhi Public School", board: "CBSE", status: "Enrolled", color: "#2563EB" },
  { name: "Priya Sharma", grade: "Class 3", school: "Ryan International", board: "CBSE", status: "Enrolled", color: "#7C3AED" },
];
const PARENT_FEES = [
  { term: "Term 1 Fee", school: "Delhi Public School", amount: 22000, status: "paid", due: "Apr 10, 2026" },
  { term: "Term 2 Fee", school: "Delhi Public School", amount: 22000, status: "pending", due: "Aug 10, 2026" },
  { term: "Annual Charges", school: "Ryan International", amount: 8500, status: "paid", due: "Mar 1, 2026" },
  { term: "Term 1 Fee", school: "Ryan International", amount: 15000, status: "overdue", due: "Apr 5, 2026" },
];
const PARENT_ACTIVITY = [
  { icon: "checkmark-circle", color: "#10B981", title: "Application submitted", subtitle: "Delhi Public School — Class 7", time: "2h ago" },
  { icon: "star", color: "#F59E0B", title: "Review posted", subtitle: "Ryan International — 5 stars", time: "1d ago" },
  { icon: "calendar", color: "#2563EB", title: "Event registered", subtitle: "Science Exhibition — May 15", time: "2d ago" },
  { icon: "bookmark", color: "#EF4444", title: "School saved", subtitle: "The Millennium School, Noida", time: "3d ago" },
];

const SCHOOL_CHART = [10, 16, 12, 20, 17, 26, 22, 30];
const SCHOOL_ENQUIRIES = [
  { initials: "PV", color: "#7C3AED", name: "Priya Verma", sub: "Class 5 Admission", time: "2h ago", badge: "New" },
  { initials: "AS", color: "#10B981", name: "Amit Singh", sub: "Fee Structure", time: "5h ago", badge: "New" },
  { initials: "NG", color: "#F59E0B", name: "Neha Gupta", sub: "Transport Facility", time: "1d ago", badge: "In Progress" },
  { initials: "RM", color: "#EF4444", name: "Rahul Mehta", sub: "Sports Activities", time: "2d ago", badge: "In Progress" },
];
const SCHOOL_REVIEWS = [
  { initials: "AS", color: "#7C3AED", name: "Parent of Aarav Sharma", rating: 5, time: "2 days ago", comment: "Excellent school with great infrastructure and supportive teachers." },
  { initials: "AP", color: "#2563EB", name: "Parent of Ananya Patel", rating: 4, time: "1 week ago", comment: "Good academic environment and strong co-curricular activities." },
];

const TEACHER_SCHEDULE = [
  { time: "8:30 AM", subject: "Mathematics", class: "Class 9-A", room: "Room 14", duration: "45 min" },
  { time: "10:00 AM", subject: "Mathematics", class: "Class 10-B", room: "Room 7", duration: "45 min" },
  { time: "11:30 AM", subject: "Free Period", class: "—", room: "Staff Room", duration: "45 min" },
  { time: "1:00 PM", subject: "Mathematics", class: "Class 8-C", room: "Room 3", duration: "45 min" },
];
const TEACHER_STATS = [
  { label: "Students", value: "142", icon: "people-outline", color: "#2563EB" },
  { label: "Classes", value: "6", icon: "school-outline", color: "#7C3AED" },
  { label: "Attendance", value: "94%", icon: "checkmark-circle-outline", color: "#10B981" },
  { label: "Avg Score", value: "78%", icon: "bar-chart-outline", color: "#F59E0B" },
];

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const role = user?.role ?? "parent";

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const roleConfig: Record<string, { label: string; color: string; bg: string }> = {
    parent: { label: "Parent Dashboard", color: "#2563EB", bg: "#EFF6FF" },
    school: { label: "School Dashboard", color: "#7C3AED", bg: "#F5F3FF" },
    teacher: { label: "Teacher Dashboard", color: "#10B981", bg: "#ECFDF5" },
    admin: { label: "Admin Dashboard", color: "#EF4444", bg: "#FEF2F2" },
  };
  const rc = roleConfig[role] ?? roleConfig.parent;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{rc.label}</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            Welcome back, {user?.name?.split(" ")[0] ?? "User"}
          </Text>
        </View>
        <Pressable
          style={[styles.scanBtn, { backgroundColor: rc.color }]}
          onPress={() => router.push("/scanner" as any)}
        >
          <Ionicons name="qr-code-outline" size={18} color="#fff" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 90 }]}>
        {role === "parent" && <ParentDashboard colors={colors} router={router} />}
        {role === "school" && <SchoolDashboard colors={colors} router={router} />}
        {role === "teacher" && <TeacherDashboard colors={colors} router={router} />}
        {role === "admin" && <AdminDashboard colors={colors} router={router} />}
      </ScrollView>
    </View>
  );
}

/* ─── PARENT ─────────────────────────────────────────── */
function ParentDashboard({ colors, router }: any) {
  const totalPaid = PARENT_FEES.filter(f => f.status === "paid").reduce((s, f) => s + f.amount, 0);
  const totalDue = PARENT_FEES.filter(f => f.status !== "paid").reduce((s, f) => s + f.amount, 0);
  const overdueCount = PARENT_FEES.filter(f => f.status === "overdue").length;

  const stats = [
    { label: "Applications", value: "2", sub: "1 pending", color: "#2563EB", icon: "document-text-outline", route: "/admissions" },
    { label: "Saved", value: "7", sub: "schools", color: "#EF4444", icon: "heart-outline", route: "/saved" },
    { label: "Bookings", value: "1", sub: "session", color: "#7C3AED", icon: "book-outline", route: null },
    { label: "Fees Due", value: `₹${(totalDue / 1000).toFixed(0)}K`, sub: overdueCount > 0 ? `${overdueCount} overdue` : "on track", color: overdueCount > 0 ? "#EF4444" : "#10B981", icon: "cash-outline", route: null },
  ];

  return (
    <>
      {/* Stats grid */}
      <View style={styles.statsGrid}>
        {stats.map((s) => (
          <Pressable
            key={s.label}
            style={[styles.statCard, { backgroundColor: colors.card, borderColor: s.color + "30" }]}
            onPress={() => { if (s.route) { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(s.route as any); } }}
          >
            <View style={[styles.statIconWrap, { backgroundColor: s.color + "14" }]}>
              <Ionicons name={s.icon as any} size={18} color={s.color} />
            </View>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            <Text style={[styles.statSub, { color: s.color }]}>{s.sub}</Text>
          </Pressable>
        ))}
      </View>

      {/* Children */}
      <SectionHeader title="My Children" colors={colors} />
      {PARENT_CHILDREN.map((child) => (
        <View key={child.name} style={[styles.childCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.childAvatar, { backgroundColor: child.color }]}>
            <Text style={styles.childAvatarText}>{child.name.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.childName, { color: colors.foreground }]}>{child.name}</Text>
            <Text style={[styles.childSchool, { color: colors.mutedForeground }]}>{child.school} · {child.grade}</Text>
          </View>
          <View style={[styles.enrolledBadge, { backgroundColor: "#10B98115" }]}>
            <Text style={[styles.enrolledText, { color: "#10B981" }]}>{child.status}</Text>
          </View>
        </View>
      ))}

      {/* Fees overview */}
      <SectionHeader title="Fee Records" colors={colors} />
      <View style={[styles.feeSummary, { backgroundColor: colors.muted }]}>
        {[
          { label: "Paid", value: `₹${totalPaid.toLocaleString()}`, color: "#10B981" },
          { label: "Due", value: `₹${totalDue.toLocaleString()}`, color: "#F59E0B" },
          { label: "Records", value: PARENT_FEES.length.toString(), color: "#2563EB" },
        ].map((s) => (
          <View key={s.label} style={styles.feeSummaryItem}>
            <Text style={[styles.feeSummaryValue, { color: s.color }]}>{s.value}</Text>
            <Text style={[styles.feeSummaryLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
          </View>
        ))}
      </View>
      {PARENT_FEES.map((fee) => {
        const feeColor = fee.status === "paid" ? "#10B981" : fee.status === "overdue" ? "#EF4444" : "#F59E0B";
        return (
          <View key={fee.term + fee.school} style={[styles.feeRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.feeIcon, { backgroundColor: feeColor + "15" }]}>
              <Ionicons name="cash-outline" size={16} color={feeColor} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.feeTitle, { color: colors.foreground }]}>{fee.term}</Text>
              <Text style={[styles.feeSub, { color: colors.mutedForeground }]}>{fee.school} · Due {fee.due}</Text>
            </View>
            <View>
              <Text style={[styles.feeAmount, { color: colors.foreground }]}>₹{fee.amount.toLocaleString()}</Text>
              <View style={[styles.feeBadge, { backgroundColor: feeColor + "15" }]}>
                <Text style={[styles.feeBadgeText, { color: feeColor }]}>{fee.status.toUpperCase()}</Text>
              </View>
            </View>
          </View>
        );
      })}

      {/* Recent activity */}
      <SectionHeader title="Recent Activity" colors={colors} />
      {PARENT_ACTIVITY.map((a) => (
        <View key={a.title + a.time} style={[styles.activityRow, { borderBottomColor: colors.border }]}>
          <View style={[styles.activityIcon, { backgroundColor: a.color + "15" }]}>
            <Ionicons name={a.icon as any} size={16} color={a.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.activityTitle, { color: colors.foreground }]}>{a.title}</Text>
            <Text style={[styles.activitySub, { color: colors.mutedForeground }]}>{a.subtitle}</Text>
          </View>
          <Text style={[styles.activityTime, { color: colors.mutedForeground }]}>{a.time}</Text>
        </View>
      ))}
    </>
  );
}

/* ─── SCHOOL ─────────────────────────────────────────── */
function SchoolDashboard({ colors, router }: any) {
  const quickActions = [
    { icon: "create-outline", label: "Edit Profile", color: "#2563EB", route: null },
    { icon: "image-outline", label: "Add Photos", color: "#7C3AED", route: null },
    { icon: "calendar-outline", label: "Add Event", color: "#F59E0B", route: "/(tabs)/events" },
    { icon: "briefcase-outline", label: "Post Job", color: "#10B981", route: "/jobs" },
    { icon: "qr-code-outline", label: "QR Codes", color: "#EF4444", route: "/scanner" },
    { icon: "star-outline", label: "Reviews", color: "#F97316", route: null },
  ];

  return (
    <>
      {/* Stats */}
      <View style={styles.statsGrid}>
        {[
          { label: "Profile Views", value: "1,340", sub: "+22% this week", color: "#2563EB", icon: "eye-outline" },
          { label: "Enquiries", value: "28", sub: "4 new today", color: "#7C3AED", icon: "chatbubble-outline" },
          { label: "Applications", value: "14", sub: "5 pending", color: "#F59E0B", icon: "document-text-outline" },
          { label: "Avg Rating", value: "4.7★", sub: "98 reviews", color: "#10B981", icon: "star-outline" },
        ].map((s) => (
          <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: s.color + "30" }]}>
            <View style={[styles.statIconWrap, { backgroundColor: s.color + "14" }]}>
              <Ionicons name={s.icon as any} size={18} color={s.color} />
            </View>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            <Text style={[styles.statSub, { color: s.color }]}>{s.sub}</Text>
          </View>
        ))}
      </View>

      {/* Mini sparkline chart */}
      <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.chartTitle, { color: colors.foreground }]}>Profile Views (Last 8 Days)</Text>
        <View style={styles.sparkline}>
          {SCHOOL_CHART.map((v, i) => (
            <View key={i} style={styles.sparklineBar}>
              <View style={[styles.sparklineBarFill, { height: (v / 34) * 60, backgroundColor: "#7C3AED" + (i === SCHOOL_CHART.length - 1 ? "FF" : "60") }]} />
            </View>
          ))}
        </View>
        <View style={styles.sparklineLegend}>
          <Text style={[styles.sparklineLegendText, { color: colors.mutedForeground }]}>10 days ago</Text>
          <Text style={[styles.sparklineLegendText, { color: colors.mutedForeground }]}>Today</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <SectionHeader title="Quick Actions" colors={colors} />
      <View style={styles.quickGrid}>
        {quickActions.map((a) => (
          <Pressable
            key={a.label}
            style={[styles.quickCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); if (a.route) router.push(a.route as any); }}
          >
            <View style={[styles.quickIcon, { backgroundColor: a.color + "14" }]}>
              <Ionicons name={a.icon as any} size={20} color={a.color} />
            </View>
            <Text style={[styles.quickLabel, { color: colors.foreground }]}>{a.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Recent Enquiries */}
      <SectionHeader title="Recent Enquiries" colors={colors} />
      {SCHOOL_ENQUIRIES.map((e) => (
        <View key={e.name} style={[styles.enquiryRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.enquiryAvatar, { backgroundColor: e.color }]}>
            <Text style={styles.enquiryAvatarText}>{e.initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.enquiryName, { color: colors.foreground }]}>{e.name}</Text>
            <Text style={[styles.enquirySub, { color: colors.mutedForeground }]}>{e.sub}</Text>
          </View>
          <View style={{ alignItems: "flex-end", gap: 4 }}>
            <Text style={[styles.enquiryTime, { color: colors.mutedForeground }]}>{e.time}</Text>
            <View style={[styles.enquiryBadge, { backgroundColor: e.badge === "New" ? "#2563EB15" : "#F59E0B15" }]}>
              <Text style={[styles.enquiryBadgeText, { color: e.badge === "New" ? "#2563EB" : "#F59E0B" }]}>{e.badge}</Text>
            </View>
          </View>
        </View>
      ))}

      {/* Recent Reviews */}
      <SectionHeader title="Recent Reviews" colors={colors} />
      {SCHOOL_REVIEWS.map((r) => (
        <View key={r.name} style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.reviewHeader}>
            <View style={[styles.reviewAvatar, { backgroundColor: r.color }]}>
              <Text style={styles.reviewAvatarText}>{r.initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.reviewName, { color: colors.foreground }]}>{r.name}</Text>
              <Text style={[styles.reviewTime, { color: colors.mutedForeground }]}>{r.time}</Text>
            </View>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons key={i} name={i <= r.rating ? "star" : "star-outline"} size={12} color="#F59E0B" />
              ))}
            </View>
          </View>
          <Text style={[styles.reviewComment, { color: colors.mutedForeground }]}>{r.comment}</Text>
        </View>
      ))}
    </>
  );
}

/* ─── TEACHER ─────────────────────────────────────────── */
function TeacherDashboard({ colors, router }: any) {
  return (
    <>
      {/* Stats */}
      <View style={styles.statsGrid}>
        {TEACHER_STATS.map((s) => (
          <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: s.color + "30" }]}>
            <View style={[styles.statIconWrap, { backgroundColor: s.color + "14" }]}>
              <Ionicons name={s.icon as any} size={18} color={s.color} />
            </View>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Today's Schedule */}
      <SectionHeader title="Today's Schedule" colors={colors} />
      {TEACHER_SCHEDULE.map((s, i) => (
        <View key={i} style={[styles.scheduleRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.scheduleTime, { borderRightColor: colors.border }]}>
            <Text style={[styles.scheduleTimeText, { color: colors.primary }]}>{s.time}</Text>
            <Text style={[styles.scheduleDuration, { color: colors.mutedForeground }]}>{s.duration}</Text>
          </View>
          <View style={{ flex: 1, paddingLeft: 12 }}>
            <Text style={[styles.scheduleSubject, { color: colors.foreground }]}>{s.subject}</Text>
            <Text style={[styles.scheduleClass, { color: colors.mutedForeground }]}>{s.class} · {s.room}</Text>
          </View>
          {s.subject !== "Free Period" && (
            <View style={[styles.scheduleBadge, { backgroundColor: colors.primary + "14" }]}>
              <Text style={[styles.scheduleBadgeText, { color: colors.primary }]}>Class</Text>
            </View>
          )}
        </View>
      ))}

      {/* Quick Actions */}
      <SectionHeader title="Quick Actions" colors={colors} />
      <View style={styles.quickGrid}>
        {[
          { icon: "briefcase-outline", label: "Find Jobs", color: "#10B981", route: "/jobs" },
          { icon: "people-outline", label: "Community", color: "#7C3AED", route: "/community" },
          { icon: "newspaper-outline", label: "News", color: "#EF4444", route: "/news" },
          { icon: "qr-code-outline", label: "QR Scanner", color: "#2563EB", route: "/scanner" },
        ].map((a) => (
          <Pressable
            key={a.label}
            style={[styles.quickCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(a.route as any); }}
          >
            <View style={[styles.quickIcon, { backgroundColor: a.color + "14" }]}>
              <Ionicons name={a.icon as any} size={20} color={a.color} />
            </View>
            <Text style={[styles.quickLabel, { color: colors.foreground }]}>{a.label}</Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}

/* ─── ADMIN ──────────────────────────────────────────── */
function AdminDashboard({ colors, router }: any) {
  const stats = [
    { label: "Schools", value: "512", sub: "+8 this month", color: "#2563EB", icon: "school-outline" },
    { label: "Users", value: "14.2K", sub: "Active accounts", color: "#7C3AED", icon: "people-outline" },
    { label: "Applications", value: "834", sub: "This month", color: "#F59E0B", icon: "document-text-outline" },
    { label: "Revenue", value: "₹2.4L", sub: "This month", color: "#10B981", icon: "cash-outline" },
  ];
  const modules = [
    { icon: "school-outline", label: "Schools", color: "#2563EB", route: "/(tabs)/schools" },
    { icon: "people-outline", label: "Users", color: "#7C3AED", route: null },
    { icon: "document-text-outline", label: "Admissions", color: "#F59E0B", route: "/admissions" },
    { icon: "briefcase-outline", label: "Jobs", color: "#10B981", route: "/jobs" },
    { icon: "newspaper-outline", label: "News", color: "#EF4444", route: "/news" },
    { icon: "star-outline", label: "Reviews", color: "#F97316", route: null },
  ];
  return (
    <>
      <View style={styles.statsGrid}>
        {stats.map((s) => (
          <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: s.color + "30" }]}>
            <View style={[styles.statIconWrap, { backgroundColor: s.color + "14" }]}>
              <Ionicons name={s.icon as any} size={18} color={s.color} />
            </View>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            <Text style={[styles.statSub, { color: s.color }]}>{s.sub}</Text>
          </View>
        ))}
      </View>
      <SectionHeader title="Platform Modules" colors={colors} />
      <View style={styles.quickGrid}>
        {modules.map((a) => (
          <Pressable
            key={a.label}
            style={[styles.quickCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); if (a.route) router.push(a.route as any); }}
          >
            <View style={[styles.quickIcon, { backgroundColor: a.color + "14" }]}>
              <Ionicons name={a.icon as any} size={20} color={a.color} />
            </View>
            <Text style={[styles.quickLabel, { color: colors.foreground }]}>{a.label}</Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}

/* ─── Reusable ──────────────────────────────────────── */
function SectionHeader({ title, colors }: { title: string; colors: any }) {
  return (
    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
  );
}

/* ─── Styles ─────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: { padding: 2 },
  headerTitle: { fontSize: 22, fontWeight: "800" as const, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, marginTop: 1 },
  scanBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },

  scroll: { padding: 20, gap: 0 },
  sectionTitle: { fontSize: 17, fontWeight: "800" as const, letterSpacing: -0.3, marginTop: 22, marginBottom: 10 },

  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: {
    width: "47.5%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: "800" as const, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, fontWeight: "600" as const, letterSpacing: 0.5 },
  statSub: { fontSize: 11 },

  childCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  childAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  childAvatarText: { color: "#fff", fontSize: 18, fontWeight: "800" as const },
  childName: { fontSize: 15, fontWeight: "700" as const },
  childSchool: { fontSize: 12, marginTop: 2 },
  enrolledBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  enrolledText: { fontSize: 11, fontWeight: "700" as const },

  feeSummary: { flexDirection: "row", borderRadius: 14, overflow: "hidden", marginBottom: 10 },
  feeSummaryItem: { flex: 1, alignItems: "center", paddingVertical: 12 },
  feeSummaryValue: { fontSize: 16, fontWeight: "800" as const },
  feeSummaryLabel: { fontSize: 11, marginTop: 1 },
  feeRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  feeIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  feeTitle: { fontSize: 14, fontWeight: "700" as const },
  feeSub: { fontSize: 12, marginTop: 2 },
  feeAmount: { fontSize: 14, fontWeight: "800" as const, textAlign: "right" as const },
  feeBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, alignSelf: "flex-end" as const, marginTop: 3 },
  feeBadgeText: { fontSize: 9, fontWeight: "800" as const },

  activityRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: 1 },
  activityIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  activityTitle: { fontSize: 13, fontWeight: "700" as const },
  activitySub: { fontSize: 12, marginTop: 2 },
  activityTime: { fontSize: 11 },

  chartCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginTop: 20 },
  chartTitle: { fontSize: 14, fontWeight: "700" as const, marginBottom: 12 },
  sparkline: { flexDirection: "row", alignItems: "flex-end", gap: 4, height: 60 },
  sparklineBar: { flex: 1, justifyContent: "flex-end" as const },
  sparklineBarFill: { borderRadius: 4 },
  sparklineLegend: { flexDirection: "row", justifyContent: "space-between" as const, marginTop: 6 },
  sparklineLegendText: { fontSize: 10 },

  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  quickCard: { width: "30.5%", borderRadius: 14, borderWidth: 1, padding: 12, alignItems: "center" as const, gap: 8 },
  quickIcon: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  quickLabel: { fontSize: 12, fontWeight: "700" as const, textAlign: "center" as const },

  enquiryRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  enquiryAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  enquiryAvatarText: { color: "#fff", fontSize: 15, fontWeight: "800" as const },
  enquiryName: { fontSize: 14, fontWeight: "700" as const },
  enquirySub: { fontSize: 12, marginTop: 2 },
  enquiryTime: { fontSize: 11 },
  enquiryBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  enquiryBadgeText: { fontSize: 10, fontWeight: "700" as const },

  reviewCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 8, gap: 10 },
  reviewHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  reviewAvatar: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  reviewAvatarText: { color: "#fff", fontSize: 14, fontWeight: "800" as const },
  reviewName: { fontSize: 13, fontWeight: "700" as const },
  reviewTime: { fontSize: 11, marginTop: 1 },
  stars: { flexDirection: "row", gap: 1 },
  reviewComment: { fontSize: 13, lineHeight: 19 },

  scheduleRow: { flexDirection: "row", alignItems: "center", borderRadius: 14, borderWidth: 1, marginBottom: 8, overflow: "hidden" as const },
  scheduleTime: { width: 85, padding: 14, borderRightWidth: 1, alignItems: "center" as const },
  scheduleTimeText: { fontSize: 12, fontWeight: "800" as const },
  scheduleDuration: { fontSize: 10, marginTop: 2 },
  scheduleSubject: { fontSize: 14, fontWeight: "700" as const },
  scheduleClass: { fontSize: 12, marginTop: 2 },
  scheduleBadge: { paddingHorizontal: 10, paddingVertical: 4, marginRight: 12, borderRadius: 8 },
  scheduleBadgeText: { fontSize: 11, fontWeight: "700" as const },
});
