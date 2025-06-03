export interface Pool {
  id: string;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
  features: string[];
  rating: number;
  image?: string;
  description?: string;
  address?: string;
  phone?: string;
}

export interface MapProps {
  pools: Pool[];
  onPoolSelect?: (pool: Pool) => void;
  selectedPoolId?: string;
}