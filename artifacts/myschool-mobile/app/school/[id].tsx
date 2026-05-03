import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { SCHOOLS } from "@/lib/data";

const TABS = ["Overview", "Facilities", "Fees", "Reviews"];

export default function SchoolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [showApply, setShowApply] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [grade, setGrade] = useState("");

  const school = SCHOOLS.find((s) => s.id === id);

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  if (!school) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Ionicons name="school-outline" size={48} color={colors.mutedForeground} />
        <Text style={[styles.notFoundText, { color: colors.foreground }]}>School not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backLink, { color: colors.primary }]}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const handleApply = () => {
    if (!name || !email || !phone || !grade) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowApply(false);
    Alert.alert(
      "Application Submitted!",
      `Your application to ${school.name} has been submitted. The school will contact you at ${email}.`,
      [{ text: "OK" }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Hero Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: school.image }} style={styles.heroImage} resizeMode="cover" />
        <View style={styles.heroOverlay} />

        {/* Back button */}
        <Pressable
          style={[styles.backBtn, { top: (Platform.OS === "web" ? 67 : insets.top) + 10 }]}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>

        {/* Share button */}
        <Pressable
          style={[styles.shareBtn, { top: (Platform.OS === "web" ? 67 : insets.top) + 10 }]}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <Ionicons name="share-outline" size={20} color="#fff" />
        </Pressable>

        {/* Hero info */}
        <View style={styles.heroInfo}>
          {school.isVerified && (
            <View style={[styles.verifiedBadge, { backgroundColor: "#10B981" }]}>
              <Ionicons name="checkmark-circle" size={12} color="#fff" />
              <Text style={styles.verifiedText}>Govt. Verified</Text>
            </View>
          )}
          <Text style={styles.heroName}>{school.name}</Text>
          <View style={styles.heroMeta}>
            <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.85)" />
            <Text style={styles.heroMetaText}>{school.location}</Text>
            <View style={styles.heroBoardBadge}>
              <Text style={styles.heroBoardText}>{school.board}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick stats */}
      <View style={[styles.quickStats, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {[
          { icon: "star", value: school.rating.toString(), label: `(${school.reviewCount})`, color: "#F59E0B" },
          { icon: "people-outline", value: school.students.toLocaleString(), label: "Students", color: colors.primary },
          { icon: "cash-outline", value: school.fees, label: "Per Year", color: "#10B981" },
          { icon: "calendar-outline", value: school.established.toString(), label: "Est.", color: colors.secondary },
        ].map((stat, i) => (
          <View key={i} style={styles.quickStat}>
            <Ionicons name={stat.icon as any} size={18} color={stat.color} />
            <Text style={[styles.quickStatValue, { color: colors.foreground }]}>{stat.value}</Text>
            <Text style={[styles.quickStatLabel, { color: colors.mutedForeground }]}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {TABS.map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                {
                  borderBottomColor: activeTab === tab ? colors.primary : "transparent",
                  borderBottomWidth: 2,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === tab ? colors.primary : colors.mutedForeground },
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: bottomPad + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "Overview" && (
          <View style={{ gap: 16 }}>
            <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.infoCardTitle, { color: colors.foreground }]}>About</Text>
              <Text style={[styles.infoCardText, { color: colors.mutedForeground }]}>
                {school.description}
              </Text>
            </View>
            {[
              { label: "Principal", value: school.principal, icon: "person-outline" },
              { label: "Grades", value: school.grades, icon: "school-outline" },
              { label: "Type", value: school.type, icon: "business-outline" },
              { label: "Affiliation", value: school.affiliation, icon: "ribbon-outline" },
              { label: "City", value: school.city, icon: "location-outline" },
            ].map((row) => (
              <View key={row.label} style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                <Ionicons name={row.icon as any} size={16} color={colors.primary} />
                <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
                <Text style={[styles.infoValue, { color: colors.foreground }]}>{row.value}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "Facilities" && (
          <View style={{ gap: 12 }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Available Facilities
            </Text>
            <View style={styles.facilitiesGrid}>
              {school.facilities.map((f) => (
                <View key={f} style={[styles.facilityPill, { backgroundColor: colors.accent, borderColor: colors.primary + "30" }]}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
                  <Text style={[styles.facilityText, { color: colors.primary }]}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "Fees" && (
          <View style={{ gap: 12 }}>
            <View style={[styles.feeCard, { backgroundColor: colors.primary }]}>
              <Text style={styles.feeCardLabel}>Annual Fees</Text>
              <Text style={styles.feeCardAmount}>{school.fees}</Text>
              <Text style={styles.feeCardNote}>Inclusive of tuition, activity & development fees</Text>
            </View>
            <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.infoCardTitle, { color: colors.foreground }]}>Fee Structure</Text>
              {[
                { item: "Tuition Fee", amount: "₹" + Math.round(school.feeAmount * 0.7).toLocaleString() },
                { item: "Activity Fee", amount: "₹" + Math.round(school.feeAmount * 0.15).toLocaleString() },
                { item: "Development Fee", amount: "₹" + Math.round(school.feeAmount * 0.1).toLocaleString() },
                { item: "Other Charges", amount: "₹" + Math.round(school.feeAmount * 0.05).toLocaleString() },
              ].map((row) => (
                <View key={row.item} style={[styles.feeRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.feeItem, { color: colors.foreground }]}>{row.item}</Text>
                  <Text style={[styles.feeAmount, { color: colors.primary }]}>{row.amount}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "Reviews" && (
          <View style={{ gap: 12 }}>
            <View style={[styles.ratingOverview, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.bigRating, { color: colors.foreground }]}>{school.rating}</Text>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons
                    key={s}
                    name={s <= Math.round(school.rating) ? "star" : "star-outline"}
                    size={18}
                    color="#F59E0B"
                  />
                ))}
              </View>
              <Text style={[styles.reviewCount, { color: colors.mutedForeground }]}>
                Based on {school.reviewCount} reviews
              </Text>
            </View>
            {[
              { name: "Rahul Sharma", rating: 5, comment: "Excellent school! My daughter loves the sports facilities. Teachers are very dedicated and approachable.", date: "2 weeks ago" },
              { name: "Priya Singh", rating: 4, comment: "Very good academics and a nurturing environment. Fees are on the higher side but worth it.", date: "1 month ago" },
              { name: "Amit Gupta", rating: 5, comment: "Best school in the area. The principal is very accessible and the school culture is great.", date: "3 months ago" },
            ].map((r, i) => (
              <View key={i} style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.reviewHeader}>
                  <View style={[styles.reviewAvatar, { backgroundColor: colors.primary }]}>
                    <Text style={styles.reviewAvatarText}>{r.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.reviewMeta}>
                    <Text style={[styles.reviewName, { color: colors.foreground }]}>{r.name}</Text>
                    <Text style={[styles.reviewDate, { color: colors.mutedForeground }]}>{r.date}</Text>
                  </View>
                  <View style={styles.reviewRating}>
                    <Ionicons name="star" size={13} color="#F59E0B" />
                    <Text style={[styles.reviewRatingText, { color: colors.foreground }]}>{r.rating}</Text>
                  </View>
                </View>
                <Text style={[styles.reviewComment, { color: colors.mutedForeground }]}>{r.comment}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Apply Now / Book Visit */}
      {!showApply ? (
        <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
          <Pressable
            style={[styles.outlineBtn, { borderColor: colors.primary }]}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Ionicons name="call-outline" size={18} color={colors.primary} />
            <Text style={[styles.outlineBtnText, { color: colors.primary }]}>Book Visit</Text>
          </Pressable>
          <Pressable
            style={[styles.applyBtn, { backgroundColor: colors.primary }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setShowApply(true);
            }}
          >
            <Text style={styles.applyBtnText}>Apply Now</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </Pressable>
        </View>
      ) : (
        <View style={[styles.applyForm, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
          <View style={styles.applyFormHeader}>
            <Text style={[styles.applyFormTitle, { color: colors.foreground }]}>Apply to {school.name}</Text>
            <Pressable onPress={() => setShowApply(false)}>
              <Ionicons name="close" size={22} color={colors.mutedForeground} />
            </Pressable>
          </View>
          {[
            { placeholder: "Your Full Name", value: name, setter: setName, keyboard: "default" as const },
            { placeholder: "Email Address", value: email, setter: setEmail, keyboard: "email-address" as const },
            { placeholder: "Phone Number", value: phone, setter: setPhone, keyboard: "phone-pad" as const },
            { placeholder: "Grade Applying For", value: grade, setter: setGrade, keyboard: "default" as const },
          ].map((f) => (
            <View key={f.placeholder} style={[styles.applyInput, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <TextInput
                style={[{ color: colors.foreground, flex: 1, fontSize: 14, padding: 0 }]}
                placeholder={f.placeholder}
                placeholderTextColor={colors.mutedForeground}
                value={f.value}
                onChangeText={f.setter}
                keyboardType={f.keyboard}
              />
            </View>
          ))}
          <Pressable
            style={[styles.applyBtn, { backgroundColor: colors.primary, marginTop: 4 }]}
            onPress={handleApply}
          >
            <Text style={styles.applyBtnText}>Submit Application</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: { position: "relative" },
  heroImage: { width: "100%", height: 260 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  backBtn: {
    position: "absolute",
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  shareBtn: {
    position: "absolute",
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroInfo: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    gap: 6,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  verifiedText: { color: "#fff", fontSize: 11, fontWeight: "700" as const },
  heroName: { color: "#fff", fontSize: 22, fontWeight: "800" as const, letterSpacing: -0.5 },
  heroMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  heroMetaText: { color: "rgba(255,255,255,0.85)", fontSize: 13, flex: 1 },
  heroBoardBadge: {
    backgroundColor: "rgba(37,99,235,0.85)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  heroBoardText: { color: "#fff", fontSize: 11, fontWeight: "700" as const },
  quickStats: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  quickStat: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  quickStatValue: { fontSize: 13, fontWeight: "700" as const },
  quickStatLabel: { fontSize: 11 },
  tabBar: { borderBottomWidth: 1 },
  tabScroll: { paddingHorizontal: 16 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginRight: 4,
  },
  tabText: { fontSize: 14, fontWeight: "600" as const },
  infoCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  infoCardTitle: { fontSize: 16, fontWeight: "700" as const },
  infoCardText: { fontSize: 14, lineHeight: 21 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
  },
  infoLabel: { fontSize: 13, width: 100 },
  infoValue: { fontSize: 13, fontWeight: "600" as const, flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: "700" as const },
  facilitiesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  facilityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  facilityText: { fontSize: 13, fontWeight: "600" as const },
  feeCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 4,
  },
  feeCardLabel: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "600" as const },
  feeCardAmount: { color: "#fff", fontSize: 32, fontWeight: "800" as const, letterSpacing: -1 },
  feeCardNote: { color: "rgba(255,255,255,0.7)", fontSize: 12, textAlign: "center", marginTop: 4 },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  feeItem: { fontSize: 14 },
  feeAmount: { fontSize: 14, fontWeight: "600" as const },
  ratingOverview: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    gap: 6,
  },
  bigRating: { fontSize: 52, fontWeight: "800" as const, letterSpacing: -2 },
  stars: { flexDirection: "row", gap: 4 },
  reviewCount: { fontSize: 13 },
  reviewCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  reviewHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewAvatarText: { color: "#fff", fontSize: 15, fontWeight: "700" as const },
  reviewMeta: { flex: 1 },
  reviewName: { fontSize: 14, fontWeight: "700" as const },
  reviewDate: { fontSize: 12 },
  reviewRating: { flexDirection: "row", alignItems: "center", gap: 3 },
  reviewRatingText: { fontSize: 13, fontWeight: "700" as const },
  reviewComment: { fontSize: 13, lineHeight: 20 },
  bottomBar: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  outlineBtnText: { fontSize: 15, fontWeight: "700" as const },
  applyBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
  },
  applyBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" as const },
  applyForm: {
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
  },
  applyFormHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  applyFormTitle: { fontSize: 16, fontWeight: "700" as const },
  applyInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  notFoundText: { fontSize: 18, fontWeight: "700" as const },
  backLink: { fontSize: 15, fontWeight: "600" as const },
});
