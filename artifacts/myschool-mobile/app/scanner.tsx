import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
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

const RECENT_SCANS = [
  { id: "s1", name: "Delhi Public School", code: "DPS-LONI-2026-ADM", type: "Admission Form", time: "Today, 10:23 AM", color: "#2563EB" },
  { id: "s2", name: "Ryan International", code: "RYAN-2026-REG", type: "School Profile", time: "Yesterday, 3:45 PM", color: "#7C3AED" },
  { id: "s3", name: "Bright Future Tuition", code: "BFT-BATCH-CBSE6", type: "Batch Registration", time: "Apr 30, 2:10 PM", color: "#10B981" },
];

const SAMPLE_CODES = [
  { name: "Delhi Public School — Admission", code: "DPS-LONI-2026-ADM", color: "#2563EB" },
  { name: "Ryan International — Profile", code: "RYAN-2026-REG", color: "#7C3AED" },
  { name: "Science Exhibition Event", code: "EVT-SCIEX-2026", color: "#F59E0B" },
];

export default function ScannerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [tab, setTab] = useState<"scan" | "manual" | "history">("scan");
  const [manualCode, setManualCode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  // Animated scan line
  const scanAnim = useRef(new Animated.Value(0)).current;
  const scanLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (tab === "scan") {
      startScanAnim();
    } else {
      stopScanAnim();
    }
    return () => stopScanAnim();
  }, [tab]);

  const startScanAnim = () => {
    scanAnim.setValue(0);
    scanLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    scanLoop.current.start();
  };

  const stopScanAnim = () => {
    if (scanLoop.current) {
      scanLoop.current.stop();
    }
  };

  const scanLineY = scanAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 220] });

  const handleSimulateScan = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const sample = SAMPLE_CODES[Math.floor(Math.random() * SAMPLE_CODES.length)];
    setScannedCode(sample.code);
    setScanning(false);
  };

  const handleManualSubmit = () => {
    if (!manualCode.trim()) {
      Alert.alert("Enter a Code", "Please type or paste a QR code before submitting.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setScannedCode(manualCode.trim().toUpperCase());
    setTab("scan");
    setManualCode("");
  };

  const handleResult = (code: string) => {
    if (code.startsWith("DPS") || code.startsWith("RYAN") || code.includes("SCHOOL")) {
      Alert.alert(
        "School QR Detected",
        `Code: ${code}\n\nWould you like to view this school's admission form?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open School", onPress: () => router.push("/school/dps-loni" as any) },
        ]
      );
    } else if (code.includes("EVT")) {
      Alert.alert(
        "Event QR Detected",
        `Code: ${code}\n\nEvent registration link found. Open it?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Event", onPress: () => router.push("/(tabs)/events" as any) },
        ]
      );
    } else if (code.includes("BATCH") || code.includes("BFT")) {
      Alert.alert(
        "Tuition Batch QR",
        `Code: ${code}\n\nBatch registration QR detected. Enrol now?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Tuitions", onPress: () => router.push("/tuitions" as any) },
        ]
      );
    } else {
      Alert.alert("QR Code Scanned", `Code: ${code}`, [{ text: "OK" }]);
    }
    setScannedCode(null);
  };

  useEffect(() => {
    if (scannedCode) {
      handleResult(scannedCode);
    }
  }, [scannedCode]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>QR Scanner</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>Scan school, admission & event QRs</Text>
        </View>
        <View style={[styles.headerBadge, { backgroundColor: "#10B98115" }]}>
          <Ionicons name="wifi-outline" size={14} color="#10B981" />
          <Text style={[styles.headerBadgeText, { color: "#10B981" }]}>Ready</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { backgroundColor: colors.muted, borderBottomColor: colors.border }]}>
        {(["scan", "manual", "history"] as const).map((t) => (
          <Pressable
            key={t}
            style={[styles.tab, tab === t && { backgroundColor: colors.background, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 }]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setTab(t); }}
          >
            <Ionicons
              name={t === "scan" ? "scan-outline" : t === "manual" ? "keypad-outline" : "time-outline"}
              size={14}
              color={tab === t ? colors.primary : colors.mutedForeground}
            />
            <Text style={[styles.tabText, { color: tab === t ? colors.primary : colors.mutedForeground }]}>
              {t === "scan" ? "Camera" : t === "manual" ? "Manual" : "History"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 80 }]}>
        {tab === "scan" && (
          <View style={styles.scanTab}>
            {/* Camera viewport */}
            <View style={[styles.viewfinder, { borderColor: colors.border }]}>
              {/* Corner markers */}
              {["tl", "tr", "bl", "br"].map((corner) => (
                <View key={corner} style={[styles.corner, styles[corner as "tl" | "tr" | "bl" | "br"], { borderColor: colors.primary }]} />
              ))}

              {/* Dark overlay with QR icon */}
              <View style={styles.viewfinderOverlay}>
                <View style={[styles.viewfinderTarget, { borderColor: colors.primary + "40" }]}>
                  <Ionicons name="qr-code-outline" size={64} color={colors.primary + "50"} />
                </View>
              </View>

              {/* Animated scan line */}
              <Animated.View
                style={[styles.scanLine, { backgroundColor: colors.primary, transform: [{ translateY: scanLineY }] }]}
              />
            </View>

            <Text style={[styles.scanHint, { color: colors.mutedForeground }]}>
              Position the QR code inside the frame. The scanner will detect it automatically.
            </Text>

            {/* Simulate scan (since no camera access in this environment) */}
            <Pressable
              style={[styles.simulateBtn, { backgroundColor: colors.primary }]}
              onPress={handleSimulateScan}
            >
              <Ionicons name="scan" size={18} color="#fff" />
              <Text style={styles.simulateBtnText}>Tap to Scan</Text>
            </Pressable>

            {/* What can you scan */}
            <View style={[styles.typesCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.typesTitle, { color: colors.foreground }]}>What you can scan</Text>
              {[
                { icon: "school-outline", label: "School Profile QR", color: "#2563EB", desc: "View school details & apply" },
                { icon: "document-text-outline", label: "Admission Form QR", color: "#7C3AED", desc: "Fill and submit admission form" },
                { icon: "calendar-outline", label: "Event QR", color: "#F59E0B", desc: "Register for school events" },
                { icon: "book-outline", label: "Tuition Batch QR", color: "#10B981", desc: "Enrol in coaching batches" },
              ].map((t) => (
                <View key={t.label} style={styles.typeRow}>
                  <View style={[styles.typeIcon, { backgroundColor: t.color + "14" }]}>
                    <Ionicons name={t.icon as any} size={16} color={t.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.typeLabel, { color: colors.foreground }]}>{t.label}</Text>
                    <Text style={[styles.typeDesc, { color: colors.mutedForeground }]}>{t.desc}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={14} color={colors.border} />
                </View>
              ))}
            </View>
          </View>
        )}

        {tab === "manual" && (
          <View style={styles.manualTab}>
            <View style={[styles.manualCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.manualIcon, { backgroundColor: colors.primary + "14" }]}>
                <Ionicons name="keypad-outline" size={28} color={colors.primary} />
              </View>
              <Text style={[styles.manualTitle, { color: colors.foreground }]}>Enter QR Code Manually</Text>
              <Text style={[styles.manualSub, { color: colors.mutedForeground }]}>
                If you have received a code via SMS, WhatsApp, or email, enter it below.
              </Text>

              <TextInput
                value={manualCode}
                onChangeText={(v) => setManualCode(v.toUpperCase())}
                placeholder="e.g. DPS-LONI-2026-ADM"
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="characters"
                style={[styles.manualInput, { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border }]}
              />

              <Pressable
                style={[styles.manualSubmitBtn, { backgroundColor: colors.primary, opacity: manualCode.length > 3 ? 1 : 0.5 }]}
                onPress={handleManualSubmit}
              >
                <Ionicons name="search-outline" size={16} color="#fff" />
                <Text style={styles.manualSubmitText}>Look Up Code</Text>
              </Pressable>
            </View>

            {/* Sample codes */}
            <Text style={[styles.sampleTitle, { color: colors.mutedForeground }]}>TRY A SAMPLE CODE</Text>
            {SAMPLE_CODES.map((s) => (
              <Pressable
                key={s.code}
                style={[styles.sampleRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setManualCode(s.code); }}
              >
                <View style={[styles.sampleDot, { backgroundColor: s.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sampleName, { color: colors.foreground }]}>{s.name}</Text>
                  <Text style={[styles.sampleCode, { color: colors.mutedForeground }]}>{s.code}</Text>
                </View>
                <Ionicons name="arrow-up-outline" size={14} color={colors.mutedForeground} />
              </Pressable>
            ))}
          </View>
        )}

        {tab === "history" && (
          <View style={styles.historyTab}>
            <View style={[styles.historyHeader, { backgroundColor: colors.muted }]}>
              <Ionicons name="time-outline" size={16} color={colors.mutedForeground} />
              <Text style={[styles.historyHeaderText, { color: colors.mutedForeground }]}>
                {RECENT_SCANS.length} recent scans
              </Text>
              <Pressable style={styles.clearBtn} onPress={() => Alert.alert("Clear History", "Remove all scan history?", [{ text: "Cancel" }, { text: "Clear", style: "destructive" }])}>
                <Text style={[styles.clearBtnText, { color: "#EF4444" }]}>Clear all</Text>
              </Pressable>
            </View>

            {RECENT_SCANS.map((scan) => (
              <Pressable
                key={scan.id}
                style={[styles.historyCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setScannedCode(scan.code);
                }}
              >
                <View style={[styles.historyIcon, { backgroundColor: scan.color + "14" }]}>
                  <Ionicons name="qr-code-outline" size={20} color={scan.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.historyName, { color: colors.foreground }]}>{scan.name}</Text>
                  <Text style={[styles.historyCode, { color: scan.color }]}>{scan.code}</Text>
                  <Text style={[styles.historyTime, { color: colors.mutedForeground }]}>{scan.type} · {scan.time}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.border} />
              </Pressable>
            ))}

            <View style={[styles.historyTip, { backgroundColor: colors.accent, borderColor: colors.border }]}>
              <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
              <Text style={[styles.historyTipText, { color: colors.mutedForeground }]}>
                Tap any recent scan to open it again. History is stored on this device.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

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
  headerBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  headerBadgeText: { fontSize: 12, fontWeight: "700" as const },

  tabs: { flexDirection: "row", margin: 16, borderRadius: 14, padding: 4 },
  tab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, paddingVertical: 8, borderRadius: 10 },
  tabText: { fontSize: 13, fontWeight: "700" as const },

  scroll: { paddingHorizontal: 20 },

  scanTab: { alignItems: "center" as const, gap: 16, paddingTop: 8 },
  viewfinder: {
    width: 260,
    height: 260,
    borderRadius: 20,
    borderWidth: 2,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#1a1a2e",
  },
  corner: { position: "absolute", width: 24, height: 24, borderWidth: 3 },
  tl: { top: -1, left: -1, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 8 },
  tr: { top: -1, right: -1, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 8 },
  bl: { bottom: -1, left: -1, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 8 },
  br: { bottom: -1, right: -1, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 8 },
  viewfinderOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  viewfinderTarget: {
    width: 160,
    height: 160,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  scanLine: {
    position: "absolute",
    left: 16,
    right: 16,
    height: 2,
    borderRadius: 1,
    opacity: 0.8,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  scanHint: { fontSize: 13, textAlign: "center" as const, lineHeight: 19, paddingHorizontal: 20 },
  simulateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
  },
  simulateBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" as const },
  typesCard: { width: "100%", borderRadius: 16, borderWidth: 1, padding: 16, gap: 14 },
  typesTitle: { fontSize: 14, fontWeight: "800" as const, marginBottom: 2 },
  typeRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  typeIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  typeLabel: { fontSize: 13, fontWeight: "700" as const },
  typeDesc: { fontSize: 11, marginTop: 1 },

  manualTab: { gap: 14, paddingTop: 8 },
  manualCard: { borderRadius: 20, borderWidth: 1, padding: 20, alignItems: "center" as const, gap: 12 },
  manualIcon: { width: 60, height: 60, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  manualTitle: { fontSize: 18, fontWeight: "800" as const },
  manualSub: { fontSize: 13, textAlign: "center" as const, lineHeight: 19 },
  manualInput: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: "700" as const,
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  manualSubmitBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: 14,
  },
  manualSubmitText: { color: "#fff", fontSize: 15, fontWeight: "700" as const },
  sampleTitle: { fontSize: 11, fontWeight: "700" as const, letterSpacing: 1, marginTop: 4 },
  sampleRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  sampleDot: { width: 10, height: 10, borderRadius: 5 },
  sampleName: { fontSize: 13, fontWeight: "700" as const },
  sampleCode: { fontSize: 11, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", marginTop: 2 },

  historyTab: { gap: 10, paddingTop: 8 },
  historyHeader: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 12 },
  historyHeaderText: { flex: 1, fontSize: 13 },
  clearBtn: { paddingHorizontal: 8 },
  clearBtnText: { fontSize: 13, fontWeight: "600" as const },
  historyCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  historyIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  historyName: { fontSize: 14, fontWeight: "700" as const },
  historyCode: { fontSize: 11, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", marginTop: 2, fontWeight: "600" as const },
  historyTime: { fontSize: 11, marginTop: 2 },
  historyTip: { flexDirection: "row", gap: 10, padding: 14, borderRadius: 14, borderWidth: 1, alignItems: "flex-start" as const },
  historyTipText: { flex: 1, fontSize: 13, lineHeight: 19 },
});
