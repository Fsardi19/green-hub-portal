# ⚡ Inicio Rápido - 5 Minutos

Configuración express para empezar a automatizar LinkedIn **ahora mismo**.

---

## ✅ Pre-requisitos (tenlos a mano)

- [ ] Cuenta de **n8n** (cloud o self-hosted)
- [ ] Cuenta de **LinkedIn** con acceso a páginas empresariales
- [ ] **OpenAI API Key** ([Obtener aquí](https://platform.openai.com/api-keys))
- [ ] Cuenta de **Google** para Sheets

---

## 🚀 Setup en 5 pasos

### PASO 1: Crear Google Sheet (1 min)

1. Ve a: https://sheets.new
2. Nombra: "LinkedIn Automation"
3. Primera fila, añade estas columnas:
   ```
   id | source | sourceName | title | url | publishedAt | capturedAt | status | relevanceScore | tokensUsed | linkedInPostUrl | notes
   ```
4. Copia el ID de la URL:
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ID]/edit
   ```

### PASO 2: Obtener IDs de LinkedIn (1 min)

Para cada página de tu grupo:

1. Ve a la página en LinkedIn
2. Busca en la URL: `linkedin.com/company/[ESTE_ES_EL_ID]`
3. Anota los IDs:
   ```
   Mi empresa: 92768394
   Empresa 2: _______
   Empresa 3: _______
   ```

### PASO 3: Importar a n8n (1 min)

1. **Descarga/copia**: `linkedin-automation-improved.json`
2. En n8n: Workflows → ⋮ → Import from File
3. Selecciona el archivo → Import

### PASO 4: Configurar credenciales (2 min)

En n8n, configura 3 credenciales:

**A. LinkedIn OAuth2**
```
Settings → Credentials → New → LinkedIn OAuth2
→ Sigue el wizard de autorización
→ Save
```

**B. OpenAI API**
```
Settings → Credentials → New → OpenAI
→ Pega tu API Key
→ Save
```

**C. Google Sheets OAuth2**
```
Settings → Credentials → New → Google Sheets OAuth2
→ Autoriza con Google
→ Save
```

### PASO 5: Editar el workflow (<1 min)

En el workflow importado:

**Nodo "⚙️ Configurar Fuentes"** → Edit:
```javascript
// Línea ~8: Cambia estos IDs
{
  type: 'linkedin_company',
  id: '92768394',  // ← PEGA TU ID AQUÍ
  name: 'Tu Empresa',
  repost: true,
  priority: 10
}
```

**Nodo "📊 Verificar Historial"** → Edit:
```
Document ID: PEGA_TU_GOOGLE_SHEET_ID
```

**Nodo "📝 Actualizar Historial"** → Edit:
```
Document ID: MISMO_GOOGLE_SHEET_ID
```

---

## 🧪 Prueba (antes de activar)

1. **No actives todavía** (toggle OFF)
2. Click **"Execute Workflow"** (botón play)
3. Espera ~30 segundos
4. **Verifica**:
   - ✅ Todos los nodos en verde
   - ✅ Google Sheet tiene nuevos registros
   - ✅ (Opcional) Desconecta nodo "Publicar en LinkedIn" para no publicar en pruebas

---

## ✨ Activa

Si la prueba fue exitosa:

1. **Toggle "Active"** → ON (arriba derecha)
2. **¡Listo!** Se ejecutará automáticamente cada 2 horas

---

## 📊 Monitorea

- **Executions**: Ver historial de ejecuciones
- **Google Sheet**: Ver contenido procesado
- **LinkedIn**: Ver posts publicados

---

## 🎨 Personaliza (opcional)

### Cambiar hashtags

Nodo **"🎨 Construir Post Final"** → Edit:
```javascript
// Busca la línea con hashtags y cámbialos
#TusHashtags #Personalizados
```

### Cambiar frecuencia

Nodo **"⏰ Ejecutar cada 2 horas"** → Edit:
```
Hours Interval: 3  // Cada 3 horas
```

### Añadir más fuentes

Nodo **"⚙️ Configurar Fuentes"** → Edit:
```javascript
// Añade más objetos al array
{
  type: 'linkedin_company',
  id: 'OTRO_ID',
  name: 'Otra Empresa',
  repost: true,
  priority: 8
}
```

---

## 🆘 ¿Problemas?

### Error en nodo rojo
→ Click en el nodo → Ve el error
→ Usualmente es credencial no configurada

### No encuentra contenido
→ Verifica IDs de LinkedIn son correctos
→ Verifica que las páginas tienen posts recientes

### No publica
→ Verifica credencial de LinkedIn
→ Verifica que tienes permisos de publicación

---

## 📚 Documentación completa

Para configuración avanzada, ver: **`SETUP-INSTRUCTIONS.md`**

---

## ✅ Checklist Final

Antes de activar:

- [ ] Google Sheet creada con columnas correctas
- [ ] IDs de LinkedIn obtenidos
- [ ] Workflow importado a n8n
- [ ] 3 credenciales configuradas
- [ ] IDs actualizados en nodos
- [ ] Prueba manual exitosa
- [ ] Hashtags personalizados

---

**¡Todo listo!** 🎉

Tu LinkedIn ahora se gestiona automáticamente.

**Próximo paso:** Revisa en 24h y ajusta según resultados.

---

_Setup completado en ~5 minutos | Ahorra 95% en costos | Publica 10x más_
