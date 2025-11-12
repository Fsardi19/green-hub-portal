# LinkedIn API → n8n (15 minutos)

## Paso 1: Configurar OAuth en n8n

```
1. n8n → Credentials → + New → OAuth2 API
2. Llenar:
   - Name: LinkedIn OAuth2
   - Grant Type: Authorization Code
   - Authorization URL: https://www.linkedin.com/oauth/v2/authorization
   - Access Token URL: https://www.linkedin.com/oauth/v2/accessToken
   - Scope: r_organization_social w_organization_social rw_organization_admin
   - Client ID: [TU CLIENT ID]
   - Client Secret: [TU CLIENT SECRET]
3. Save → Connect my account → Autorizar ✅
```

## Paso 2: Importar Workflow

```
1. n8n → Workflows → New → ... → Import from File
2. Seleccionar: workflows/n8n-linkedin-api-official.json
3. Importar
```

## Paso 3: Configurar Organization ID

Tu página de LinkedIn:
```
https://www.linkedin.com/company/92768394/
                                ^^^^^^^^
                                Este es tu ID
```

En n8n:
```
1. Click en nodo "Get LinkedIn Posts"
2. En la URL, reemplazar YOUR_ORGANIZATION_ID con tu número
3. Quedar así:
   https://api.linkedin.com/v2/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=urn:li:organization:92768394
```

## Paso 4: Probar

```
Execute Workflow → Deberías ver datos de LinkedIn
```

## Paso 5: Activar

```
Toggle "Active" → Verde ✅
Se ejecuta cada 12 horas automáticamente
```

---

## Errores Comunes

**"Unauthorized"**
```
Credentials → LinkedIn OAuth2 → Reconnect → Autorizar de nuevo
```

**"Organization not found"**
```
Verificar que el Organization ID sea correcto (solo números)
```

**"Insufficient permissions"**
```
Tu cuenta debe ser Admin de la página de LinkedIn
Verificar en: https://www.linkedin.com/developers/apps
```

---

## Listo

Workflow configurado → Se ejecuta cada 12 horas → Importa posts de LinkedIn automáticamente
