# green-hub-portal
Aplicacion para El Green Hub 

## 📋 Gestión de Contenido

### 🔧 Panel de Administración
Para gestionar el contenido de la aplicación, abre el archivo:
```
src/admin/admin-panel.html
```

### 📁 Estructura de Archivos

#### Datos dinámicos:
- `public/data/news.json` - Noticias y actualizaciones
- `public/data/resources.json` - Recursos y documentos
- `src/data/content.js` - Configuración de datos (JavaScript)

#### Documentos:
- `public/documents/` - Carpeta para PDFs, Excel, presentaciones

### 🔄 Cómo actualizar contenido:

#### Método 1: Panel de Administración (Recomendado)
1. Abre `src/admin/admin-panel.html` en tu navegador
2. Usa la interfaz gráfica para agregar/editar/eliminar contenido
3. Los cambios se guardan automáticamente

#### Método 2: Editar archivos JSON directamente
1. **Noticias**: Edita `public/data/news.json`
2. **Recursos**: Edita `public/data/resources.json`
3. **Documentos**: Sube archivos a `public/documents/`

#### Método 3: Editar código JavaScript
1. Modifica las variables en `src/data/content.js`
2. Importa y usa los datos en tu aplicación

### 📚 Subir documentos:
1. Coloca tus archivos en `public/documents/`
2. En recursos, usa la ruta: `/documents/nombre-archivo.pdf`
3. Para enlaces externos: `https://ejemplo.com`

### 🏢 Gestión de salas:
- Las reservas se guardan en localStorage
- Para persistencia real, conecta con una base de datos
- Modifica la variable `rooms` para agregar/quitar salas

### 🎯 Personalización:
- Colores: Modifica las clases de Tailwind CSS
- Logo: Reemplaza el emoji 🌱 con tu logo
- Textos: Edita directamente en el HTML o usa los archivos JSON

## 🚀 Próximos pasos recomendados:
1. Conectar con una base de datos real (Supabase, Firebase)
2. Implementar autenticación de usuarios
3. Agregar sistema de notificaciones push
4. Crear API para gestión de contenido
5. Implementar sistema de permisos por roles