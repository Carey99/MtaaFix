import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useCreateJob } from '@/src/services/jobService';
import type { JobCategory } from '@/src/types';
import * as Haptics from 'expo-haptics';

const CATEGORIES: JobCategory[] = [
  'plumbing', 'electrical', 'moving', 'cleaning',
  'fumigation', 'installation', 'carpentry', 'delivery', 'other',
];

export default function PostJobScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const createJob = useCreateJob();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<JobCategory | ''>('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const handlePost = async () => {
    if (!title.trim() || !description.trim() || !category || !location.trim() || !budget) {
      Alert.alert('Incomplete form', 'Fill in all fields and select a category.');
      return;
    }
    if (isNaN(Number(budget)) || Number(budget) <= 0) {
      Alert.alert('Invalid budget', 'Enter a positive number for the budget.');
      return;
    }
    try {
      await createJob.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        category,
        location: location.trim(),
        budget: budget.trim(), // API expects a decimal string e.g. "2000"
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Job posted!', 'Workers will start applying soon.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        'Failed to post job. Please try again.';
      Alert.alert('Error', msg);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Post a Job</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormInput label="Job Title" value={title} onChangeText={setTitle} placeholder="e.g. Fix leaking pipe" colors={colors} />
        <FormInput label="Location" value={location} onChangeText={setLocation} placeholder="e.g. Westlands, Nairobi" colors={colors} />
        <FormInput
          label="Budget (Ksh)"
          value={budget}
          onChangeText={setBudget}
          placeholder="e.g. 2500"
          keyboardType="numeric"
          colors={colors}
        />

        {/* Category picker */}
        <View>
          <Text style={[styles.label, { color: colors.foreground }]}>Category</Text>
          <View style={styles.chips}>
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[styles.chip, { backgroundColor: isSelected ? colors.primary : colors.card }]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.chipText, { color: isSelected ? colors.primaryForeground : colors.mutedForeground }]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Description */}
        <View>
          <Text style={[styles.label, { color: colors.foreground }]}>Description</Text>
          <TextInput
            style={[
              styles.textarea,
              { backgroundColor: colors.card, color: colors.foreground, borderColor: colors.border },
            ]}
            placeholder="Describe what needs to be done, any requirements, timing..."
            placeholderTextColor={colors.mutedForeground}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.postBtn, { backgroundColor: colors.primary }, createJob.isPending && { opacity: 0.6 }]}
          onPress={handlePost}
          disabled={createJob.isPending}
          activeOpacity={0.85}
        >
          {createJob.isPending
            ? <ActivityIndicator color={colors.primaryForeground} />
            : <Text style={[styles.postBtnText, { color: colors.primaryForeground }]}>Post Job</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad';
  colors: ReturnType<typeof import('@/hooks/useColors').useColors>;
}

function FormInput({ label, value, onChangeText, placeholder, keyboardType = 'default', colors }: FormInputProps) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.foreground, borderColor: colors.border }]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  form: { paddingHorizontal: 20, paddingBottom: 60, gap: 18 },
  inputWrapper: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  chipText: { fontSize: 13, fontWeight: '500', textTransform: 'capitalize' },
  textarea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    minHeight: 120,
    marginTop: 8,
  },
  postBtn: {
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 4,
  },
  postBtnText: { fontSize: 16, fontWeight: '700' },
});
