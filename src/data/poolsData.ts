import { Pool } from "../types/Pool";

//datos de prueba para las piscinas
export const poolsData: Pool[] = [
    {
        id: '1',
        name: 'Piscina Club Arequipa',
        latitude: -16.4040102,
        longitude: -71.559611,
        features: [
            'Agua limpia',
            'Cloración adecuada',
            'Sin objetos flotantes',
            'Área de niños'
        ],
        rating: 4.5,
        description: 'Piscina principal del Club Arequipa',
        address: 'Av. Ejercito 1234, Arequipa',
        phone: '+51 123 456 789',
    },
    {
        id: '2',
        name: 'Piscina Municipal de Yanahuara',
        latitude: -16.3920102,
        longitude: -71.537611,
        features: [
            'Agua tratada',
            'Zona de descanso',
            'Cafetería cercana'
        ],
        rating: 4.0,
        description: 'Piscina pública con acceso gratuito',
        address: 'Av. Dolores 123, Arequipa',
        phone: '+51 123 456 789',
    },
    {
        id: '3',
        name: 'Piscina del Hotel Casa Andina',
        latitude: -16.3980102,
        longitude: -71.543611,
        features: [
            'Agua climatizada',
            'Servicio de bar',
            'Vista panorámica'
        ],
        rating: 4.8,
        description: 'Piscina exclusiva para huéspedes del hotel',
        address: 'Av. Municipal 456, Paucarpata',
        phone: '+51 123 456 789',
    }
];