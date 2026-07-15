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
import { useAuth } from "@/context/AuthContext";

const TABS = ["All", "Questions", "Tips", "Reviews", "Events"];

const POSTS = [
  {
    id: "1",
    author: "Rahul Sharma",
    role: "Parent",
    initials: "RS",
    color: "#2563EB",
    time: "2h ago",
    tab: "Questions",
    title: "Best CBSE school in Noida under ₹80,000 annual fees?",
    body: "We are relocating to Noida Sector 50 area and looking for a good CBSE school for Class 6. Budget is around 80K/year. Any recommendations?",
    likes: 24,
    comments: 11,
    tags: ["CBSE", "Noida", "Admissions"],
  },
  {
    id: "2",
    author: "Priya Gupta",
    role: "Teacher",
    initials: "PG",
    color: "#7C3AED",
    time: "5h ago",
    tab: "Tips",
    title: "Tips for Board Exam Preparation — From a Teacher",
    body: "As a 10+ year CBSE teacher, the most underrated tip I give students: practice 5-year previous papers in timed conditions. It works better than any guide book.",
    likes: 89,
    comments: 23,
    tags: ["Board Exams", "Study Tips", "CBSE"],
  },
  {
    id: "3",
    author: "Anita Khanna",
    role: "Parent",
    initials: "AK",
    color: "#10B981",
    time: "1d ago",
    tab: "Reviews",
    title: "Honest review of Delhi Public School, Loni after 2 years",
    body: "Our son has been studying at DPS Loni for 2 years now. The academics are excellent and teachers are very supportive. The sports facilities are top notch. Only con is parking during events.",
    likes: 47,
    comments: 18,
    tags: ["DPS", "Loni", "Review"],
  },
  {
    id: "4",
    author: "Vikram Mehta",
    role: "Parent",
    initials: "VM",
    color: "#F59E0B",
    time: "2d ago",
    tab: "Questions",
    title: "IB vs CBSE for a child interested in engineering?",
    body: "My daughter is very interested in engineering and wants to appear for JEE. She's in Class 8. Should we go for IB or stick with CBSE? IB seems more international but CBSE is more JEE-focused.",
    likes: 31,
    comments: 29,
    tags: ["IB", "CBSE", "JEE", "Engineering"],
  },
  {
    id: "5",
    author: "Sunita Singh",
    role: "Parent",
    initials: "SS",
    color: "#EF4444",
    time: "3d ago",
    tab: "Tips",
    title: "How to make school visits more productive",
    body: "When visiting a new school, always ask to see the last 3 years board exam results, ask teachers about their average tenure, and visit during school hours (not on parent's day).",
    likes: 62,
    comments: 14,
    tags: ["School Visit", "Admissions", "Guide"],
  },
];

export default function CommunityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("All");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = activeTab === "All" ? POSTS : POSTS.filter((p) => p.tab === activeTab);

  const [likedIds, setLikedIds] = useState<string[]>([]);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Community</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>Parents, teachers & educators</Text>
        </View>
        {user && (
          <Pressable style={[styles.newPostBtn, { backgroundColor: colors.primary }]}>
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.newPostText}>Post</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <FlatList
            data={TABS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(t) => t}
            contentContainerStyle={styles.chips}
            style={styles.chipScroll}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setActiveTab(item)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: activeTab === item ? colors.primary : colors.card,
                    borderColor: activeTab === item ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: activeTab === item ? "#fff" : colors.mutedForeground }]}>{item}</Text>
              </Pressable>
            )}
          />
        }
        renderItem={({ item }) => {
          const isLiked = likedIds.includes(item.id);
          return (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.avatar, { backgroundColor: item.color }]}>
                  <Text style={styles.avatarText}>{item.initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.authorName, { color: colors.foreground }]}>{item.author}</Text>
                  <Text style={[styles.authorMeta, { color: colors.mutedForeground }]}>{item.role} · {item.time}</Text>
                </View>
                <View style={[styles.tabBadge, { backgroundColor: item.color + "18" }]}>
                  <Text style={[styles.tabBadgeText, { color: item.color }]}>{item.tab}</Text>
                </View>
              </View>

              <Text style={[styles.postTitle, { color: colors.foreground }]}>{item.title}</Text>
              <Text style={[styles.postBody, { color: colors.mutedForeground }]} numberOfLines={3}>{item.body}</Text>

              <View style={styles.tagsRow}>
                {item.tags.map((tag) => (
                  <View key={tag} style={[styles.tag, { backgroundColor: colors.muted }]}>
                    <Text style={[styles.tagText, { color: colors.mutedForeground }]}>#{tag}</Text>
                  </View>
                ))}
              </View>

              <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                <Pressable style={styles.footerBtn} onPress={() => toggleLike(item.id)}>
                  <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={16}
                    color={isLiked ? "#EF4444" : colors.mutedForeground}
                  />
                  <Text style={[styles.footerBtnText, { color: isLiked ? "#EF4444" : colors.mutedForeground }]}>
                    {item.likes + (isLiked ? 1 : 0)}
                  </Text>
                </Pressable>
                <Pressable style={styles.footerBtn}>
                  <Ionicons name="chatbubble-outline" size={15} color={colors.mutedForeground} />
                  <Text style={[styles.footerBtnText, { color: colors.mutedForeground }]}>{item.comments}</Text>
                </Pressable>
                <Pressable style={styles.footerBtn}>
                  <Ionicons name="share-outline" size={16} color={colors.mutedForeground} />
                  <Text style={[styles.footerBtnText, { color: colors.mutedForeground }]}>Share</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
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
  headerTitle: { fontSize: 22, fontWeight: "800" as const, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, marginTop: 2 },
  newPostBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 2,
  },
  newPostText: { color: "#fff", fontSize: 13, fontWeight: "700" as const },
  list: { paddingBottom: 100 },
  chipScroll: { marginTop: 14, marginBottom: 4 },
  chips: { gap: 8, paddingHorizontal: 20 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: "600" as const },
  card: {
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 15, fontWeight: "700" as const },
  authorName: { fontSize: 14, fontWeight: "700" as const },
  authorMeta: { fontSize: 12, marginTop: 1 },
  tabBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tabBadgeText: { fontSize: 11, fontWeight: "700" as const },
  postTitle: { fontSize: 15, fontWeight: "700" as const, lineHeight: 21 },
  postBody: { fontSize: 13, lineHeight: 19 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagText: { fontSize: 11, fontWeight: "600" as const },
  cardFooter: {
    flexDirection: "row",
    gap: 20,
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 2,
  },
  footerBtn: { flexDirection: "row", alignItems: "center", gap: 5 },
  footerBtnText: { fontSize: 13, fontWeight: "600" as const },
});
