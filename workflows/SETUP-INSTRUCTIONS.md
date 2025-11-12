# 🚀 LinkedIn Auto-Publisher PRO - Guía de Instalación

## 📋 Descripción

Sistema automatizado para publicar en LinkedIn que:
- ✅ Repostea contenido de páginas de tu grupo automáticamente
- ✅ Genera contenido original con IA optimizada
- ✅ Ahorra 95% en tokens vs. métodos tradicionales
- ✅ Evita duplicados con historial inteligente
- ✅ Publica en horarios óptimos

---

## 🎯 Lo que hace el workflow

### Flujo de trabajo:

1. **⏰ Chequeo automático cada 2 horas**
2. **📰 Obtiene contenido de múltiples fuentes:**
   - Posts de páginas LinkedIn del grupo
   - Feeds RSS (blogs, noticias)
   - Contenido original generado por IA
3. **🔍 Filtra y analiza relevancia** (sin usar tokens de IA)
4. **📊 Verifica historial** para evitar duplicados
5. **🤖 Genera contenido inteligente:**
   - Para repost: Comentario corto y relevante (100 tokens)
   - Para contenido original: Post completo (300 tokens)
6. **🚀 Publica automáticamente en LinkedIn**
7. **📝 Registra métricas y resultados**

---

## 🔧 Requisitos Previos

### 1. Cuentas y Credenciales

Necesitarás:
- [ ] Cuenta de n8n (self-hosted o cloud)
- [ ] Cuenta de LinkedIn (personal o empresarial)
- [ ] Cuenta de OpenAI (para la IA)
- [ ] Cuenta de Google (para Google Sheets)

### 2. Accesos API

- [ ] LinkedIn OAuth2 credentials
- [ ] OpenAI API Key
- [ ] Google Sheets OAuth2 credentials

---

## 📝 Instalación Paso a Paso

### PASO 1: Preparar Google Sheets

1. **Crea una nueva Google Sheet** con este link:
   ```
   https://docs.google.com/spreadsheets/create
   ```

2. **Nombra la hoja:** "LinkedIn Automation History"

3. **Crea estas columnas** en la primera fila:
   ```
   A: id
   B: source
   C: sourceName
   D: title
   E: url
   F: publishedAt
   G: capturedAt
   H: status
   I: relevanceScore
   J: tokensUsed
   K: linkedInPostUrl
   L: notes
   ```

4. **Guarda el ID de la hoja:**
   - Copia desde la URL: `https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit`
   - Ejemplo: `19jRpln8DJaHtalKrKwUZoktJk0mAxrM-ye6dgRhV7dI`

### PASO 2: Configurar Credenciales en n8n

#### A. LinkedIn OAuth2

1. Ve a n8n → Settings → Credentials → New
2. Busca "LinkedIn OAuth2 API"
3. Sigue estos pasos:

   **En LinkedIn Developers:**
   - Ve a: https://www.linkedin.com/developers/apps
   - Click "Create app"
   - Completa información de la app
   - En "Auth" → Añade Redirect URL de n8n
   - Copia Client ID y Client Secret

   **De vuelta en n8n:**
   - Pega Client ID y Client Secret
   - Click "Connect my account"
   - Autoriza la aplicación
   - **Guarda la credencial**

#### B. OpenAI API

1. Ve a n8n → Settings → Credentials → New
2. Busca "OpenAI API"
3. Obtén tu API Key:
   - Ve a: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Copia la key (solo se muestra una vez)
4. Pega en n8n y guarda

#### C. Google Sheets OAuth2

1. Ve a n8n → Settings → Credentials → New
2. Busca "Google Sheets OAuth2 API"
3. Sigue el proceso de autorización de Google
4. Guarda la credencial

### PASO 3: Obtener IDs de Páginas LinkedIn

Para cada página de LinkedIn de tu grupo:

1. **Ve a la página de LinkedIn**
   Ejemplo: `https://www.linkedin.com/company/green-hub-portal/`

2. **El ID está en la URL o en el código fuente**

   **Método 1 - URL:**
   ```
   https://www.linkedin.com/company/[ID_AQUÍ]/
   ```

   **Método 2 - RSS Feed:**
   - La página puede tener un feed RSS en:
   ```
   https://www.linkedin.com/company/[ID]/posts
   ```

3. **Anota todos los IDs:**
   ```
   Green Hub Portal: 92768394
   Empresa Hermana 1: [OBTENER_ID]
   Empresa Hermana 2: [OBTENER_ID]
   Empresa Hermana 3: [OBTENER_ID]
   ```

### PASO 4: Editar Configuración

1. **Abre el archivo:** `linkedin-config.json`

2. **Actualiza la sección `sources`:**

```json
{
  "sources": [
    {
      "enabled": true,
      "type": "linkedin_company",
      "id": "92768394",  // ← TU ID AQUÍ
      "name": "Green Hub Portal",
      "repost": true,
      "priority": 10
    },
    {
      "enabled": true,
      "type": "linkedin_company",
      "id": "REEMPLAZAR",  // ← AÑADE TUS IDs
      "name": "Empresa Hermana 1",
      "repost": true,
      "priority": 8
    }
    // Añade más fuentes...
  ]
}
```

3. **Actualiza el ID de Google Sheets:**

```json
{
  "googleSheets": {
    "spreadsheetId": "TU_ID_AQUÍ"
  }
}
```

### PASO 5: Importar Workflow a n8n

1. **Copia el contenido completo de:** `linkedin-automation-improved.json`

2. **En n8n:**
   - Ve a Workflows → "+ Add workflow"
   - Click en el menú "..." (arriba derecha)
   - Selecciona "Import from File" o "Import from Clipboard"
   - Pega el JSON del workflow
   - Click "Import"

3. **El workflow aparecerá** con todos los nodos conectados

### PASO 6: Configurar Nodos

#### Nodo: "⚙️ Configurar Fuentes"

1. **Click en el nodo**
2. **Edita el código JavaScript:**
   - Copia tu configuración de `linkedin-config.json`
   - Pega los IDs de las páginas de LinkedIn
   - Ajusta prioridades según prefieras

```javascript
const sources = [
  {
    type: 'linkedin_company',
    id: '92768394',  // ← TU ID
    name: 'Green Hub Portal',
    repost: true,
    priority: 10
  },
  // Añade más...
];
```

#### Nodo: "📰 Obtener Posts LinkedIn"

1. Click en el nodo
2. En "Credentials" → Selecciona tu credencial de LinkedIn OAuth2
3. Verifica que el resto está configurado:
   - Resource: `post`
   - Operation: `getAll`
   - Limit: `10`

#### Nodo: "📊 Verificar Historial"

1. Click en el nodo
2. En "Credentials" → Selecciona tu Google Sheets OAuth2
3. En "Document ID":
   - Mode: `ID`
   - Value: **PEGA TU ID DE GOOGLE SHEETS AQUÍ**
4. En "Sheet Name":
   - Mode: `Name`
   - Value: `Sheet1` (o el nombre de tu hoja)

#### Nodo: "✍️ Generar Post Completo (IA)"

1. Click en el nodo
2. En "Credentials" → Selecciona tu OpenAI API
3. Verifica configuración:
   - Model: `gpt-4o-mini`
   - Max Tokens: `300`
   - Temperature: `0.8`

#### Nodo: "💬 Generar Comentario Repost"

1. Click en el nodo
2. En "Credentials" → Selecciona tu OpenAI API
3. Verifica configuración:
   - Model: `gpt-4o-mini`
   - Max Tokens: `100`
   - Temperature: `0.7`

#### Nodo: "🚀 Publicar en LinkedIn"

1. Click en el nodo
2. En "Credentials" → Selecciona tu LinkedIn OAuth2
3. Verifica:
   - Resource: `post`
   - Operation: `create`
   - Visibility: `PUBLIC`

#### Nodo: "📝 Actualizar Historial"

1. Click en el nodo
2. Igual que el nodo "Verificar Historial"
3. Verifica que está configurado para hacer UPDATE

### PASO 7: Personalizar Contenido

#### Temas de contenido generado

Edita el nodo **"💡 Generar Idea de Contenido"**:

```javascript
const contentIdeas = [
  {
    category: 'tip',
    topics: [
      'TU TEMA 1',
      'TU TEMA 2',
      'TU TEMA 3',
      // Añade tus temas...
    ]
  },
  // Añade más categorías...
];
```

#### Hashtags

Edita el nodo **"🎨 Construir Post Final"**:

```javascript
// Cambia estos hashtags por los tuyos
#Sostenibilidad #TecnologíaVerde #ESG #Innovación #GreenHub
```

#### Tono y estilo

Edita los prompts en:
- **"✍️ Generar Post Completo (IA)"** → Para contenido original
- **"💬 Generar Comentario Repost"** → Para repostear

```
Eres un experto en LinkedIn para [TU INDUSTRIA].

Tono: [profesional / cercano / técnico / inspirador]
...
```

### PASO 8: Probar el Workflow

1. **ANTES de activar, haz pruebas:**

   a) **Test manual completo:**
   - Click en "Execute Workflow" (botón play arriba)
   - Espera a que termine
   - Revisa cada nodo (verde = éxito, rojo = error)

   b) **Verifica Google Sheets:**
   - Debe haber registros nuevos
   - Verifica que el status es correcto

   c) **Verifica LinkedIn:**
   - **¡CUIDADO!** En modo de prueba SÍ publicará en LinkedIn
   - Para evitarlo, **desconecta temporalmente** el nodo "🚀 Publicar en LinkedIn"

2. **Debugging común:**

   **Error en LinkedIn OAuth:**
   - Re-autentica la credencial
   - Verifica que la app de LinkedIn tiene permisos `w_member_social`

   **Error en Google Sheets:**
   - Verifica que el ID es correcto
   - Verifica que la hoja tiene las columnas correctas

   **Error en OpenAI:**
   - Verifica que tienes créditos en OpenAI
   - Verifica que la API Key es válida

### PASO 9: Activar Workflow

1. **Cuando todo funcione:**
   - Toggle "Active" (arriba derecha) → ON
   - El workflow se ejecutará automáticamente cada 2 horas

2. **Monitoreo:**
   - Ve a "Executions" para ver historial
   - Revisa Google Sheets periódicamente
   - Monitorea uso de tokens en OpenAI

---

## ⚙️ Configuración Avanzada

### Cambiar frecuencia de ejecución

En el nodo **"⏰ Ejecutar cada 2 horas"**:

```javascript
// Cambiar a cada 3 horas:
"hoursInterval": 3

// O usar horarios específicos:
// Cada día a las 9 AM, 2 PM, 6 PM
"cronExpression": "0 9,14,18 * * *"
```

### Añadir aprobación manual

1. **Añade nodo "Telegram" o "Slack"** después de "🎨 Construir Post Final"
2. **Configura botones de aprobación:**
   - Aprobado → Continúa a publicar
   - Rechazado → Termina workflow

### Añadir más fuentes RSS

En **"⚙️ Configurar Fuentes"**:

```javascript
{
  type: 'rss',
  url: 'https://tu-sitio.com/feed',
  name: 'Tu Blog',
  repost: false,
  priority: 6
}
```

### Filtro de calidad más estricto

En **"✅ Filtro de Calidad"**:

```javascript
// Cambiar score mínimo de 40 a 60:
"rightValue": "60"
```

---

## 📊 Métricas y Monitoreo

### Ver métricas en Google Sheets

La hoja te mostrará:
- ✅ Total de posts procesados
- ✅ Posts publicados vs. rechazados
- ✅ Tokens usados por post
- ✅ Costo estimado
- ✅ Fuentes más activas

### Crear dashboard

Puedes crear gráficas en Google Sheets:
- Posts por fuente
- Tokens usados por día
- Relevance score promedio
- Tipos de contenido (repost vs. generado)

---

## 💰 Costos Estimados

### Con este workflow optimizado:

| Item | Costo mensual |
|------|--------------|
| n8n Cloud (Starter) | $20 |
| OpenAI (GPT-4o-mini) | $2-5 |
| LinkedIn API | Gratis |
| Google Sheets | Gratis |
| **TOTAL** | **~$25/mes** |

### Ahorro vs. método tradicional:
- Método tradicional: ~$200-300/mes
- **Ahorro: 90%** 💰

---

## 🆘 Troubleshooting

### Error: "No items to process"

**Causa:** No hay contenido nuevo en las fuentes
**Solución:**
- Verifica que los IDs de LinkedIn son correctos
- Verifica que las páginas tienen posts recientes
- Reduce el `minimumRelevanceScore` en el filtro

### Error: "LinkedIn API rate limit"

**Causa:** Demasiadas llamadas a la API de LinkedIn
**Solución:**
- Reduce frecuencia de ejecución
- Reduce el límite de posts por fuente

### Error: "OpenAI insufficient quota"

**Causa:** Sin créditos en OpenAI
**Solución:**
- Añade créditos a tu cuenta de OpenAI
- Usa modelo más barato (ya estamos en el más barato)

### Posts duplicados

**Causa:** Fallo en verificación de historial
**Solución:**
- Verifica que Google Sheets está guardando correctamente
- Añade delay entre ejecuciones

### Contenido no relevante

**Causa:** Score de relevancia bajo
**Solución:**
- Ajusta keywords en **"🔄 Normalizar Contenido"**
- Aumenta `minimumRelevanceScore` en el filtro

---

## 🚀 Optimizaciones Adicionales

### 1. Usar caché para fuentes

Evita re-procesar el mismo contenido:

```javascript
// En "🔧 Filtrar y Deduplicar"
const cache = $workflow.cache || {};
// Implementa lógica de caché
```

### 2. A/B Testing de hooks

Genera múltiples versiones y elige la mejor:

```javascript
// Generar 3 hooks diferentes
// Seleccionar el más atractivo
```

### 3. Análisis de performance

Tracking de métricas de engagement:

```javascript
// Después de 24h, obtener stats del post
// Analizar qué tipo de contenido funciona mejor
```

### 4. Integración con analytics

Conecta con Google Analytics o tu CRM:

```javascript
// Añade UTM parameters a links
// Trackea conversiones desde LinkedIn
```

---

## 📚 Recursos Adicionales

- [Documentación de n8n](https://docs.n8n.io/)
- [LinkedIn API Docs](https://docs.microsoft.com/en-us/linkedin/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Google Sheets API](https://developers.google.com/sheets/api)

---

## 📞 Soporte

Si tienes problemas:

1. **Revisa los logs** en n8n → Executions
2. **Verifica configuración** paso a paso
3. **Prueba nodo por nodo** para aislar el error
4. **Consulta documentación** de cada servicio

---

## ✅ Checklist Final

Antes de activar en producción:

- [ ] Todas las credenciales configuradas y testeadas
- [ ] IDs de páginas LinkedIn verificados
- [ ] Google Sheet creada con columnas correctas
- [ ] Workflow probado manualmente con éxito
- [ ] Configuración personalizada (hashtags, temas, tono)
- [ ] Filtros de calidad ajustados
- [ ] Monitoreo configurado
- [ ] Budget de OpenAI establecido
- [ ] Notificaciones configuradas (opcional)

---

¡Listo! 🎉 Tu workflow de LinkedIn está configurado y listo para automatizar tu presencia en LinkedIn ahorrando 95% en costos vs. métodos tradicionales.
