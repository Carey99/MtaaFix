import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, Pressable } from 'react-native';
import apiClient from '../api/client';

export default function JobDetailsScreen({ route, navigation }) {
    const { jobId } = route.params;
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobDetails();
    }, []);

    const fetchJobDetails = async () => {
        try {
            const response = await apiClient.get(`/api/jobs/${jobId}/`);
            setJob(response.data);
        } catch (error) {
            console.error('Error fetching job:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator />;
    if (!job) return <Text>Job not found</Text>;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#08111f' }}>
            <ScrollView style={{ padding: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>{job.title}</Text>
                <Text style={{ color: '#999', marginTop: 8 }}>{job.description}</Text>
                <Text style={{ color: '#fff', marginTop: 16 }}>Budget: Ksh {job.budget}</Text>
                
                <Pressable 
                    style={{ 
                        backgroundColor: '#185FA5', 
                        padding: 14, 
                        borderRadius: 8, 
                        marginTop: 24,
                        alignItems: 'center'
                    }}
                    onPress={() => navigation.navigate('ApplyJob', { jobId })}
                >
                    <Text style={{ color: '#fff', fontWeight: '600' }}>Apply for Job</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}