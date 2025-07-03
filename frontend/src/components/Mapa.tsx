import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapProps } from '../types/Pool';

console.log('[Mapa.tsx] 0. Archivo cargado.');

// Arreglamos los iconos por defecto de Leaflet en React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const Mapa: React.FC<MapProps> = ({ pools, onPoolSelect, selectedPoolId }) => {
    console.log('[Mapa.tsx] 1. Componente renderizado, props recibidas:', { pools, onPoolSelect, selectedPoolId });

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<{ [key: string]: L.Marker }>({});

    //funcion para crear un ícono personalizado para las piscinas
    const createPoolIcon = (isSelected: boolean = false) => {
        return L.divIcon({
            html: `<div style="background:${isSelected ? '#28a745' : '#007bff'};border:2px solid white;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;color:white;font-size:16px;box-shadow:0 2px 5px rgba(0,0,0,0.3);transition:all 0.2s ease;transform:${isSelected ? 'scale(1.2)' : 'scale(1)'};">🏊‍♀️</div>`,
            className: 'custom-pool-marker', //es importante para evitar conflictos con los estilos por defecto de Leaflet
            iconSize: [30, 30],
            iconAnchor: [15, 15],
        });
    };

    //efecto para inicializar el mapa una sola vez cuando el componente se monta
    useEffect(() => {
        //Verificar si el contenedor del mapa está disponible y si la instancia del mapa aún no ha sido creada
        if (mapRef.current && !mapInstanceRef.current) {
            // console.log('%c[Mapa.tsx] 2. Inicializando instancia de Leaflet...', 'color: blue; font-weight: bold;');
            try {
                const map = L.map(mapRef.current, {
                    center: [-16.4040102, -71.559611], //coordenadas de Arequipa
                    zoom: 13,
                });

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }).addTo(map);

                mapInstanceRef.current = map;
                // console.log('%c[Mapa.tsx] 3. Mapa inicializado correctamente.', 'color: green;');
            } catch (error) {
                console.error('%c[Mapa.tsx] ERROR CRÍTICO al inicializar el mapa:', 'color: red;', error);
            }
        }

        //funcion de limpieza para eliminar la instancia del mapa cuando el componente se desmonta
        return () => {
            console.log('%c[Mapa.tsx] Limpiando instancia del mapa.', 'color: orange;');
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []); //el array vacion indica que este efecto solo se ejecuta una vez al montar el componente

    //efecto para añadir o actualizar los marcadores de las piscinas cuando `pools` cambia
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !pools) {
            console.warn('[Mapa.tsx] No se pueden añadir marcadores: el mapa o los datos de piscinas no están listos.');
            return;
        }

        // console.log('%c[Mapa.tsx] 4. Actualizando marcadores de piscinas...', 'color: blue; font-weight: bold;');

        //se limpian marcadores anteriores
        Object.values(markersRef.current).forEach(marker => marker.remove());
        markersRef.current = {};

        if (pools.length === 0) {
            console.warn('[Mapa.tsx] El array pools está vacío.');
            return;
        }

        pools.forEach((pool) => {
            pool.latitude = parseFloat(pool.latitude as any);
            pool.longitude = parseFloat(pool.longitude as any);
            if (typeof pool.latitude !== 'number' || typeof pool.longitude !== 'number') {
                console.error(`%c[Mapa.tsx] DATOS INCORRECTOS para la piscina: "${pool.commercial_name}". Latitud o longitud inválida.`, pool);
                return; //saltamos la piscina si las coordenadas no son válidas
            }
            
            const marker = L.marker([pool.latitude, pool.longitude], {
                icon: createPoolIcon(false) //empezamos con el ícono normal
            }).addTo(map);

            marker.on('click', () => {                
                if (onPoolSelect) {
                    onPoolSelect(pool);
                }
            });

            marker.bindPopup(`<b>${pool.commercial_name}</b>`);
            markersRef.current[pool.id] = marker;
        });

        //ajustamos la vista del mapa para que muestre todos los marcadores
        const group = new L.FeatureGroup(Object.values(markersRef.current));
        if (Object.keys(markersRef.current).length > 0) {
            map.fitBounds(group.getBounds().pad(0.2));
        }

    }, [pools]); //este efecto se ejecuta cada vez que `pools` cambia

    //efecto para resaltar la piscina seleccionada
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !selectedPoolId) {
             //si no hay ninguno seleccionado, restauramos todos los íconos a su estado normal
             Object.values(markersRef.current).forEach(marker => {
                marker.setIcon(createPoolIcon(false));
            });
            return;
        };

        console.log(`%c[Mapa.tsx] 6. Resaltando piscina con ID: ${selectedPoolId}`, 'color: blue; font-weight: bold;');
        
        //actualizamos el ícono de cada marcador según si es el seleccionado o no
        Object.entries(markersRef.current).forEach(([id, marker]) => {
            const isSelected = String(id) === String(selectedPoolId);
            marker.setIcon(createPoolIcon(isSelected));
            
            //si es el seleccionado, lo ponemos por encima de los demás y centramos el mapa
            if (isSelected) {
                marker.setZIndexOffset(1000);
                marker.openPopup();
                const pool = pools.find(p => String(p.id) === String(selectedPoolId));
                if (pool) {
                    map.setView([pool.latitude, pool.longitude], 15); //zoom más cercano
                }
            } else {
                 marker.setZIndexOffset(0); //estado normal
            }
        });

    }, [selectedPoolId, pools]); //depende del ID de la piscina seleccionada y de los datos de las piscinas

    //el JSX que renderiza el mapa se coloca en un div
    return (
        <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
    );
};

export default Mapa;