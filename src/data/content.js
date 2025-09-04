// Archivo de configuración de contenido para Green Hub Portal

export const newsData = [
  {
    id: 1,
    title: "Nueva política de reciclaje implementada",
    content: "A partir del próximo lunes, implementaremos contenedores de reciclaje especializados en todas las áreas comunes.",
    date: "2024-01-15",
    isNew: true
  },
  {
    id: 2,
    title: "Taller de sostenibilidad - Viernes 2 PM",
    content: "Únete a nuestro taller sobre prácticas sostenibles en el hogar. Sala El Tucán.",
    date: "2024-01-14",
    isNew: true
  },
  {
    id: 3,
    title: "Certificación Green Office obtenida",
    content: "¡Celebramos haber obtenido la certificación Green Office nivel Gold!",
    date: "2024-01-10",
    isNew: false
  }
];

export const roomsData = [
  {
    id: 1,
    name: "La Palma",
    capacity: 8,
    equipment: ["Proyector", "Pizarra", "Video conferencia"]
  },
  {
    id: 2,
    name: "El Tucán",
    capacity: 12,
    equipment: ["TV 55\"", "Sistema de audio", "Pizarra digital"]
  },
  {
    id: 3,
    name: "Equation Coffee",
    capacity: 6,
    equipment: ["Cafetera", "Proyector", "Ambiente relajado"]
  },
  {
    id: 4,
    name: "Sala Verde",
    capacity: 15,
    equipment: ["Proyector 4K", "Sistema de sonido", "Plantas naturales"]
  },
  {
    id: 5,
    name: "Innovación",
    capacity: 10,
    equipment: ["Pizarra interactiva", "Cámaras 360°", "Iluminación LED"]
  },
  {
    id: 6,
    name: "Sostenible",
    capacity: 20,
    equipment: ["Auditorio", "Micrófono", "Pantalla gigante"]
  }
];

export const resourcesData = [
  {
    id: 1,
    title: "Manual del Empleado 2024",
    type: "PDF",
    url: "/documents/manual-empleado-2024.pdf",
    description: "Guía completa para nuevos empleados"
  },
  {
    id: 2,
    title: "Guía de Sostenibilidad",
    type: "PDF",
    url: "/documents/guia-sostenibilidad.pdf",
    description: "Prácticas eco-amigables en la oficina"
  },
  {
    id: 3,
    title: "Objetivos Green Hub 2024",
    type: "Presentación",
    url: "/documents/objetivos-2024.pptx",
    description: "Metas y proyectos para este año"
  },
  {
    id: 4,
    title: "Directorio de Contactos",
    type: "Excel",
    url: "/documents/directorio-contactos.xlsx",
    description: "Lista completa de empleados y departamentos"
  },
  {
    id: 5,
    title: "Herramientas Digitales",
    type: "Web",
    url: "https://tools.greenhub.com",
    description: "Acceso a plataformas internas"
  },
  {
    id: 6,
    title: "Biblioteca Digital",
    type: "Web",
    url: "https://library.greenhub.com",
    description: "Recursos de aprendizaje y desarrollo"
  }
];

export const purposesData = [
  {
    id: 1,
    author: "Equipo Marketing",
    purpose: "Reducir el uso de papel en nuestras campañas digitales y promover la comunicación electrónica.",
    date: "2024-01-15"
  },
  {
    id: 2,
    author: "Departamento IT",
    purpose: "Implementar servidores más eficientes energéticamente y reducir el consumo eléctrico en 30%.",
    date: "2024-01-14"
  },
  {
    id: 3,
    author: "Recursos Humanos",
    purpose: "Crear programas de transporte sostenible para empleados, incluyendo bicicletas compartidas.",
    date: "2024-01-12"
  }
];

// Función para cargar datos desde archivo JSON
export async function loadDataFromJSON(filename) {
  try {
    const response = await fetch(`/data/${filename}.json`);
    return await response.json();
  } catch (error) {
    console.error(`Error cargando ${filename}:`, error);
    return [];
  }
}

// Función para guardar datos (requiere backend)
export async function saveData(endpoint, data) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error(`Error guardando en ${endpoint}:`, error);
    return null;
  }
}