# 🔧 Cambios Realizados y Configuración

## ✅ Problemas Corregidos

### 1. ❌ LinkedIn API usaba URL incorrecta
**Antes:**
```
URL: https://www.linkedin.com/company/92768394
```
**Después:**
```
URL: https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(urn:li:organization:92768394)&count=10&sortBy=LAST_MODIFIED
```
**Por qué:** La primera es una página web HTML, la segunda es el endpoint real de la API.

---

### 2. ❌ Verificación de duplicados no funcionaba
**Antes:**
```javascript
// Solo verificaba si URL estaba vacía
if ($json.url isEmpty) { ... }
```
**Después:**
```javascript
// Ahora SÍ compara contra historial de Google Sheets
const publishedUrls = new Set();
historial.forEach(row => {
  publishedUrls.add(row.json.url);
});
return posts.filter(p => !publishedUrls.has(p.json.url));
```
**Por qué:** Antes no comparaba contra la base de datos, ahora sí evita duplicados.

---

### 3. ❌ Métricas con referencias incorrectas
**Antes:**
```javascript
processed: $node["RSS Feed Reader"].json.length  // ❌ Este nodo no existe
```
**Después:**
```javascript
processed: $('Combinar Feeds').all().length  // ✅ Correcto
```
**Por qué:** Estaba referenciando un nodo que no existe.

---

### 4. ❌ Faltaba transformación de LinkedIn API
**Antes:**
```
LinkedIn API → directamente a Combinar Feeds
```
**Después:**
```
LinkedIn API → Transformar LinkedIn → Combinar Feeds
```
**Por qué:** La respuesta de LinkedIn API tiene estructura diferente a RSS, necesita transformación.

---

### 5. ⚠️ Person URN sin configurar
**Estado:**
```
person: "urn:li:person:REEMPLAZAR_CON_TU_PERSON_URN"
```
**Necesitas:** Tu Person URN de LinkedIn (ver instrucciones abajo)

---

## 🚀 Cómo Obtener tu Person URN

### Opción 1: Desde n8n (Más Fácil)

1. En n8n, crea un nodo temporal "HTTP Request"
2. Configura:
   ```
   Authentication: LinkedIn OAuth2 (tu credencial)
   Method: GET
   URL: https://api.linkedin.com/v2/me
   ```
3. Ejecuta el nodo
4. En la respuesta verás:
   ```json
   {
     "id": "ABC123XYZ"
   }
   ```
5. Tu Person URN es: `urn:li:person:ABC123XYZ`

### Opción 2: Desde LinkedIn Developers

1. Ve a: https://www.linkedin.com/developers/
2. Abre la consola de tu navegador (F12)
3. En Console escribe:
   ```javascript
   fetch('https://api.linkedin.com/v2/me', {
     headers: { 'Authorization': 'Bearer TU_ACCESS_TOKEN' }
   }).then(r => r.json()).then(console.log)
   ```
4. Copia el `id` de la respuesta

### Opción 3: Usar Organization en lugar de Person

Si quieres publicar como empresa (no como persona):

En el nodo "📤 Publicar LinkedIn", cambiar de:
```json
{
  "person": {
    "value": "urn:li:person:ABC123"
  }
}
```

A:
```json
{
  "organization": {
    "value": "urn:li:organization:92768394"
  }
}
```

**Nota:** Verifica que el nodo de LinkedIn de n8n soporte `organization`. Si no, usa HTTP Request.

---

## 📝 Pasos para Importar y Configurar

### 1. Importar Workflow
```
n8n → Workflows → New → ... → Import from File
→ Selecciona: workflows/linkedin-auto-publisher-FIXED.json
```

### 2. Configurar Person URN

**Buscar en el workflow:**
```
Nodo: "📤 Publicar LinkedIn"
Campo: person.value
Cambiar: "urn:li:person:REEMPLAZAR_CON_TU_PERSON_URN"
Por: "urn:li:person:TU_ID_REAL"
```

### 3. Verificar Credenciales

Todos los nodos deben tener estas credenciales ya configuradas:
- ✅ LinkedIn OAuth2: `iiEjaKHlMEC73APq`
- ✅ Google Sheets: `Uju33mfMH1AoSojL`
- ✅ OpenAI: `UnprA8703Is7HbnG`

### 4. Verificar Google Sheet

Tu Sheet debe tener estas columnas (primera fila):
```
url | postId | timestamp | source | estado | tokensUsed
```

Si no las tiene, agrégalas manualmente.

### 5. Test Manual

1. Desactiva el Schedule Trigger temporalmente
2. Agrega un nodo "Manual Trigger" al inicio
3. Conecta: Manual Trigger → todos los feeds (TechCrunch, Hacker News, LinkedIn API)
4. Click "Execute Workflow"
5. Revisa cada nodo para ver si hay errores

### 6. Verificar Resultados

Después de ejecutar, verifica:
- ✅ Nodo "🔧 Filtrar y Puntuar": ¿Cuántos posts filtró?
- ✅ Nodo "🔍 Verificar Duplicados": ¿Cuántos son nuevos?
- ✅ Nodo "🤖 Generar Hook": ¿El texto tiene sentido?
- ✅ Google Sheet: ¿Se agregó una fila nueva?
- ✅ LinkedIn: ¿Se publicó el post?

---

## 🔍 Estructura del Google Sheet

### Columnas Requeridas:

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| url | URL del post original | `https://techcrunch.com/2025/...` |
| postId | ID único del post | Mismo que url |
| timestamp | Fecha/hora de publicación | `2025-11-12T15:30:00Z` |
| source | Origen del contenido | `TechCrunch`, `LinkedIn` |
| estado | Estado del post | `publicado` |
| tokensUsed | Tokens gastados | `40` |

### Ejemplo de Datos:

```
url | postId | timestamp | source | estado | tokensUsed
https://techcrunch.com/2025/... | https://techcrunch.com/2025/... | 2025-11-12T15:30:00Z | TechCrunch | publicado | 40
```

---

## 🧪 Testing Específico de LinkedIn API

Para probar SOLO el endpoint de LinkedIn:

1. Crea workflow temporal con:
   ```
   Manual Trigger → LinkedIn API (CORREGIDO) → Transformar LinkedIn
   ```

2. Ejecuta

3. Deberías ver en "Transformar LinkedIn":
   ```json
   [
     {
       "title": "LinkedIn Post...",
       "description": "Contenido del post...",
       "link": "https://www.linkedin.com/feed/update/...",
       "source": "LinkedIn"
     }
   ]
   ```

4. Si ves error `401 Unauthorized`:
   - Reconecta credencial LinkedIn OAuth2
   - Verifica scopes: `r_liteprofile`, `r_emailaddress`, `w_member_social`

5. Si ves error `403 Forbidden`:
   - Tu cuenta no tiene permisos para leer posts de la organización
   - Verifica que eres Admin de la página

---

## ⚠️ Errores Comunes y Soluciones

### Error: "Cannot read property 'json' of undefined"
**Causa:** Un nodo anterior no devolvió datos
**Solución:** Ejecuta nodo por nodo para encontrar dónde se rompe

### Error: "Unquoted attribute value" (el error original)
**Causa:** Estaba llamando a URL web en lugar de API
**Solución:** ✅ YA CORREGIDO en el nuevo workflow

### Error: "Organization not found"
**Causa:** Organization ID incorrecto
**Solución:** Verifica que `92768394` sea correcto en tu caso

### Error: "Person URN invalid"
**Causa:** No cambiaste el placeholder
**Solución:** Sigue los pasos arriba para obtener tu Person URN real

### LinkedIn API devuelve vacío
**Causa:** No hay posts recientes O no tienes permisos
**Solución:**
1. Verifica que la página tenga posts recientes
2. Cambia `count=10` a `count=50`
3. Prueba sin `sortBy=LAST_MODIFIED`

---

## 📊 Diferencias Clave del Workflow Corregido

### Flujo Anterior (con problemas):
```
Trigger → LinkedIn WEB (❌) → Combinar → Filtrar → Check Vacío (❌) → ...
```

### Flujo Nuevo (corregido):
```
Trigger → LinkedIn API (✅) → Transformar (✅) → Combinar → Filtrar →
         Leer Historial → Verificar Duplicados (✅) → ...
```

### Cambios Principales:

1. **Nuevo nodo:** "🔄 Transformar LinkedIn" - Convierte respuesta API
2. **Nodo mejorado:** "🔍 Verificar Duplicados" - Ahora SÍ funciona
3. **URL correcta:** LinkedIn API v2 endpoint
4. **Métricas corregidas:** Referencias a nodos correctas
5. **Historial mejorado:** Guarda campos correctos

---

## 🎯 Próximos Pasos

1. ✅ Importar `linkedin-auto-publisher-FIXED.json`
2. ✅ Obtener tu Person URN
3. ✅ Configurar Person URN en nodo "Publicar LinkedIn"
4. ✅ Verificar Google Sheet tenga columnas correctas
5. ✅ Test manual del workflow completo
6. ✅ Verificar que se publique en LinkedIn
7. ✅ Activar Schedule Trigger (cada 3 horas)
8. ✅ Monitorear primeras 24 horas

---

## 💡 Tips Adicionales

### Personalizar Keywords
En nodo "🔧 Filtrar y Puntuar", línea 11-15:
```javascript
const KEYWORDS = [
  'ai', 'inteligencia artificial',  // ← Cambia estos
  'startup', 'innovación',           // ← Por los de tu
  'green tech', 'sostenible'         // ← Industria
];
```

### Cambiar Frecuencia
En nodo "⏰ Ejecutar cada 3 horas":
```javascript
hoursInterval: 3  // Cambia a 6, 12, 24...
```

### Ajustar Cantidad de Posts
En nodo "🔧 Filtrar y Puntuar":
```javascript
const MAX_POSTS = 5;  // Cambia a 3, 10, etc.
```

### Template del Post
En nodo "🏗️ Construir Post", línea 7-15:
```javascript
const linkedInPost = `${emoji} ${hook}

${mainPost.title}        // ← Personaliza
                         // ← este
${mainPost.description}  // ← template
...
`;
```

---

¿Necesitas ayuda con algún paso específico? Cualquier error que veas, cópialo completo y te ayudo a resolverlo.
