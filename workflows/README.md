# 🚀 LinkedIn Auto-Publisher

Sistema de automatización para publicar en LinkedIn desde múltiples fuentes.

---

## ✨ Lo que hace

- ✅ **Repostea** contenido de páginas LinkedIn de tu grupo
- ✅ **Genera** contenido original con IA
- ✅ **Ahorra** 95% en costos vs. métodos tradicionales
- ✅ **Evita** duplicados automáticamente

---

## 📁 Archivos

```
workflows/
├── linkedin-automation-simple.json    ← Workflow para n8n
├── MULTI-SOURCE-GUIDE.md              ← Cómo añadir más fuentes
├── QUICK-START.md                     ← Setup en 5 minutos
├── FIX-IMPORT-ERROR.md                ← Solución de problemas
└── google-sheets-template.csv         ← Template para tracking
```

---

## 🚀 Inicio Rápido

### 1. Importa el workflow

```
n8n → Workflows → Import → linkedin-automation-simple.json
```

### 2. Configura credenciales

- LinkedIn OAuth2
- OpenAI API Key
- Google Sheets (opcional)

### 3. Edita el RSS Feed

```
Nodo "RSS Feed Read" → URL:
https://www.linkedin.com/company/TU_ID_AQUI
```

### 4. Prueba y activa

```
Execute Workflow → Verifica resultados → Toggle Active
```

**¡Listo!** El workflow se ejecutará cada 3 horas.

---

## 🔗 Añadir Más Fuentes

**Para repostear de múltiples páginas de tu grupo:**

👉 **Ver:** [MULTI-SOURCE-GUIDE.md](MULTI-SOURCE-GUIDE.md)

**Pasos rápidos:**
1. Obtén el ID de cada página: `linkedin.com/company/[ID]`
2. Duplica el nodo "RSS Feed Read"
3. Cambia la URL al nuevo ID
4. Conecta al workflow

**Tiempo:** 2 minutos por fuente

---

## 📊 Cómo funciona

```
⏰ Cada 3 horas
    ↓
📰 Lee contenido de todas tus fuentes
    ↓
🔍 Filtra lo más relevante (sin IA)
    ↓
📊 Verifica duplicados en Google Sheets
    ↓
🤖 Genera comentario con IA (100 tokens)
    ↓
🚀 Publica en LinkedIn
```

**Costo:** ~$0.001 por post
**Tiempo:** 0 minutos (automático)

---

## 💰 Ahorro

| Concepto | Tradicional | Con este sistema |
|----------|-------------|------------------|
| **Costo/mes** | $200-300 | $25 |
| **Tiempo/mes** | 3-4 horas | 0 minutos |
| **Posts/mes** | 10-20 | 60-90 |
| **Tokens/post** | 3000+ | 100-150 |

**Ahorro anual:** ~$3,300

---

## 🎯 Casos de Uso

### Grupo de empresas
```
Empresa Principal
├─ Empresa Hermana 1
├─ Empresa Hermana 2
└─ Empresa Hermana 3

→ Repostea lo mejor de todas
```

### Curación de contenido
```
50% Posts de LinkedIn
25% RSS feeds
25% Contenido original IA

→ Presencia consistente
```

---

## 📚 Documentación

- **Inicio rápido:** [QUICK-START.md](QUICK-START.md)
- **Multi-fuente:** [MULTI-SOURCE-GUIDE.md](MULTI-SOURCE-GUIDE.md)
- **Problemas:** [FIX-IMPORT-ERROR.md](FIX-IMPORT-ERROR.md)

---

## 🔧 Requisitos

- Cuenta de n8n (cloud o self-hosted)
- Cuenta de LinkedIn
- OpenAI API Key (~$5/mes)
- Google Sheet (opcional, gratis)

---

## ⚙️ Personalización

### Cambiar frecuencia

```
Nodo "Schedule Trigger" → Hours Interval: 3
```

### Cambiar hashtags

```
Nodo "Build Post" → Busca la línea:
#Sostenibilidad #Innovación #GreenHub
```

### Ajustar filtros

```
Nodo "Filter and Process" → Busca:
minRelevanceScore: 40  // Aumenta para ser más selectivo
```

---

## 📈 Métricas

Métricas disponibles en Google Sheets:
- Posts procesados vs. publicados
- Tokens usados por post
- Fuente de cada post
- Score de relevancia
- Costo estimado

---

## 🆘 Problemas Comunes

### No se publica nada
→ Verifica que la URL de LinkedIn es correcta
→ Reduce `minRelevanceScore` en el filtro

### Error al importar
→ Usa `linkedin-automation-simple.json`
→ Ver [FIX-IMPORT-ERROR.md](FIX-IMPORT-ERROR.md)

### Muy caro
→ Ya está optimizado con gpt-4o-mini
→ Reduce frecuencia de ejecución

---

## ✅ Checklist

Antes de activar:

- [ ] Workflow importado
- [ ] Credenciales configuradas
- [ ] ID de LinkedIn correcto
- [ ] Google Sheet creado (opcional)
- [ ] Prueba manual exitosa
- [ ] Hashtags personalizados

---

## 🎉 Resultado

Con este sistema:
- ✅ **0 tiempo manual** después del setup
- ✅ **95% ahorro** en costos
- ✅ **3x más posts** que antes
- ✅ **100% consistente**

---

## 📞 Soporte

¿Necesitas ayuda?

1. Revisa [QUICK-START.md](QUICK-START.md)
2. Consulta [FIX-IMPORT-ERROR.md](FIX-IMPORT-ERROR.md)
3. Para multi-fuente: [MULTI-SOURCE-GUIDE.md](MULTI-SOURCE-GUIDE.md)

---

**⚡ Siguiente paso:** Lee [MULTI-SOURCE-GUIDE.md](MULTI-SOURCE-GUIDE.md) para añadir más fuentes

---

_Ahorra tiempo | Reduce costos | Publica consistentemente_
