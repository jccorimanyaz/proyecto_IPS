// src/hooks/usePools.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Pool } from '../types';
import { getAllPools, createPool, updatePool, togglePoolActiveState } from '../services/poolService';

interface PoolStats {
    totalPools: number;
    healthyPools: number;
    unhealthyPools: number;
    activePools: number;
    averageRating: number;
}

export const usePools = () => {
    const [pools, setPools] = useState<Pool[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const stats: PoolStats = useMemo(() => {
        const ratingsWithValues = pools.filter(p => p.rating !== null);
        const weightedSum = ratingsWithValues.reduce((sum, p) => {
            const weight = p.is_active ? 1 : 0.5;
            return sum + (p.rating! * weight);
        }, 0);
        const totalWeight = ratingsWithValues.reduce((sum, p) => sum + (p.is_active ? 1 : 0.5), 0);
        const averageRating = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : 0;

        return {
            totalPools: pools.length,
            healthyPools: pools.filter(p => p.current_state === 'HEALTHY').length,
            unhealthyPools: pools.filter(p => p.current_state === 'UNHEALTHY').length,
            activePools: pools.filter(p => p.is_active).length,
            averageRating
        };
    }, [pools]);

    const fetchPools = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const poolsData = await getAllPools();
            setPools(poolsData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPools();
    }, [fetchPools]);

    const addPool = async (poolData: Omit<Pool, 'id'>) => {
        await createPool(poolData);
        await fetchPools();
    };

    const editPool = async (poolId: number, poolData: Partial<Pool>) => {
        await updatePool(poolId, poolData);
        await fetchPools();
    };

    const toggleActive = async (poolId: number, currentStatus: boolean) => {
        await togglePoolActiveState(poolId, !currentStatus);
        await fetchPools();
    };

    return { pools, loading, error, stats, addPool, editPool, toggleActive };
};