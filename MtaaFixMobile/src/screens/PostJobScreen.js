import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    Modal,
    SafeAreaView,
} from 'react-native';
import apiClient from '../api/client';

const CATEGORIES = [
    { label: 'Plumbing', value: 'plumbing' },
    { label: 'Electrical', value: 'electrical' },
    { label: 'Moving', value: 'moving' },
    { label: 'Cleaning', value: 'cleaning' },
    { label: 'Fumigation', value: 'fumigation' },
    { label: 'Installation', value: 'installation' },
    { label: 'Capentry', value: 'capentry' },
    { label: 'Delivery', value: 'delivery' },
    { label: 'Other', value: 'other' },
];

export default function PostJobScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('plumbing');
    const [location, setLocation] = useState('');
    const [budget, setBudget] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    const onPostJob = async () => {
        // Validation
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a job title');
            return;
        }
        if (!description.trim()) {
            Alert.alert('Error', 'Please enter a job description');
            return;
        }
        if (!location.trim()) {
            Alert.alert('Error', 'Please enter a location');
            return;
        }
        if (!budget.trim()) {
            Alert.alert('Error', 'Please enter a budget');
            return;
        }

        setLoading(true);
        try {
            const response = await apiClient.post('/api/jobs/', {
                title: title.trim(),
                description: description.trim(),
                category,
                location: location.trim(),
                budget: parseFloat(budget),
            });

            Alert.alert('Success', 'Job posted successfully!');
            
            // Reset form
            setTitle('');
            setDescription('');
            setCategory('plumbing');
            setLocation('');
            setBudget('');

            // Navigate to MyJobs
            navigation.navigate('MyJobs');
        } catch (error) {
            const message = error.response?.data 
                ? JSON.stringify(error.response.data) 
                : error.message;
            Alert.alert('Error', `Failed to post job: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    const selectedCategoryLabel = CATEGORIES.find(c => c.value === category)?.label || 'Select Category';

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Post a New Job</Text>
                <Text style={styles.subtitle}>Tell workers what you need</Text>

                {/* Job Title */}
                <View style={styles.section}>
                    <Text style={styles.label}>Job Title *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Fix leaky kitchen sink"
                        placeholderTextColor="#666"
                        value={title}
                        onChangeText={setTitle}
                        editable={!loading}
                    />
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.label}>Description *</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Describe the job in detail..."
                        placeholderTextColor="#666"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        editable={!loading}
                    />
                </View>

                {/* Category Dropdown */}
                <View style={styles.section}>
                    <Text style={styles.label}>Category *</Text>
                    <Pressable
                        style={styles.dropdown}
                        onPress={() => setShowCategoryModal(true)}
                        disabled={loading}
                    >
                        <Text style={styles.dropdownText}>{selectedCategoryLabel}</Text>
                        <Text style={styles.dropdownArrow}>▼</Text>
                    </Pressable>
                </View>

                {/* Category Modal */}
                <Modal
                    visible={showCategoryModal}
                    transparent
                    animationType="slide"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Category</Text>
                                <Pressable onPress={() => setShowCategoryModal(false)}>
                                    <Text style={styles.modalClose}>✕</Text>
                                </Pressable>
                            </View>

                            {CATEGORIES.map((cat) => (
                                <Pressable
                                    key={cat.value}
                                    style={[
                                        styles.categoryOption,
                                        category === cat.value && styles.categoryOptionSelected,
                                    ]}
                                    onPress={() => {
                                        setCategory(cat.value);
                                        setShowCategoryModal(false);
                                    }}
                                >
                                    <Text style={styles.categoryOptionText}>{cat.label}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </Modal>

                {/* Location */}
                <View style={styles.section}>
                    <Text style={styles.label}>Location *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Downtown, Nairobi"
                        placeholderTextColor="#666"
                        value={location}
                        onChangeText={setLocation}
                        editable={!loading}
                    />
                </View>

                {/* Budget */}
                <View style={styles.section}>
                    <Text style={styles.label}>Budget (KES) *</Text>
                    <View style={styles.inputWithPrefix}>
                        <Text style={styles.currencyPrefix}>Ksh</Text>
                        <TextInput
                            style={styles.inputWithPrefixField}
                            placeholder="e.g., 5000"
                            placeholderTextColor="#666"
                            value={budget}
                            onChangeText={setBudget}
                            keyboardType="decimal-pad"
                            editable={!loading}
                        />
                    </View>
                </View>

                {/* Post Button */}
                <Pressable
                    style={[styles.postButton, loading && styles.postButtonDisabled]}
                    onPress={onPostJob}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.postButtonText}>Post Job</Text>
                    )}
                </Pressable>

                {/* Cancel Button */}
                <Pressable
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}
                    disabled={loading}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#08111f',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#999',
        marginBottom: 24,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1a2332',
        borderWidth: 1,
        borderColor: '#2a3d54',
        borderRadius: 8,
        padding: 12,
        color: '#fff',
        fontSize: 14,
    },
    textArea: {
        textAlignVertical: 'top',
        minHeight: 100,
    },
    dropdown: {
        backgroundColor: '#1a2332',
        borderWidth: 1,
        borderColor: '#2a3d54',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        color: '#fff',
        fontSize: 14,
    },
    dropdownArrow: {
        color: '#999',
        fontSize: 10,
    },
    inputWithPrefix: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a2332',
        borderWidth: 1,
        borderColor: '#2a3d54',
        borderRadius: 8,
        paddingLeft: 12,
    },
    currencyPrefix: {
        color: '#999',
        fontSize: 14,
        marginRight: 8,
    },
    inputWithPrefixField: {
        flex: 1,
        padding: 12,
        color: '#fff',
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#08111f',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2a3d54',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    modalClose: {
        fontSize: 24,
        color: '#999',
    },
    categoryOption: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1a2332',
    },
    categoryOptionSelected: {
        backgroundColor: '#185FA5',
    },
    categoryOptionText: {
        fontSize: 14,
        color: '#fff',
    },
    postButton: {
        backgroundColor: '#185FA5',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 12,
    },
    postButtonDisabled: {
        opacity: 0.6,
    },
    postButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: '#2a3d54',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 24,
    },
    cancelButtonText: {
        color: '#999',
        fontSize: 16,
        fontWeight: '600',
    },
});