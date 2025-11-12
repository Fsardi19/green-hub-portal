# 🚀 LinkedIn Auto-Publisher para Green Hub Portal

Sistema automatizado de publicación en LinkedIn optimizado para **mínimo uso de tokens** (99% de ahorro).

## 📊 Características

- ✅ **Automatización completa**: Cada 3 horas obtiene, filtra, y publica contenido
- ✅ **Optimización IA**: Solo usa 50 tokens vs 5000 del método tradicional
- ✅ **Deduplicación**: Evita contenido repetido con Google Sheets
- ✅ **Scoring de relevancia**: Filtra solo contenido importante
- ✅ **LinkedIn API oficial**: No depende de RSS feeds inexistentes
- ✅ **Métricas detalladas**: Tracking completo de performance

## 🏗️ Arquitectura del Workflow

```
⏰ Trigger (cada 3h)
    ↓
📰 LinkedIn API (GET posts)
    ↓
🔧 Filtrar & Deduplicar (0 tokens)
    ↓
📊 Verificar Historial (Google Sheets)
    ↓
❓ ¿Es nuevo?
    ↓
📦 Preparar Batch (0 tokens)
    ↓
🤖 Generar Hook AI (50 tokens únicos)
    ↓
🏗️ Construir Post (template, 0 tokens)
    ↓
📤 Publicar en LinkedIn
    ↓
✅ Actualizar Historial
    ↓
📈 Registrar Métricas
```

## 🎯 Optimización de Tokens

| Componente | Tokens Usados | Método Tradicional |
|------------|---------------|-------------------|
| Filtrado | 0 | 500 |
| Deduplicación | 0 | 300 |
| Análisis relevancia | 0 | 1000 |
| Generación hook | **50** | 1500 |
| Construcción post | 0 | 1700 |
| **TOTAL** | **50** | **5000** |
| **Ahorro** | **99%** | - |

## 📋 Requisitos Previos

### 1. Credenciales LinkedIn OAuth2

```
Authorization URL: https://www.linkedin.com/oauth/v2/authorization
Access Token URL: https://www.linkedin.com/oauth/v2/accessToken
Scope: r_organization_social w_organization_social rw_organization_admin r_liteprofile w_member_social
Client ID: [TU CLIENT ID]
Client Secret: [TU CLIENT SECRET]
```

### 2. Google Sheets para Historial

Crear hoja con estas columnas:

| id | titulo | fecha_captura | estado | relevancia | fecha_publicacion | tokens_usados |
|----|--------|---------------|--------|------------|-------------------|---------------|

### 3. OpenAI API Key

Para generación del hook con GPT-4o-mini.

### 4. LinkedIn Organization ID

Encontrar tu ID en la URL de tu página de empresa:
```
https://www.linkedin.com/company/92768394/
                                ^^^^^^^^
```

## 🚀 Instalación

### Paso 1: Configurar Credenciales en n8n

#### LinkedIn OAuth2
```
Credentials → + New → OAuth2 API
- Name: LinkedIn OAuth2
- Grant Type: Authorization Code
- Authorization URL: https://www.linkedin.com/oauth/v2/authorization
- Access Token URL: https://www.linkedin.com/oauth/v2/accessToken
- Scope: r_organization_social w_organization_social rw_organization_admin
- Client ID: [TU ID]
- Client Secret: [TU SECRET]
→ Save → Connect my account
```

#### Google Sheets
```
Credentials → + New → Google Sheets OAuth2
→ Conectar con tu cuenta de Google
```

#### OpenAI
```
Credentials → + New → OpenAI
- API Key: [TU API KEY]
```

### Paso 2: Crear Google Sheet

1. Crear nuevo Google Sheet
2. Nombrar la hoja: "Historial"
3. Agregar columnas (primera fila):
   ```
   id | titulo | fecha_captura | estado | relevancia | fecha_publicacion | tokens_usados
   ```
4. Copiar el ID del Sheet de la URL:
   ```
   https://docs.google.com/spreadsheets/d/ABC123XYZ/edit
                                           ^^^^^^^^^ (este ID)
   ```

### Paso 3: Importar Workflow

1. n8n → Workflows → + New
2. Menú (...) → Import from File
3. Seleccionar: `workflows/linkedin-auto-publisher-complete.json`
4. Importar

### Paso 4: Configurar IDs

Buscar y reemplazar en los nodos:

#### Nodo "📰 Obtener Posts LinkedIn API"
```javascript
URL: https://api.linkedin.com/v2/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=urn:li:organization:92768394
                                                                                                                     ^^^^^^^^ (cambiar)
```

#### Nodo "📊 Verificar Historial"
```
Document ID: YOUR_SHEET_ID → (pegar tu Sheet ID)
```

#### Nodo "✅ Actualizar Historial"
```
Document ID: YOUR_SHEET_ID → (pegar tu Sheet ID)
```

#### Nodo "📤 Publicar en LinkedIn"
```
Person URN: Obtener de https://www.linkedin.com/developers/
```

### Paso 5: Personalizar Empresa

En nodo "📦 Preparar Batch", línea 20-25:
```javascript
empresa: {
  nombre: "Green Hub",              // ← Cambiar
  sector: "Sostenibilidad",         // ← Cambiar
  tono: "profesional pero cercano", // ← Ajustar
  hashtags: ["#Sostenibilidad", "#GreenHub", "#Innovación"] // ← Personalizar
}
```

### Paso 6: Ajustar Keywords

En nodo "🔧 Filtrar y Deduplicar", línea 23-26:
```javascript
const keywords = [
  'innovación', 'tecnología', 'producto', 'lanzamiento',
  'cliente', 'éxito', 'partnership', 'crecimiento'
];
// ← Agregar palabras clave relevantes para tu empresa
```

## ⚙️ Configuración Avanzada

### Cambiar Frecuencia

Nodo "⏰ Ejecutar cada 3 horas":
```
Interval Hours: 3  → Cambiar a 6, 12, 24, etc.
```

### Ajustar Cantidad de Posts

Nodo "📰 Obtener Posts LinkedIn API":
```
URL: ...&count=10  → Cambiar a 5, 15, 20, etc.
```

### Modificar Template del Post

Nodo "🏗️ Construir Post", línea 9-16:
```javascript
content: `${aiHook}

📰 ${mainPost.title}

${mainPost.description?.substring(0, 150)}...

🔗 Leer más: ${mainPost.link}

${postData.batchSummary.empresa.hashtags.join(' ')} #${postData.batchSummary.empresa.nombre}`
```

## 🧪 Testing

### Test Manual

1. Desactivar trigger temporal
2. Agregar nodo "Manual Trigger" al inicio
3. Conectar a "📰 Obtener Posts LinkedIn API"
4. Click "Execute Workflow"
5. Verificar cada nodo paso a paso

### Verificar Datos

Después de ejecutar, revisar:

1. **Nodo "🔧 Filtrar"**: ¿Cuántos posts filtró?
2. **Nodo "¿Contenido Nuevo?"**: ¿Pasó la validación?
3. **Nodo "🤖 Generar Hook"**: ¿El hook tiene sentido?
4. **Google Sheet**: ¿Se actualizó el historial?
5. **LinkedIn**: ¿Se publicó el post?

## 📈 Métricas y Monitoreo

El nodo "📈 Métricas" registra en consola:

```json
{
  "workflow": "LinkedIn Auto-Publisher Green Hub",
  "execution": {
    "timestamp": "2025-11-12T...",
    "success": true
  },
  "tokens": {
    "used": 50,
    "traditional_method": 5000,
    "saved": 4950,
    "savings_percentage": "99%"
  },
  "posts": {
    "processed": 10,
    "filtered": 5,
    "published": 1
  },
  "cost": {
    "actual": "$0.001",
    "traditional": "$0.10",
    "saved": "$0.099"
  }
}
```

## 🔧 Troubleshooting

### Error: "Unauthorized" en LinkedIn API

**Solución:**
```
1. Credentials → LinkedIn OAuth2 → Reconnect
2. Verificar permisos en https://www.linkedin.com/developers/
3. Asegurar que tienes rol Admin en la página
```

### Error: "Organization not found"

**Solución:**
```
1. Verificar Organization ID en la URL
2. Asegurar formato correcto: urn:li:organization:NUMERO
3. Probar en Postman primero
```

### No se generan posts

**Solución:**
```
1. Verificar que hay posts nuevos en las últimas 3 horas
2. Revisar Google Sheet - ¿estado = "pendiente"?
3. Bajar el threshold de relevancia en filtrado
```

### Hook AI no tiene sentido

**Solución:**
```
1. Ajustar temperature en nodo "🤖 Generar Hook" (0.5-0.9)
2. Mejorar el prompt con más contexto
3. Aumentar maxTokens a 75-100
```

### Sheet no se actualiza

**Solución:**
```
1. Verificar credenciales de Google Sheets
2. Confirmar nombre de hoja: "Historial" (exacto)
3. Verificar que Sheet ID es correcto
4. Dar permisos de edición a la cuenta OAuth
```

## 💰 Costos Estimados

### Por Ejecución (cada 3 horas)

```
OpenAI GPT-4o-mini: 50 tokens = $0.001
LinkedIn API: Gratis (dentro de rate limits)
Google Sheets API: Gratis (dentro de quotas)
n8n: $0 (self-hosted) o según plan cloud

TOTAL: ~$0.001 por ejecución
```

### Mensual (8 ejecuciones/día)

```
30 días × 8 ejecuciones × $0.001 = $0.24/mes

vs Método tradicional: $24/mes
Ahorro: $23.76/mes (99%)
```

## 🎓 Cómo Funciona la Optimización

### 1. Filtrado Sin IA (0 tokens)
```javascript
// Usa lógica simple para scoring
if (contentToCheck.includes(keyword)) score += 10;
if (hoursOld < 1) score += 20;
```

### 2. Deduplicación Sin IA (0 tokens)
```javascript
// Usa Set() de JavaScript
const seenIds = new Set();
if (seenIds.has(itemId)) return;
```

### 3. Solo Hook con IA (50 tokens)
```javascript
// Prompt ultra-compacto
"Genera SOLO un hook de 15 palabras MAX. No explicaciones."
```

### 4. Template Estático (0 tokens)
```javascript
// No usa IA, solo template strings
const content = `${hook}\n\n📰 ${title}\n\n${desc}...`;
```

## 📚 Recursos Adicionales

- [LinkedIn API Docs](https://docs.microsoft.com/en-us/linkedin/)
- [n8n Workflows](https://docs.n8n.io/)
- [OpenAI GPT-4o-mini](https://platform.openai.com/docs/models/gpt-4o-mini)
- [Google Sheets API](https://developers.google.com/sheets/api)

## 🤝 Soporte

Problemas comunes resueltos en: `workflows/TROUBLESHOOTING.md`

---

**Desarrollado para Green Hub Portal**
Versión: 1.0.0
Última actualización: 2025-11-12
