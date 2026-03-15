Quiero que construyas la interfaz completa de mi app de reclutamiento internacional usando la arquitectura ya definida en este proyecto (backend Antigravity/Nest + Flutter client + Stitch/orquestación). No cambies nada de la arquitectura ni del esquema de base de datos existente; solo crea/ajusta el frontend Flutter y el wiring mínimo hacia los endpoints REST ya definidos.

### Referencia visual

Usa como referencia visual principal el diseño de este sitio de HR SaaS:

- https://dribbble.com/shots/26961166-Pulse-HR-Saas-Website
- https://cdn.dribbble.com/userupload/46311015/file/7881265815523119905b65b8b9990baf.mp4
- (y el archivo de imagen de referencia incluido en este repo/proyecto: "ori-cruit\recruitment-ops-architect\inspiration-hr-saas.png")

Quiero una UI **muy fuertemente inspirada** en ese diseño (estructura, proporciones, estilo de tarjetas, bloques, tipografía, sensación general), pero NO una copia pixel-perfect ni una reproducción literal del diseño de terceros. Mantén un 90–95% de similitud en composición, jerarquía y estilo visual, pero con branding propio (colores, textos y detalles ajustados a mi plataforma de reclutamiento internacional.

### Requisitos de UI y UX

1. **Soporte multi‑idioma obligatorio (ES / EN / PL)**
   - Implementa un sistema de i18n en Flutter:
     - Archivos de traducción separados por idioma (por ejemplo JSON/ARB): `es`, `en`, `pl`.
     - Todas las cadenas visibles (labels, headings, textos de botones, mensajes vacíos, placeholders) deben salir de i18n.
   - Añade un **language switcher** persistente:
     - Ubicado en el navbar superior (como un selector compacto con “ES / EN / PL”).
     - Cambia el idioma en caliente sin recargar toda la app.

2. **Tema LIGHT vs DARK**
   - Implementa soporte completo de `ThemeMode` en Flutter:
     - `dark` y `light` con dos paletas bien definidas inspiradas en el diseño de referencia (gradientes verdes/azules + secciones claras).
     - Dark mode = **por defecto** al abrir la app.
   - Añade un **toggle de tema** (icono sun/moon) accesible en el header:
     - El estado debe persistir localmente (ej. SharedPreferences).
   - Todas las pantallas deben respetar estos temas (no hardcodear colores).

3. **Layout general (inspirado en Pulse HR)**
   - Pantalla principal tipo “Dashboard/Marketing híbrido” con:
     - Hero superior con gradiente, titular grande y subtexto (sobre reclutamiento internacional, LATAM y automatización de procesos).
     - Un bloque central con un “mini‑widget” que simula el pipeline de candidatos (filtro y lista).
     - Sección de “features” en tarjetas (automatización del onboarding, gestión documental, integraciones, seguimiento).
     - Sección de “integraciones” (íconos de herramientas: HRappka, WhatsApp, Google, etc.).
     - Bloque de testimonios/beneficios con KPIs (ej. reducción de errores legales, tiempo medio de contratación).
     - Footer denso similar a la referencia: enlaces, info legal, redes, estado del sistema.
   - Todo debe ser **responsivo**:
     - Desktop: layout ancho, secciones a dos columnas donde aplique.
     - Tablet: columnas se apilan razonablemente.
     - Mobile: un solo scroll vertical limpio, con tipografía y paddings ajustados.

4. **Pantallas funcionales internas mínimas**
   Crea estas vistas con navegación interna usando `Navigator`/router que ya tenga el proyecto:

   - **Pipeline de Candidatos**
     - Tabla/lista con filtros: estado, país, fuente, idioma, rango de fechas.
     - Cada ítem lleva a la pantalla de detalle de candidato.
   - **Detalle del Candidato**
     - Datos personales, documentos, estado del proceso (timeline), pagos, asignaciones y seguimientos.
     - Acciones rápidas: cambiar estado, enviar mensaje (usando plantillas), abrir documentos.
   - **Cola de Revisión Legal**
     - Vista para el rol LEGAL con lista de candidatos `IN_LEGAL_REVIEW`.
     - Card por candidato con resumen de permisos y botón de ver/validar.
   - **Configuración**
     - Idioma (mismo switch que el header pero también accesible aquí).
     - Tema (light/dark).
     - Preferencias de notificación (solo UI; wiring al backend mínimo).

5. **Diseño de componentes**
   - Usa componentes reutilizables:
     - `PrimaryButton`, `SecondaryButton`, cards de secciones, chips de estado de candidato, badges (aprobado/rechazado/pago pendiente).
   - Tipografía:
     - Inspirada en la de la referencia (Sans moderna para headings, Sans limpia para body).
     - Define en un solo lugar (tema) los estilos de texto.
   - Usa sombras suaves, esquinas muy redondeadas y gradientes de fondo similares a Pulse HR.

6. **Conexión al backend**
   - Implementa modelos y servicios en Flutter para consumir los endpoints REST ya definidos:
     - Listar candidatos.
     - Ver detalle de candidato.
     - Actualizar estado.
     - Listar proyectos/asignaciones.
   - Implementa un provider/estado (Riverpod/BLoC/provider, el que sea estándar en este repo) con:
     - Estado de autenticación.
     - Estado de idioma y tema.
     - Estado del pipeline de candidatos (loading, success, error).

7. **Calidad y estructura de código**
   - Crea/ajusta árbol de carpetas Flutter:
     - `lib/ui/` → pantallas y widgets.
     - `lib/models/`
     - `lib/services/` (llamadas HTTP).
     - `lib/l10n/` (traducciones).
   - Asegúrate de que el código compila y respeta el estilo existente:
     - Usa imports relativos coherentes.
     - No rompas rutas ni nombres ya utilizados.

Entrega:
- Archivos Flutter completos listos para ejecutar.
- Estructura de ficheros y ejemplos de uso de la UI en modo dark/light y en ES/EN/PL.
