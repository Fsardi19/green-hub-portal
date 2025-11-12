# 📱 Paso a Paso: LinkedIn API en n8n

## Lo que necesitas tener ANTES de empezar:

✅ Credenciales de LinkedIn API (ya las tienes)
   - Client ID
   - Client Secret

✅ Acceso de administrador a la página de empresa en LinkedIn

✅ n8n instalado y funcionando

---

## 🚀 PASO 1: Agregar Credenciales en n8n

### A. Abrir sección de credenciales

```
1. Abre n8n en tu navegador
2. En el menú de la izquierda, busca el icono de llave 🔑
3. Click en "Credentials" (Credenciales)
4. Click en el botón "+ Add Credential" o "+ New"
```

### B. Buscar OAuth2

```
En el buscador escribe: OAuth2
Selecciona: "OAuth2 API"
```

### C. Llenar el formulario

**IMPORTANTE: Copia EXACTAMENTE estos valores:**

| Campo | Valor |
|-------|-------|
| **Credential Name** | `LinkedIn OAuth2` |
| **Grant Type** | `Authorization Code` |
| **Authorization URL** | `https://www.linkedin.com/oauth/v2/authorization` |
| **Access Token URL** | `https://www.linkedin.com/oauth/v2/accessToken` |
| **Scope** | `r_organization_social w_organization_social rw_organization_admin` |
| **Auth URI Query Parameters** | Click "+ Add Parameter"<br>Name: `response_type`<br>Value: `code` |
| **Authentication** | `Header` |
| **Client ID** | `[PEGA AQUÍ TU CLIENT ID]` |
| **Client Secret** | `[PEGA AQUÍ TU CLIENT SECRET]` |

### D. Conectar con LinkedIn

```
1. Scroll abajo
2. Click en "Save" (Guardar)
3. Aparecerá un botón "Connect my account"
4. Click en ese botón
5. Se abre ventana de LinkedIn
6. Click "Allow" (Permitir)
7. Deberías ver un check verde ✅
```

---

## 🚀 PASO 2: Crear el Workflow

### Opción A: Importar workflow ya listo (MÁS FÁCIL)

```
1. En n8n, click en "Workflows" en el menú
2. Click en "+ Add workflow" o "New"
3. Click en los 3 puntos (⋮) arriba a la derecha
4. Click en "Import from File"
5. Busca el archivo: workflows/n8n-linkedin-api-official.json
6. Click "Import"
```

**Salta al PASO 3 →**

### Opción B: Crear desde cero (si la opción A no funciona)

```
1. Click en "+ Add workflow"
2. Dale un nombre: "LinkedIn to Green Hub"
```

#### B.1 Agregar Schedule Trigger

```
1. Click en "+" para agregar nodo
2. Busca "Schedule Trigger"
3. Configura:
   - Rule: Interval
   - Interval: 12 hours
```

#### B.2 Agregar HTTP Request

```
1. Click en "+" después del Schedule
2. Busca "HTTP Request"
3. Configura:

   Authentication: OAuth2
   Credential: [Selecciona "LinkedIn OAuth2" que creaste]

   Method: GET

   URL: https://api.linkedin.com/v2/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=urn:li:organization:92768394

   (⚠️ Reemplaza 92768394 con tu Organization ID)
```

**¿Cómo encontrar tu Organization ID?**
```
1. Ve a tu página de empresa en LinkedIn
2. Mira la URL: https://www.linkedin.com/company/ESTE_ES_TU_ID/
3. Ese número es tu Organization ID
```

#### B.3 Agregar Code Node

```
1. Click en "+" después del HTTP Request
2. Busca "Code"
3. Pega este código:

const items = [];
const response = $input.first().json;
const elements = response.elements || [];

for (const element of elements) {
  items.push({
    id: Date.now() + items.length,
    title: 'LinkedIn Update',
    content: element.commentary || 'Ver en LinkedIn',
    date: new Date().toISOString().split('T')[0],
    source: 'LinkedIn',
    isNew: true
  });
}

return items;
```

---

## 🚀 PASO 3: Configurar tu Organization ID

### Encontrar tu Organization ID:

```
1. Abre LinkedIn
2. Ve a tu página de empresa
3. La URL será algo como:
   https://www.linkedin.com/company/92768394/

4. El número es tu Organization ID: 92768394
```

### Actualizar en el workflow:

```
1. En n8n, click en el nodo "Get LinkedIn Posts"
2. Busca la URL
3. Reemplaza YOUR_ORGANIZATION_ID o 92768394
4. Con TU número de organización
5. Click "Save"
```

La URL final debe verse así:
```
https://api.linkedin.com/v2/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=urn:li:organization:TU_NUMERO_AQUI
```

---

## 🚀 PASO 4: Probar

### Ejecutar manualmente:

```
1. En el workflow, busca el botón "Execute Workflow"
2. Click en ese botón
3. Espera 5-10 segundos
```

### ¿Qué deberías ver?

```
✅ ÉXITO:
- Nodo "Get LinkedIn Posts" muestra datos en JSON
- Nodo "Format LinkedIn Data" muestra lista de posts
- No hay errores rojos

❌ ERROR:
- Mensaje "Invalid access token" → Ve al Paso 5
- Mensaje "Not authorized" → Ve al Paso 5
- Mensaje "Organization not found" → Verifica Organization ID
```

---

## 🚀 PASO 5: Solucionar Errores Comunes

### Error: "Invalid access token" o "Unauthorized"

**Causa:** OAuth no conectado correctamente

**Solución:**
```
1. Ve a Credentials (icono de llave 🔑)
2. Busca "LinkedIn OAuth2"
3. Click en ella
4. Click en "Reconnect" o el icono de refresh
5. Vuelve a autorizar en LinkedIn
6. Intenta ejecutar el workflow otra vez
```

### Error: "Insufficient privileges"

**Causa:** Tu cuenta no es admin de la página

**Solución:**
```
1. Ve a LinkedIn
2. Entra a tu página de empresa
3. Click en "Admin tools" → "Page admins"
4. Verifica que tu cuenta tenga rol "Admin" o "Super Admin"
5. Si no, pide a alguien que te agregue como admin
```

### Error: "Organization not found"

**Causa:** Organization ID incorrecto

**Solución:**
```
1. Ve a la página de empresa en LinkedIn
2. Copia el número de la URL correctamente
3. Actualiza en el workflow
4. Asegúrate de NO incluir barras / ni otros caracteres
```

### No aparecen datos (pero no hay error)

**Causa:** No hay publicaciones recientes

**Solución:**
```
1. Verifica que la página de empresa tenga posts públicos
2. Intenta cambiar en la URL: count=10 por count=5
3. Prueba con otro endpoint (ver abajo)
```

---

## 🚀 PASO 6: Activar Automatización

### Para que funcione solo:

```
1. En el workflow, busca el toggle "Active" arriba
2. Cambia de OFF (gris) a ON (verde)
3. ¡Listo! Se ejecutará cada 12 horas automáticamente
```

### Para cambiar la frecuencia:

```
1. Click en el nodo "Schedule Trigger"
2. En "Interval Hours", cambia el número:
   - 6 = cada 6 horas
   - 12 = cada 12 horas (recomendado)
   - 24 = una vez al día
```

---

## 📊 Endpoints Alternativos de LinkedIn

Si el endpoint de estadísticas no funciona, prueba estos:

### Ver publicaciones directamente:
```
GET https://api.linkedin.com/v2/shares?q=owners&owners=urn:li:organization:TU_ID&count=10
```

### Ver posts de la empresa (v3):
```
GET https://api.linkedin.com/rest/posts?author=urn:li:organization:TU_ID&count=10
```

---

## ✅ Checklist Final

Marca ✅ cuando completes cada paso:

- [ ] Credencial OAuth2 creada en n8n
- [ ] Conectado con LinkedIn (botón verde)
- [ ] Workflow importado o creado
- [ ] Organization ID correcto en la URL
- [ ] Test manual ejecutado sin errores
- [ ] Datos visibles en el nodo "Format Data"
- [ ] Workflow activado (toggle verde)

---

## 🆘 ¿Aún no funciona?

**Prueba esto:**

1. **Verifica permisos de la app en LinkedIn:**
   - Ve a: https://www.linkedin.com/developers/apps
   - Entra a tu app
   - Tab "Products" → Verifica que tengas "Marketing Developer Platform" o "Share on LinkedIn"

2. **Regenera las credenciales:**
   - En LinkedIn Developers, genera nuevo Client Secret
   - Actualiza en n8n
   - Reconecta

3. **Usa el nodo nativo de LinkedIn (si existe):**
   - En n8n, busca si hay un nodo llamado "LinkedIn"
   - Si existe, úsalo en lugar de HTTP Request
   - Es mucho más fácil

---

## 📸 Resultado Final

Una vez funcionando, cada 12 horas:
1. n8n se conecta a LinkedIn automáticamente
2. Descarga las últimas publicaciones de tu empresa
3. Las formatea para tu portal
4. Las envía a tu Green Hub Portal
5. Aparecen en la sección de noticias

**¡Sin tocar nada!** 🎉
