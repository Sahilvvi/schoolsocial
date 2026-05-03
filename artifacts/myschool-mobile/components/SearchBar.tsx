import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

interface Props {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  filterIcon?: boolean;
  onFilterPress?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
  onFocus,
  filterIcon,
  onFilterPress,
}: Props) {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
      <TextInput
        style={[styles.input, { color: colors.foreground }]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
        </Pressable>
      )}
      {filterIcon && (
        <Pressable
          onPress={onFilterPress}
          style={[styles.filterBtn, { backgroundColor: colors.accent }]}
          hitSlop={4}
        >
          <Ionicons name="options-outline" size={16} color={colors.primary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  filterBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
