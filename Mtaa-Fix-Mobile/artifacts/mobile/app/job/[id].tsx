import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, ActivityIndicator, Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/src/context/AuthContext';
import { useJob } from '@/src/services/jobService';
import { useCreateBid, useMyBids } from '@/src/services/bidService';
import * as Haptics from 'expo-haptics';

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { data: job, isLoading } = useJob(id ?? '');
  const { data: applications } = useMyBids();
  const createBid = useCreateBid();

  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applying, setApplying] = useState(false);

  const isWorker = user?.role === 'worker';
  const myApplication = isWorker ? applications?.find((application) => application.job?.id === id) : undefined;
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const handleApply = async () => {
    if (!message.trim()) {
      Alert.alert('Message required', 'Tell the client why you are the right fit.');
      return;
    }
    const trimmedAmount = amount.trim();
    if (!trimmedAmount || isNaN(Number(trimmedAmount)) || Number(trimmedAmount) <= 0) {
      Alert.alert('Offer amount required', 'Enter how much you would charge for this job.');
      return;
    }
    setApplying(true);
    try {
      await createBid.mutateAsync({ job_id: id ?? '', amount: trimmedAmount, message: message.trim() });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowApplyForm(false);
      setMessage('');
      setAmount('');
      Alert.alert('Offer sent!', 'Client received offer');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        'Could not send offer. You may have already made one.';
      Alert.alert('Error', msg);
    } finally {
      setApplying(false);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Job Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.foreground} style={{ marginTop: 60 }} />
      ) : job ? (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <Text style={[styles.title, { color: colors.foreground }]}>{job.title}</Text>

          {/* Meta chips */}
          <View style={styles.metaRow}>
            <View style={[styles.chip, { backgroundColor: colors.card }]}>
              <Ionicons name="location-outline" size={13} color={colors.mutedForeground} />
              <Text style={[styles.chipText, { color: colors.mutedForeground }]}>{job.location}</Text>
            </View>
            <View style={[styles.chip, { backgroundColor: colors.card }]}>
              <Ionicons name="pricetag-outline" size={13} color={colors.mutedForeground} />
              <Text style={[styles.chipText, { color: colors.mutedForeground }]}>{job.category}</Text>
            </View>
          </View>

          {/* Budget */}
          <View style={[styles.budgetCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.budgetLabel, { color: colors.mutedForeground }]}>Budget</Text>
            <Text style={[styles.budget, { color: colors.primary }]}>
              Ksh {job.budget ? Number(job.budget).toLocaleString() : '—'}
            </Text>
          </View>

          {/* Description */}
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Description</Text>
          <Text style={[styles.desc, { color: colors.mutedForeground }]}>{job.description}</Text>

          {/* Offers entry point — client, own job only */}
          {user?.role === 'client' && job.client?.id === user?.id && (
            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: colors.primary, marginBottom: 24 }]}
              onPress={() => router.push(`/job-offers/${job.id}`)}
              activeOpacity={0.85}
            >
              <Text style={[styles.applyBtnText, { color: colors.primaryForeground }]}>
                {job.status === 'open'
                  ? `View Offers${job.applications_count ? ` (${job.applications_count})` : ''}`
                  : 'View Offer Details'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Apply section — workers only, open jobs only */}
          {isWorker && (
            <View style={styles.applySection}>
              {myApplication ? (
                <View style={[styles.appliedNotice, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  {myApplication.status === 'accepted' ? (
                    <>
                      <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                      <Text style={[styles.appliedText, { color: colors.foreground }]}>Offer accepted</Text>
                      <Text style={[styles.appliedSubtext, { color: colors.mutedForeground }]}>
                        You got this job — Ksh {Number(myApplication.amount).toLocaleString()}.
                      </Text>
                    </>
                  ) : myApplication.status === 'rejected' ? (
                    <>
                      <Ionicons name="close-circle-outline" size={18} color={colors.mutedForeground} />
                      <Text style={[styles.appliedText, { color: colors.foreground }]}>Not selected</Text>
                      <Text style={[styles.appliedSubtext, { color: colors.mutedForeground }]}>
                        The client went with another worker for this one.
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="time-outline" size={18} color={colors.primary} />
                      <Text style={[styles.appliedText, { color: colors.foreground }]}>Offer sent</Text>
                      <Text style={[styles.appliedSubtext, { color: colors.mutedForeground }]}>
                        Your offer of Ksh {Number(myApplication.amount).toLocaleString()} is waiting on the client.
                      </Text>
                    </>
                  )}
                </View>
              ) : job.status !== 'open' ? (
                <View style={[styles.appliedNotice, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Ionicons name="lock-closed-outline" size={18} color={colors.mutedForeground} />
                  <Text style={[styles.appliedText, { color: colors.foreground }]}>No longer available</Text>
                  <Text style={[styles.appliedSubtext, { color: colors.mutedForeground }]}>
                    {job.status === 'cancelled'
                      ? 'This request was cancelled by the client.'
                      : 'This job has already been assigned to another worker.'}
                  </Text>
                </View>
              ) : showApplyForm ? (
                <View style={styles.applyForm}>
                  <TextInput
                    style={[
                      styles.textarea,
                      { backgroundColor: colors.card, color: colors.foreground, borderColor: colors.border, minHeight: 48 },
                    ]}
                    placeholder="Your offer (KSh)"
                    placeholderTextColor={colors.mutedForeground}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[
                      styles.textarea,
                      { backgroundColor: colors.card, color: colors.foreground, borderColor: colors.border },
                    ]}
                    placeholder="Why are you the right fit for this job?"
                    placeholderTextColor={colors.mutedForeground}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                  <View style={styles.applyBtns}>
                    <TouchableOpacity
                      style={[styles.cancelBtn, { borderColor: colors.border }]}
                      onPress={() => setShowApplyForm(false)}
                    >
                      <Text style={{ color: colors.foreground, fontWeight: '600', fontSize: 15 }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.submitBtn, { backgroundColor: colors.primary }, applying && { opacity: 0.6 }]}
                      onPress={handleApply}
                      disabled={applying}
                    >
                      {applying
                        ? <ActivityIndicator color={colors.primaryForeground} size="small" />
                        : <Text style={{ color: colors.primaryForeground, fontWeight: '700', fontSize: 15 }}>Submit</Text>
                      }
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.applyBtn, { backgroundColor: colors.primary }]}
                  onPress={() => setShowApplyForm(true)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.applyBtnText, { color: colors.primaryForeground }]}>
                    Make an offer
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={40} color={colors.mutedForeground} />
          <Text style={{ color: colors.mutedForeground, fontSize: 15, marginTop: 10 }}>
            Job not found
          </Text>
        </View>
      )}
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
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  content: { paddingHorizontal: 20, paddingBottom: 80, gap: 18 },
  title: { fontSize: 26, fontWeight: '700', lineHeight: 34, letterSpacing: -0.5 },
  metaRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  chipText: { fontSize: 13 },
  budgetCard: { borderRadius: 14, padding: 18, gap: 6 },
  budgetLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  budget: { fontSize: 32, fontWeight: '700', letterSpacing: -1 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  desc: { fontSize: 15, lineHeight: 24 },
  applySection: { marginTop: 8 },
  applyBtn: { borderRadius: 14, paddingVertical: 17, alignItems: 'center' },
  applyBtnText: { fontSize: 16, fontWeight: '700' },
  appliedNotice: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 6,
    alignItems: 'center',
  },
  appliedText: { fontSize: 16, fontWeight: '700' },
  appliedSubtext: { fontSize: 13, textAlign: 'center' },
  applyForm: { gap: 12 },
  textarea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 110,
  },
  applyBtns: { flexDirection: 'row', gap: 10 },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
