import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function JobCard({ job, onPress }) {
    return (
        <Pressable style={styles.card} onPress={onPress}>
            <Text style={styles.title}>{job.title}</Text>
            <Text style={styles.category}>{job.category}</Text>
            <Text style={styles.budget}>Ksh {job.budget}</Text>
            <Text style={styles.location}>{job.location}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1a2332',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2a3d54',
    },
    title: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 8 },
    category: { fontSize: 12, color: '#185FA5', marginBottom: 4 },
    budget: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 4 },
    location: { fontSize: 12, color: '#999' },
});