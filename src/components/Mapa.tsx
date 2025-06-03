import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Pool, MapProps } from '../types/Pool';

//arreglamos los iconos de Leaflet en React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const Mapa: React.FC<MapProps> = ({ pools, onPoolSelect, selectedPoolId }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<{ [key: string]: L.Marker }>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!mapRef.current) return;

        try {
            //se crea el mapa centrado en Arequipa
            const map = L.map(mapRef.current, {
                center: [-16.4040102, -71.559611],
                zoom: 12,
                zoomControl: true,
                scrollWheelZoom: true,
                doubleClickZoom: true,
                boxZoom: true,
                keyboard: true,
                dragging: true,
                touchZoom: true
            });

            //añadimos openstreetmap como capa base y con estilos personalizados
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
                tileSize: 256,
                zoomOffset: 0
            }).addTo(map);

            mapInstanceRef.current = map;

            //se crean iconos personalizados para las piscinas
            const createPoolIcon = (isSelected: boolean = false) => {
                return L.divIcon({
                    html: `
            <div style="
              background: ${isSelected ? '#28a745' : '#007bff'};
              border: 3px solid white;
              border-radius: 50%;
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 18px;
              box-shadow: 0 3px 10px rgba(0,0,0,0.3);
              cursor: pointer;
              transition: all 0.3s ease;
              transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
            ">
              🏊‍♀️
            </div>
          `,
                    className: 'custom-pool-marker',
                    iconSize: [32, 32],
                    iconAnchor: [16, 16],
                    popupAnchor: [0, -20]
                });
            };

            //se limpian los marcadores existentes antes de añadir nuevos
            Object.values(markersRef.current).forEach(marker => {
                map.removeLayer(marker);
            });
            markersRef.current = {};

            //se añaden los marcadores de las piscinas al mapa
            pools.forEach((pool) => {
                const isSelected = selectedPoolId === pool.id;
                const marker = L.marker([pool.position.lat, pool.position.lng], {
                    icon: createPoolIcon(isSelected)
                }).addTo(map);

                markersRef.current[pool.id] = marker;

                //se crea el contenido del popup para cada piscina
                const popupContent = createPopupContent(pool);

                marker.bindPopup(popupContent, {
                    maxWidth: 320,
                    minWidth: 280,
                    className: 'custom-popup',
                    closeButton: true,
                    autoClose: false,
                    closeOnEscapeKey: true
                });

                marker.on('click', () => {
                    if (onPoolSelect) {
                        onPoolSelect(pool);
                    }
                });

                //se muestra el popup si la piscina está seleccionada
                if (isSelected) {
                    marker.openPopup();
                    map.setView([pool.position.lat, pool.position.lng], 14);
                }
            });

            setIsLoading(false);

            //se ajusta la vista del mapa para mostrar todas las piscinas
            if (pools.length > 0) {
                const group = new L.FeatureGroup(Object.values(markersRef.current));
                map.fitBounds(group.getBounds().pad(0.1));
            }

        } catch (error) {
            console.error('Error al inicializar el mapa:', error);
            setIsLoading(false);
        }

        //cleanup al desmontar el componente
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [pools]);

    //se actualizan los marcadores y el popup cuando cambia la piscina seleccionada
    useEffect(() => {
        if (!mapInstanceRef.current || !selectedPoolId) return;

        Object.entries(markersRef.current).forEach(([poolId, marker]) => {
            const isSelected = poolId === selectedPoolId;
            const pool = pools.find(p => p.id === poolId);

            if (pool) {
                const createPoolIcon = (isSelected: boolean = false) => {
                    return L.divIcon({
                        html: `
              <div style="
                background: ${isSelected ? '#28a745' : '#007bff'};
                border: 3px solid white;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 18px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.3);
                cursor: pointer;
                transition: all 0.3s ease;
                transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
              ">
                🏊‍♀️
              </div>
            `,
                        className: 'custom-pool-marker',
                        iconSize: [32, 32],
                        iconAnchor: [16, 16],
                        popupAnchor: [0, -20]
                    });
                };

                marker.setIcon(createPoolIcon(isSelected));

                if (isSelected) {
                    marker.openPopup();
                    if (mapInstanceRef.current) {
                        mapInstanceRef.current.setView([pool.position.lat, pool.position.lng], 15);
                    }
                }
            }
        });
    }, [selectedPoolId, pools]);

    const createPopupContent = (pool: Pool): string => {
        const stars = '★'.repeat(Math.floor(pool.rating)) + '☆'.repeat(5 - Math.floor(pool.rating));

        return `
      <div style="padding: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="
          border-bottom: 2px solid #e9ecef; 
          padding-bottom: 10px; 
          margin-bottom: 15px;
          text-align: center;
        ">
          <h4 style="
            margin: 0 0 8px 0; 
            color: #343a40; 
            font-size: 18px; 
            font-weight: 600;
            line-height: 1.2;
          ">
            ${pool.name}
          </h4>
          <div style="
            color: #ffc107; 
            font-size: 16px;
            margin-bottom: 5px;
          ">
            ${stars}
          </div>
          <span style="
            color: #6c757d;
            font-size: 12px;
            font-weight: 500;
          ">
            ${pool.rating}/5.0
          </span>
        </div>
        
        <div style="margin-bottom: 15px;">
          <h6 style="
            margin: 0 0 8px 0; 
            color: #495057; 
            font-size: 14px; 
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 5px;
          ">
            ✨ Características:
          </h6>
          <ul style="
            margin: 0; 
            padding-left: 16px; 
            color: #6c757d; 
            font-size: 13px; 
            line-height: 1.5;
          ">
            ${pool.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
        
        ${pool.description ? `
          <div style="
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 12px;
            border-radius: 6px;
            border-left: 4px solid #007bff;
            margin-bottom: 15px;
          ">
            <p style="
              margin: 0;
              color: #495057;
              font-size: 13px;
              font-style: italic;
              line-height: 1.4;
            ">
              📍 ${pool.description}
            </p>
          </div>
        ` : ''}
        
        ${pool.address ? `
          <div style="
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
          ">
            <span style="color: #007bff; font-size: 12px;">📍</span>
            <span style="color: #6c757d; font-size: 12px;">${pool.address}</span>
          </div>
        ` : ''}
        
        ${pool.phone ? `
          <div style="
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 15px;
          ">
            <span style="color: #28a745; font-size: 12px;">📞</span>
            <span style="color: #6c757d; font-size: 12px;">${pool.phone}</span>
          </div>
        ` : ''}
        
        <div style="
          text-align: center;
          padding-top: 10px;
          border-top: 1px solid #e9ecef;
        ">
          <button 
            onclick="window.dispatchEvent(new CustomEvent('poolInfoClick', { detail: '${pool.id}' }))"
            style="
              background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
              color: white;
              border: none;
              padding: 8px 20px;
              border-radius: 20px;
              cursor: pointer;
              font-size: 12px;
              font-weight: 600;
              transition: all 0.3s ease;
              box-shadow: 0 2px 4px rgba(0,123,255,0.3);
            "
            onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(0,123,255,0.4)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,123,255,0.3)'"
          >
            Ver detalles completos
          </button>
        </div>
      </div>
    `;
    };

    //escuchamos el evento personalizado para seleccionar una piscina
    useEffect(() => {
        const handlePoolInfoClick = (event: CustomEvent) => {
            const poolId = event.detail;
            const pool = pools.find(p => p.id === poolId);
            if (pool && onPoolSelect) {
                onPoolSelect(pool);
            }
        };

        window.addEventListener('poolInfoClick', handlePoolInfoClick as EventListener);

        return () => {
            window.removeEventListener('poolInfoClick', handlePoolInfoClick as EventListener);
        };
    }, [pools, onPoolSelect]);

    if (isLoading) {
        return (
            <div style={{
                width: '100%',
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
            }}>
                <div style={{ textAlign: 'center', color: '#6c757d' }}>
                    <div style={{
                        fontSize: '2rem',
                        marginBottom: '10px',
                        animation: 'spin 2s linear infinite'
                    }}>
                        🏊‍♀️
                    </div>
                    <p style={{ margin: 0, fontSize: '14px' }}>Cargando mapa...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            <div
                ref={mapRef}
                style={{
                    width: '100%',
                    height: '400px',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
            />

            {/* Estilos CSS embebidos */}
            <style>{`
        .custom-pool-marker {
          border: none !important;
          background: transparent !important;
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 10px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          border: none;
          background: white;
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border: none;
        }
        
        .custom-popup .leaflet-popup-close-button {
          color: #6c757d;
          font-size: 18px;
          font-weight: bold;
          padding: 8px;
          right: 8px;
          top: 8px;
        }
        
        .custom-popup .leaflet-popup-close-button:hover {
          color: #dc3545;
          background-color: #f8f9fa;
          border-radius: 50%;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .leaflet-control-zoom a {
          border-radius: 4px;
        }
        
        .leaflet-bar a {
          background-color: white;
          border-bottom: 1px solid #ccc;
          color: #007bff;
        }
        
        .leaflet-bar a:hover {
          background-color: #f8f9fa;
        }
      `}</style>
        </div>
    );
};

export default Mapa;