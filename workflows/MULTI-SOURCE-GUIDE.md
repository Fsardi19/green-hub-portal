# 🔗 Guía Multi-Fuente para LinkedIn

Cómo añadir múltiples páginas de LinkedIn y otras fuentes para repostear automáticamente.

---

## 🎯 Lo que vas a lograr

Configurar tu workflow para que obtenga contenido de:
- ✅ **Múltiples páginas de LinkedIn** de tu grupo
- ✅ **Feeds RSS** de blogs o sitios web
- ✅ **Contenido generado** por IA

---

## 📍 PASO 1: Obtener IDs de tus páginas LinkedIn

Para cada página de LinkedIn que quieras incluir:

### Método 1: Desde la URL

1. **Ve a la página de LinkedIn**
   ```
   Ejemplo: https://www.linkedin.com/company/green-hub-portal/
   ```

2. **El ID está en la URL**
   ```
   https://www.linkedin.com/company/[ESTE_ES_EL_ID]/
   ```

### Método 2: Desde el código fuente

1. **Abre la página de LinkedIn**
2. **Click derecho → Ver código fuente**
3. **Busca:** `organizationId` o `companyId`
4. **Copia el número**

### Lista tus IDs:

```
Green Hub Portal:      92768394
Empresa Hermana 1:     _________
Empresa Hermana 2:     _________
Empresa Hermana 3:     _________
```

---

## 🔧 PASO 2: Editar el Workflow en n8n

### Opción A: Añadir otra rama RSS (Más simple)

En tu workflow actual:

1. **Duplica el nodo "RSS Feed Read"**
   - Click derecho en el nodo → **Duplicate**
   - O añade un nuevo nodo "RSS Feed Read"

2. **Cambia la URL:**
   ```
   https://www.linkedin.com/company/[TU_NUEVO_ID]
   ```

3. **Conecta al nodo "Filter and Process"**
   - Arrastra la conexión al mismo nodo de filtrado

**Resultado visual:**
```
Schedule Trigger
    ↓
    ├─→ RSS Feed 1 (Green Hub)
    ├─→ RSS Feed 2 (Empresa 2)  ← NUEVO
    └─→ RSS Feed 3 (Empresa 3)  ← NUEVO
         ↓
    Filter and Process
```

### Opción B: Usar un nodo Code para múltiples fuentes (Más avanzado)

1. **Añade un nodo "Code" después del Schedule Trigger**

2. **Pega este código:**

```javascript
// 🎯 CONFIGURACIÓN MULTI-FUENTE
// Añade todas tus fuentes aquí

const sources = [
  {
    id: '92768394',
    name: 'Green Hub Portal',
    url: 'https://www.linkedin.com/company/92768394',
    type: 'linkedin'
  },
  {
    id: 'TU_ID_AQUI',  // ← CAMBIA ESTO
    name: 'Empresa Hermana 1',
    url: 'https://www.linkedin.com/company/TU_ID_AQUI',
    type: 'linkedin'
  },
  {
    id: 'TU_ID_AQUI',  // ← CAMBIA ESTO
    name: 'Empresa Hermana 2',
    url: 'https://www.linkedin.com/company/TU_ID_AQUI',
    type: 'linkedin'
  },
  // Añade más fuentes RSS si quieres
  {
    name: 'Blog Corporativo',
    url: 'https://tu-blog.com/feed',
    type: 'rss'
  }
];

// Retornar todas las fuentes
return sources.map(source => ({ json: source }));
```

3. **Añade un nodo "HTTP Request" después**

4. **Configura:**
   - URL: `={{ $json.url }}`
   - Method: GET
   - Response Format: Text

5. **Conecta al resto del workflow**

---

## 📊 PASO 3: Configurar prioridades

Si quieres que ciertas fuentes tengan más prioridad:

### En el nodo "Filter and Process":

```javascript
// Añade esto al código existente

const prioritySources = {
  'green-hub-portal': 10,    // Alta prioridad
  'empresa-hermana-1': 8,     // Media-alta
  'empresa-hermana-2': 6,     // Media
  'blog-corporativo': 5       // Baja
};

// Cuando calcules el score, añade:
const sourceKey = post.link.includes('green-hub') ? 'green-hub-portal' : 'empresa-hermana-1';
const sourcePriority = prioritySources[sourceKey] || 5;

score += sourcePriority;
```

---

## 🎨 PASO 4: Personalizar por fuente

Puedes personalizar el contenido según la fuente:

### En el nodo "Build Post":

```javascript
const item = $input.first().json;
let postText = '';
let hashtags = '#Sostenibilidad #Innovación';

// Personalizar según la fuente
if (item.link.includes('green-hub-portal')) {
  hashtags += ' #GreenHub';
  postText = `💚 Desde Green Hub:\n\n${item.title}`;

} else if (item.link.includes('empresa-hermana-1')) {
  hashtags += ' #EmpresaHermana';
  postText = `🔗 Contenido destacado:\n\n${item.title}`;

} else {
  postText = `📰 ${item.title}`;
}

// Construir post completo
postText += `\n\n${item.description}\n\n🔗 ${item.link}\n\n${hashtags}`;

return [{ json: { text: postText } }];
```

---

## 🚀 Ejemplos Prácticos

### Ejemplo 1: Grupo de 3 empresas

```javascript
// En nodo Code después de Schedule
const companies = [
  { id: '92768394', name: 'Green Hub' },
  { id: '12345678', name: 'EcoTech Solutions' },
  { id: '87654321', name: 'Sustainable Future' }
];

return companies.map(company => ({
  json: {
    url: `https://www.linkedin.com/company/${company.id}`,
    name: company.name
  }
}));
```

### Ejemplo 2: LinkedIn + RSS + Twitter

```javascript
const sources = [
  // LinkedIn
  {
    url: 'https://www.linkedin.com/company/92768394',
    type: 'linkedin',
    priority: 10
  },
  // Blog RSS
  {
    url: 'https://blog.empresa.com/feed',
    type: 'rss',
    priority: 7
  },
  // Otro RSS
  {
    url: 'https://noticias-sostenibilidad.com/rss',
    type: 'rss',
    priority: 6
  }
];
```

---

## 🔄 Workflow Completo Multi-Fuente

Así queda tu workflow con múltiples fuentes:

```
┌─────────────────┐
│ Schedule (3h)   │
└────────┬────────┘
         │
    ┌────▼─────┐
    │   Code   │  ← Define todas tus fuentes
    │ Sources  │
    └────┬─────┘
         │
    ┌────▼────────┐
    │ Loop Over   │
    │ Items       │
    └─────┬───────┘
          │
    ┌─────▼─────────┐
    │ RSS/HTTP      │  ← Obtiene contenido de cada fuente
    │ Request       │
    └─────┬─────────┘
          │
    ┌─────▼─────────┐
    │ Filter        │  ← Filtra lo relevante
    │ and Process   │
    └─────┬─────────┘
          │
    ┌─────▼─────────┐
    │ Google        │  ← Evita duplicados
    │ Sheets        │
    └─────┬─────────┘
          │
    ┌─────▼─────────┐
    │ OpenAI        │  ← Genera comentario
    └─────┬─────────┘
          │
    ┌─────▼─────────┐
    │ Build Post    │  ← Construye post
    └─────┬─────────┘
          │
    ┌─────▼─────────┐
    │ LinkedIn      │  ← Publica
    └───────────────┘
```

---

## ⚙️ Configuración Recomendada

### Para 3-5 páginas del grupo:

```javascript
const config = {
  checkInterval: '3 hours',     // No muy seguido
  postsPerSource: 5,            // 5 posts por fuente
  minRelevanceScore: 40,        // Score mínimo
  maxPostsPerDay: 3             // Máximo a publicar
};
```

### Para 10+ fuentes:

```javascript
const config = {
  checkInterval: '6 hours',     // Menos frecuente
  postsPerSource: 3,            // Solo top 3 de cada fuente
  minRelevanceScore: 60,        // Score más alto
  maxPostsPerDay: 5             // Más publicaciones
};
```

---

## 📝 Checklist de Configuración

Para cada nueva fuente:

- [ ] Obtener ID o URL de la fuente
- [ ] Añadir al array de sources en el código
- [ ] Asignar prioridad (1-10)
- [ ] Personalizar hashtags si es necesario
- [ ] Probar manualmente con "Execute Workflow"
- [ ] Verificar que aparece en Google Sheets
- [ ] Ajustar filtros si es necesario

---

## 🎯 Dónde Añadir Fuentes en tu Workflow Actual

### Si usas `linkedin-automation-simple.json`:

**Ubicación exacta:** Nodo "RSS Feed Read" (segundo nodo)

**Qué hacer:**

1. **Abre tu workflow en n8n**

2. **Ve al nodo "RSS Feed Read"** (el segundo después del Schedule)

3. **Duplica este nodo** (click derecho → Duplicate)

4. **En el nuevo nodo cambia la URL:**
   ```
   De: https://www.linkedin.com/company/92768394
   A:  https://www.linkedin.com/company/TU_NUEVO_ID
   ```

5. **Conecta el Schedule Trigger al nuevo nodo**

6. **Conecta el nuevo nodo al "Filter and Process"**

**Visual:**

```
ANTES:
Schedule → RSS Feed → Filter

DESPUÉS:
        ┌→ RSS Feed 1 (Green Hub) ┐
Schedule┤                         ├→ Filter
        └→ RSS Feed 2 (Nueva)     ┘
```

---

## 💡 Tips Avanzados

### 1. Rotar entre fuentes

```javascript
// En el nodo Code
const lastSource = $workflow.staticData.lastSource || 0;
const sources = [...]; // Tu array de fuentes

// Seleccionar siguiente fuente
const currentSource = sources[lastSource % sources.length];
$workflow.staticData.lastSource = lastSource + 1;

return [{ json: currentSource }];
```

### 2. Fuentes según día de la semana

```javascript
const today = new Date().getDay(); // 0 = Domingo, 1 = Lunes, etc.

const schedule = {
  0: ['source1', 'source2'],  // Domingo
  1: ['source3', 'source4'],  // Lunes
  2: ['source1', 'source3'],  // Martes
  // etc.
};

const todaySources = schedule[today];
```

### 3. Balancear contenido de cada fuente

```javascript
// Mantener contador de posts por fuente
const counters = $workflow.staticData.sourceCounters || {};

// Al publicar, incrementar
counters[sourceName] = (counters[sourceName] || 0) + 1;

// Priorizar fuentes con menos posts
score -= counters[sourceName] * 5;
```

---

## 🆘 Problemas Comunes

### No aparece contenido de una fuente

**Solución:**
1. Verifica que el ID es correcto
2. Verifica que la página tiene posts recientes
3. Reduce el `minRelevanceScore` temporalmente
4. Revisa logs en n8n

### Una fuente domina todas las publicaciones

**Solución:**
```javascript
// Limitar posts por fuente
const postsPerSource = {};
items.forEach(item => {
  const source = item.source;
  if (!postsPerSource[source]) postsPerSource[source] = [];
  if (postsPerSource[source].length < 2) {  // Máximo 2 por fuente
    postsPerSource[source].push(item);
  }
});
```

### Publicaciones duplicadas entre fuentes

**Solución:**
```javascript
// En Filter and Process, deduplicar por URL
const seenUrls = new Set();
items = items.filter(item => {
  if (seenUrls.has(item.url)) return false;
  seenUrls.add(item.url);
  return true;
});
```

---

## ✅ Resumen Rápido

**Para añadir una nueva fuente:**

1. Obtén el ID de LinkedIn: `https://www.linkedin.com/company/[ID]`
2. Duplica el nodo "RSS Feed Read"
3. Cambia la URL al nuevo ID
4. Conecta al workflow
5. Prueba manualmente
6. ¡Listo! 🎉

**Tiempo:** 2 minutos por fuente

---

## 📞 Siguiente Paso

Una vez configuradas tus fuentes:

1. **Prueba el workflow manualmente** (botón Execute)
2. **Verifica que todas las fuentes funcionan**
3. **Ajusta prioridades** según resultados
4. **Activa el workflow**
5. **Monitorea los primeros días**

---

**¿Necesitas ayuda?** Muéstrame:
- Los IDs de las páginas que quieres añadir
- Qué fuentes RSS tienes
- Cómo quieres priorizar cada una

¡Te ayudo a configurarlo específicamente para tu caso! 🚀
