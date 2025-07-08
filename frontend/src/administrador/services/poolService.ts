import API from '../../api/axios';
import { Pool } from '../types';
import { extractArray } from '../../utils/api';

/**
 * Obtiene todas las piscinas desde la API.
 */
export const getAllPools = async (): Promise<Pool[]> => {
    try {
        const res = await API.get('pool/all/');
        return extractArray<Pool>(res.data);
    } catch (error) {
        console.error('Error fetching pools:', error);
        throw new Error('No se pudieron cargar las piscinas.');
    }
};

/**
 * Crea una nueva piscina.
 * @param poolData - Datos de la piscina a crear.
 */
export const createPool = async (poolData: Omit<Pool, 'id'>): Promise<Pool> => {
    try {
        const res = await API.post('pool/create/', poolData);
        return res.data;
    } catch (error) {
        console.error('Error creating pool:', error);
        throw new Error('Error al crear la piscina.');
    }
};

/**
 * Actualiza una piscina existente.
 * @param poolId - ID de la piscina a actualizar.
 * @param poolData - Datos a actualizar.
 */
export const updatePool = async (poolId: number, poolData: Partial<Pool>): Promise<Pool> => {
    try {
        const res = await API.patch(`pool/all/${poolId}/`, poolData);
        return res.data;
    } catch (error) {
        console.error('Error updating pool:', error);
        throw new Error('Error al actualizar la piscina.');
    }
};

/**
 * Cambia el estado (activo/inactivo) de una piscina.
 * @param poolId - ID de la piscina.
 * @param is_active - Nuevo estado de actividad.
 */
export const togglePoolActiveState = async (poolId: number, is_active: boolean): Promise<Pool> => {
    try {
        const res = await API.patch(`pool/all/${poolId}/`, { is_active });
        return res.data;
    } catch (error) {
        console.error('Error toggling pool active state:', error);
        throw new Error('Error al cambiar el estado de la piscina.');
    }
};