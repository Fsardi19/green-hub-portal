# Guía Simple: LinkedIn API en n8n

Ya tienes las credenciales de LinkedIn API. Ahora sigue estos pasos:

## Paso 1: Configurar OAuth en n8n (5 minutos)

### 1.1 Ir a Credenciales en n8n

1. Abre n8n
2. Click en el menú lateral → **"Credentials"** (Credenciales)
3. Click en **"+ New"** (Nueva)
4. Busca y selecciona **"OAuth2 API"**

### 1.2 Llenar los datos de LinkedIn

Copia estos valores EXACTAMENTE:

```
Name: LinkedIn OAuth2

Grant Type: Authorization Code

Authorization URL: https://www.linkedin.com/oauth/v2/authorization

Access Token URL: https://www.linkedin.com/oauth/v2/accessToken

Scope: r_organization_social w_organization_social rw_organization_admin r_1st_connections_size

Auth URI Query Parameters:
  - Name: response_type
  - Value: code

Authentication: Header

Client ID: [TU CLIENT ID DE LINKEDIN]

Client Secret: [TU CLIENT SECRET DE LINKEDIN]
```

### 1.3 Guardar y Conectar

1. Click **"Save"** (Guardar)
2. Click **"Connect my account"** (Conectar mi cuenta)
3. Se abrirá una ventana de LinkedIn
4. Acepta los permisos
5. Deberías ver "Connected" ✅

---

## Paso 2: Importar el Workflow (2 minutos)

### 2.1 Importar archivo

1. En n8n, ve a **"Workflows"**
2. Click en **"+ New"**
3. Click en el menú **"..."** (tres puntos arriba a la derecha)
4. Click **"Import from File"**
5. Selecciona: `/workflows/n8n-linkedin-api-official.json`

### 2.2 Configurar el nodo "Get LinkedIn Posts"

En el workflow importado, click en el nodo **"Get LinkedIn Posts"**:

1. En **"Credential for OAuth2 API"** → Selecciona tu credencial de LinkedIn
2. En la URL, reemplaza `YOUR_ORGANIZATION_ID` con tu ID de organización

**¿Cómo encontrar tu Organization ID?**
- Ve a tu página de empresa en LinkedIn
- La URL será: `https://www.linkedin.com/company/92768394/`
- Tu Organization ID es: `92768394`

3. La URL final debe ser:
```
https://api.linkedin.com/v2/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=urn:li:organization:92768394
```

---

## Paso 3: Probar el Workflow (1 minuto)

1. Click en **"Execute Workflow"** (Ejecutar Workflow)
2. Deberías ver datos de LinkedIn en el nodo "Get LinkedIn Posts"
3. Si ves error, revisa el Paso 4 abajo

---

## Paso 4: Solución de Problemas

### Error: "Invalid access token"

**Solución:**
1. Ve a Credentials
2. Encuentra tu credencial de LinkedIn
3. Click en "Reconnect" o "Refresh"
4. Vuelve a autorizar

### Error: "Insufficient permissions"

**Solución:**
Tu aplicación de LinkedIn necesita estos permisos:
- `r_organization_social` (leer publicaciones)
- `w_organization_social` (escribir publicaciones)
- `rw_organization_admin` (administrar organización)

Verifica en: https://www.linkedin.com/developers/apps/

### Error: "Organization not found"

**Solución:**
- Verifica que tu cuenta de LinkedIn sea administrador de la página de empresa
- Confirma que el Organization ID sea correcto
- En la página de LinkedIn, tu cuenta debe tener rol de "Admin" o "Super Admin"

### No aparecen datos

**Solución:**
- Asegúrate de que tu página de empresa tiene publicaciones recientes
- Intenta con `count=5` en lugar de `count=10`
- Verifica que la empresa tenga publicaciones públicas

---

## Paso 5: Automatizar (Opcional)

### Para que se ejecute automáticamente:

1. En el workflow, el nodo "Schedule Every 12 Hours" ya está configurado
2. Click en **"Active"** (toggle arriba a la derecha)
3. El workflow se ejecutará cada 12 horas automáticamente

---

## Alternativa Más Simple: Usar el Nodo de LinkedIn de n8n

Si n8n tiene el nodo oficial de LinkedIn:

1. En lugar de "HTTP Request", busca el nodo **"LinkedIn"**
2. Agrega tus credenciales OAuth
3. Selecciona la operación "Get Company Updates"
4. Mucho más fácil que usar HTTP Request

**Para verificar:**
1. En n8n, busca en los nodos disponibles
2. Escribe "LinkedIn"
3. Si aparece, úsalo en lugar del HTTP Request

---

## Resumen Visual

```
┌─────────────────┐
│  Schedule       │
│  Every 12 Hours │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Get LinkedIn   │ ← Aquí configuras OAuth
│  Posts (API)    │ ← Cambias Organization ID
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Format Data    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Send to Portal │
└─────────────────┘
```

---

## Endpoints Útiles de LinkedIn API

Si quieres obtener diferentes datos:

### Publicaciones de la empresa:
```
GET https://api.linkedin.com/v2/shares?q=owners&owners=urn:li:organization:92768394&count=10
```

### Estadísticas de la empresa:
```
GET https://api.linkedin.com/v2/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=urn:li:organization:92768394
```

### Followers de la empresa:
```
GET https://api.linkedin.com/v2/networkSizes/urn:li:organization:92768394?edgeType=CompanyFollowedByMember
```

---

## ¿Necesitas Ayuda?

Si algo no funciona:

1. **Error de OAuth:** Revisa que Client ID y Secret sean correctos
2. **Error de permisos:** Tu cuenta debe ser admin de la página
3. **No hay datos:** La empresa debe tener publicaciones recientes
4. **Error 429:** Estás haciendo demasiadas peticiones, reduce la frecuencia

---

## Checklist Final

- [ ] Credencial OAuth2 creada en n8n
- [ ] LinkedIn connected (botón verde)
- [ ] Organization ID correcto en la URL
- [ ] Workflow importado
- [ ] Test ejecutado con éxito
- [ ] Datos aparecen en "Format LinkedIn Data"
- [ ] Workflow activado

**¡Listo!** Ahora LinkedIn se sincronizará automáticamente cada 12 horas.
