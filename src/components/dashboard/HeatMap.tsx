import React, { useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet.heat';
import L from 'leaflet';

interface HeatmapMapProps {
  heatData: [number, number, number][];
}

const HeatmapMap: React.FC<HeatmapMapProps> = ({ heatData }) => {
  useEffect(() => {
    const map = L.map('heatmap').setView([-16.409, -71.537], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    (L as any).heatLayer(heatData, { radius: 25 }).addTo(map);
    return () => { map.remove(); };
  }, [heatData]);

  return (
    <div>
      <h5>Mapa de Calor de Comentarios</h5>
      <div id="heatmap" style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
};

export default HeatmapMap;