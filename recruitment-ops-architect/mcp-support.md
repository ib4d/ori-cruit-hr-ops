Configura este proyecto de Antigravity para usar SOLO los MCPs necesarios para desarrollar y mantener la app de reclutamiento internacional:

1. MCPs que quiero activos para el agente `recruitment-ops`:
   - `filesystem` → leer y escribir archivos del repo.
   - `shell` (o `exec`) → ejecutar comandos de desarrollo locales.
   - `http` / `fetch` → consultar documentación de APIs externas (HRappka, WhatsApp) cuando sea necesario.
   - `postgres` (o el MCP de base de datos que exista en este entorno) → inspeccionar el esquema de PostgreSQL y lanzar migraciones.

2. MCPs que NO quiero que utilices para este agente:
   - Cualquier MCP que envíe datos personales a servicios externos no controlados.
   - MCPs que permitan operaciones destructivas en producción (borrados masivos, administración de infra, etc.).

Tareas:

- Localiza el archivo de configuración de MCP del proyecto (por ejemplo `mcp.config.*`) y:
  - Declara los servidores para `filesystem`, `shell`, `http` y `postgres`.
  - Elimina o desactiva otros MCPs para el agente `recruitment-ops`.
- En la configuración de agentes, asegúrate de que:
  - El agente `recruitment-ops`:
    - Usa el prompt `agents/recruitment-ops/agent.md`.
    - Tiene en su lista de tools SOLO: `filesystem`, `shell`, `http`, `postgres`.
- No uses `sudo` ni requieras permisos de administrador en ningún paso.
- Devuélveme:
  - Los diffs concretos de configuración que has tocado.
  - Una breve explicación de cómo puedo cambiar esta lista de MCPs en el futuro.
