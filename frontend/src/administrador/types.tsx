export interface Pool {
  id?: number;
  file_number: string;
  legal_name: string;
  commercial_name?: string;
  pool_type: string;
  address: string;
  district: string;
  capacity: number;
  area_m2: number;
  volume_m3: number;
  approval_resolution_number?: string;
  approval_date?: string;
  state: 'RES_EXPIRED' | 'RES_VALID';
  observations?: string;
  expiration_date?: string;
  last_inspection_date?: string;
  current_state: 'HEALTHY' | 'UNHEALTHY';
  latitude?: number;
  longitude?: number;
  image_url?: string;
  rating?: number;
  is_active?: boolean;  // si lo necesitas en PoolManager
}
