export interface Pool {
  id: number;
  commercial_name: string;
  legal_name: string;
  address: string;
  district: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  rating: number;
  current_state: string;
}

export interface MapProps {
  pools: Pool[];
  onPoolSelect?: (pool: Pool) => void;
  selectedPoolId?: string;
}