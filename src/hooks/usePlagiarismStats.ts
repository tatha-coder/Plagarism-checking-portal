'use client';

import { useState, useEffect, useCallback } from 'react';

export interface DashboardStats {
  totalChecked: number;
  averageSimilarity: number;
  highestSimilarity: number;
  riskCounts: {
    low: number;
    moderate: number;
    high: number;
    very_high: number;
  };
  recentSubmissions: {
    reportId: string;
    documentId: string;
    title: string;
    filename: string;
    fileType: string;
    wordCount: number;
    overallScore: number;
    riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
    createdAt: string;
  }[];
}

export function usePlagiarismStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/dashboard/stats');
      if (!res.ok) {
        throw new Error('Failed to fetch dashboard statistics');
      }
      const data = await res.json();
      setStats(data.stats);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
