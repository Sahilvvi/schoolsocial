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

import { useColors } from "@/hooks/useColors";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "₹2,499",
    period: "/year",
    badge: null,
    color: "#2563EB",
    gradient: ["#2563EB", "#0EA5E9"],
    icon: "flash-outline",
    description: "Get started with a verified school profile and QR-based admissions.",
    features: [
      { text: "Basic Profile (5 Photos)", included: true },
      { text: "1 Admission Form (QR Based)", included: true },
      { text: "Monthly Response Tracking", included: true },
      { text: "Digital QR Code", included: true },
      { text: "Standard Template", included: true },
      { text: "Limited Class Info", included: true },
      { text: "Job Posting / Teacher Hiring", included: false },
      { text: "Event Posting", included: false },
      { text: "Priority Lead Alerts", included: false },
      { text: "Featured in Search Results", included: false },
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: "₹3,999",
    period: "/year",
    badge: "Most Popular",
    color: "#7C3AED",
    gradient: ["#7C3AED", "#6D28D9"],
    icon: "rocket-outline",
    description: "Everything in Basic plus job posting, event management, and a physical QR.",
    features: [
      { text: "Profile with up to 15 Photos", included: true },
      { text: "2 Admission Forms (1 Customisable)", included: true },
      { text: "Day-wise Admission Tracking + Export", included: true },
      { text: "1 Laminated Physical QR Code", included: true },
      { text: "Limited Customization (Question Change)", included: true },
      { text: "Class-wise Details", included: true },
      { text: "Job Posting / Teacher Hiring", included: true },
      { text: "Event Posting (Public / Private)", included: true },
      { text: "Priority Lead Alerts", included: false },
      { text: "Featured in Search Results", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹4,999",
    period: "/year",
    badge: "Best Value",
    color: "#F59E0B",
    gradient: ["#F59E0B", "#F97316"],
    icon: "trophy-outline",
    description: "Full-featured plan with featured listing, priority alerts, and deep customisation.",
    features: [
      { text: "Featured Profile (Top of Search)", included: true },
      { text: "3 Admission Forms (2 Customisable)", included: true },
      { text: "Priority Lead Alerts + Export", included: true },
      { text: "1 Physical QR + School Profile QR", included: true },
      { text: "High Customization (Custom Fields)", included: true },
      { text: "Class-wise Fee Structure", included: true },
      { text: "Job Posting / Teacher Hiring", included: true },
      { text: "Event Posting + Promotion Support", included: true },
      { text: "Priority Lead Alerts", included: true },
      { text: "Featured in Search Results", included: true },
    ],
  },
];

const ERP_MODULES = [
  { name: "Attendance Module", price: "₹2,999/year", desc: "Teacher, staff & student daily tracking", icon: "people-outline", color: "#2563EB" },
  { name: "Fee Management", price: "₹4,999/year", desc: "Wallet, auto-pay, salary & fee tracking", icon: "card-outline", color: "#7C3AED" },
  { name: "Homework & Notes", price: "₹4,999/year", desc: "Document sharing & parent communication", icon: "document-text-outline", color: "#10B981" },
  { name: "Notification Pack", price: "Free (In-App)", desc: "WhatsApp/SMS chargeable separately", icon: "notifications-outline", color: "#F59E0B" },
];

const ERP_PLANS = [
  { name: "Basic ERP", price: "₹11,999", desc: "With Basic plan (no ID Card / Report Card)", color: "#2563EB" },
  { name: "Elite ERP", price: "₹14,999", desc: "With Elite plan + ID Card generation", color: "#7C3AED" },
  { name: "Super ERP", price: "₹19,999", desc: "With Pro plan + ID Card + Report Card", color: "#F59E0B" },
];

export default function PlansScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selected, setSelected] = useState("elite");
  const [billingYearly, setBillingYearly] = useState(true);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleGetStarted = (planName: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      `Get ${planName} Plan`,
      "Our team will contact you within 24 hours to set up your school profile. Please have your school documents ready.",
      [{ text: "OK" }, { text: "Call Now", onPress: () => {} }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Plans & Pricing</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            List your school on MySchool
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad + 80 }]}>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: colors.accent }]}>
          <View style={[styles.heroBadge, { backgroundColor: colors.primary + "20" }]}>
            <Ionicons name="shield-checkmark-outline" size={14} color={colors.primary} />
            <Text style={[styles.heroBadgeText, { color: colors.primary }]}>Trusted by 500+ Schools</Text>
          </View>
          <Text style={[styles.heroTitle, { color: colors.foreground }]}>
            Grow Your School With{" "}
            <Text style={{ color: colors.primary }}>MySchool</Text>
          </Text>
          <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
            Get discovered by 12,000+ parents. Start with a free profile or go Pro for maximum visibility.
          </Text>

          {/* Billing toggle */}
          <View style={[styles.billingToggle, { backgroundColor: colors.muted }]}>
            <Pressable
              style={[styles.billingBtn, billingYearly && { backgroundColor: colors.background, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 }]}
              onPress={() => setBillingYearly(true)}
            >
              <Text style={[styles.billingBtnText, { color: billingYearly ? colors.foreground : colors.mutedForeground }]}>
                Yearly
              </Text>
              {billingYearly && (
                <View style={[styles.saveBadge, { backgroundColor: "#10B981" }]}>
                  <Text style={styles.saveBadgeText}>Save 20%</Text>
                </View>
              )}
            </Pressable>
            <Pressable
              style={[styles.billingBtn, !billingYearly && { backgroundColor: colors.background, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 }]}
              onPress={() => setBillingYearly(false)}
            >
              <Text style={[styles.billingBtnText, { color: !billingYearly ? colors.foreground : colors.mutedForeground }]}>Monthly</Text>
            </Pressable>
          </View>
        </View>

        {/* Plan cards */}
        <View style={styles.plans}>
          {PLANS.map((plan) => {
            const isSelected = selected === plan.id;
            return (
              <Pressable
                key={plan.id}
                style={[
                  styles.planCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: isSelected ? plan.color : colors.border,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelected(plan.id);
                }}
              >
                {plan.badge && (
                  <View style={[styles.planBadge, { backgroundColor: plan.color }]}>
                    <Text style={styles.planBadgeText}>{plan.badge}</Text>
                  </View>
                )}
                {isSelected && (
                  <View style={[styles.selectedTick, { backgroundColor: plan.color }]}>
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  </View>
                )}

                {/* Plan header */}
                <View style={styles.planHeader}>
                  <View style={[styles.planIconWrap, { backgroundColor: plan.color + "18" }]}>
                    <Ionicons name={plan.icon as any} size={22} color={plan.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.planName, { color: colors.foreground }]}>{plan.name}</Text>
                    <View style={styles.planPriceRow}>
                      <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
                      <Text style={[styles.planPeriod, { color: colors.mutedForeground }]}>{plan.period}</Text>
                    </View>
                  </View>
                </View>

                <Text style={[styles.planDesc, { color: colors.mutedForeground }]}>{plan.description}</Text>

                {/* Features */}
                <View style={styles.features}>
                  {plan.features.map((f) => (
                    <View key={f.text} style={styles.featureRow}>
                      <Ionicons
                        name={f.included ? "checkmark-circle" : "close-circle-outline"}
                        size={16}
                        color={f.included ? "#10B981" : colors.border}
                      />
                      <Text style={[styles.featureText, { color: f.included ? colors.foreground : colors.mutedForeground, textDecorationLine: f.included ? "none" : "line-through" as any }]}>
                        {f.text}
                      </Text>
                    </View>
                  ))}
                </View>

                <Pressable
                  style={[styles.getStartedBtn, { backgroundColor: plan.color }]}
                  onPress={() => handleGetStarted(plan.name)}
                >
                  <Text style={styles.getStartedText}>Get {plan.name}</Text>
                  <Ionicons name="arrow-forward" size={15} color="#fff" />
                </Pressable>
              </Pressable>
            );
          })}
        </View>

        {/* ERP Add-ons */}
        <View style={[styles.erpSection, { borderTopColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>ERP Add-ons</Text>
            <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
              Manage your school digitally with our ERP modules
            </Text>
          </View>

          <View style={styles.erpModules}>
            {ERP_MODULES.map((mod) => (
              <View key={mod.name} style={[styles.erpModule, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.erpIcon, { backgroundColor: mod.color + "18" }]}>
                  <Ionicons name={mod.icon as any} size={20} color={mod.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.erpName, { color: colors.foreground }]}>{mod.name}</Text>
                  <Text style={[styles.erpDesc, { color: colors.mutedForeground }]}>{mod.desc}</Text>
                </View>
                <Text style={[styles.erpPrice, { color: mod.color }]}>{mod.price}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.erpPlansRow, { gap: 10 }]}>
            {ERP_PLANS.map((ep) => (
              <View key={ep.name} style={[styles.erpPlanCard, { backgroundColor: ep.color + "10", borderColor: ep.color + "30" }]}>
                <Text style={[styles.erpPlanName, { color: ep.color }]}>{ep.name}</Text>
                <Text style={[styles.erpPlanPrice, { color: colors.foreground }]}>{ep.price}</Text>
                <Text style={[styles.erpPlanDesc, { color: colors.mutedForeground }]}>{ep.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA */}
        <View style={[styles.cta, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
          <Ionicons name="call-outline" size={28} color={colors.primary} />
          <Text style={[styles.ctaTitle, { color: colors.foreground }]}>Need help choosing a plan?</Text>
          <Text style={[styles.ctaSub, { color: colors.mutedForeground }]}>
            Talk to our school partnerships team — we'll help you find the right fit for your school's size and goals.
          </Text>
          <Pressable
            style={[styles.ctaBtn, { backgroundColor: colors.primary }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Alert.alert("Contact Us", "Call us at +91 98765 43210 or email schools@myschool.in");
            }}
          >
            <Ionicons name="call" size={16} color="#fff" />
            <Text style={styles.ctaBtnText}>Talk to Us</Text>
          </Pressable>
        </View>
      </ScrollView>
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

  scrollContent: { gap: 0 },

  hero: {
    padding: 20,
    gap: 12,
    margin: 20,
    borderRadius: 20,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  heroBadgeText: { fontSize: 12, fontWeight: "700" as const },
  heroTitle: { fontSize: 26, fontWeight: "800" as const, letterSpacing: -0.6, lineHeight: 32 },
  heroSub: { fontSize: 14, lineHeight: 21 },
  billingToggle: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  billingBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 10,
  },
  billingBtnText: { fontSize: 13, fontWeight: "700" as const },
  saveBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  saveBadgeText: { color: "#fff", fontSize: 10, fontWeight: "700" as const },

  plans: { paddingHorizontal: 20, gap: 16, paddingBottom: 8 },
  planCard: {
    borderRadius: 20,
    padding: 18,
    position: "relative",
    overflow: "hidden",
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  planBadge: {
    position: "absolute",
    top: 0,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  planBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" as const },
  selectedTick: {
    position: "absolute",
    top: 14,
    left: 14,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  planHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 4 },
  planIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  planName: { fontSize: 20, fontWeight: "800" as const },
  planPriceRow: { flexDirection: "row", alignItems: "baseline", gap: 2, marginTop: 2 },
  planPrice: { fontSize: 26, fontWeight: "800" as const, letterSpacing: -0.5 },
  planPeriod: { fontSize: 13 },
  planDesc: { fontSize: 13, lineHeight: 19 },
  features: { gap: 8 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  featureText: { fontSize: 13, flex: 1 },
  getStartedBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 2,
  },
  getStartedText: { color: "#fff", fontSize: 15, fontWeight: "700" as const },

  erpSection: { paddingHorizontal: 20, paddingTop: 24, borderTopWidth: 1, marginTop: 8, gap: 16 },
  sectionHeader: { gap: 4 },
  sectionTitle: { fontSize: 22, fontWeight: "800" as const, letterSpacing: -0.5 },
  sectionSub: { fontSize: 13, lineHeight: 20 },
  erpModules: { gap: 10 },
  erpModule: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  erpIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  erpName: { fontSize: 14, fontWeight: "700" as const },
  erpDesc: { fontSize: 12, marginTop: 1 },
  erpPrice: { fontSize: 13, fontWeight: "700" as const, flexShrink: 0 },
  erpPlansRow: { flexDirection: "row", flexWrap: "wrap" },
  erpPlanCard: {
    flex: 1,
    minWidth: "30%",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  erpPlanName: { fontSize: 12, fontWeight: "700" as const },
  erpPlanPrice: { fontSize: 18, fontWeight: "800" as const, letterSpacing: -0.5 },
  erpPlanDesc: { fontSize: 10, lineHeight: 14 },

  cta: {
    margin: 20,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 10,
    alignItems: "center",
  },
  ctaTitle: { fontSize: 18, fontWeight: "800" as const, textAlign: "center" },
  ctaSub: { fontSize: 13, textAlign: "center", lineHeight: 20 },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 4,
  },
  ctaBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" as const },
});
