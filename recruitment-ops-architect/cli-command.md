Quiero que prepares mi entorno local de desarrollo para este monorepo Antigravity + Flutter, usando SOLO comandos que no requieran permisos de administrador.

Supón que el repo ya está clonado en este ordenador.

Objetivos:
- Instalar dependencias de backend (Node/Nest) y workers (Stitch/orquestación) usando el package manager ya configurado (pnpm o npm).
- Instalar dependencias del cliente Flutter a nivel de proyecto (no global).
- Dejar listos los comandos para:
  - Levantar backend.
  - Levantar workers.
  - Levantar app Flutter (web y móvil, si hay dispositivo).
- Sin usar `sudo`, sin instalar nada global (`npm i -g` prohibido).

Pasos que debes seguir tú solo usando MCPs:

1. Usa `filesystem` para:
   - Detectar la estructura del monorepo:
     - Carpetas relevantes (`backend/`, `workers/`, `app/` o similar).
     - Leer `package.json` para ver si se usa `pnpm`, `npm` o `yarn`.
     - Leer el archivo principal del proyecto Flutter (`pubspec.yaml`).

2. Con `shell`:
   - En la carpeta raíz del repo, instala dependencias del monorepo:
     - Si encuentras `pnpm-lock.yaml`, usa:
       - `pnpm install`
     - Si no, usa:
       - `npm install`
   - En `backend/` (o la carpeta que detectes para el API Nest/Node):
       - Ejecuta de nuevo `pnpm install` o `npm install` si es necesario.
       - No añadas paquetes nuevos salvo que sea imprescindible; primero revisa el `package.json`.
   - En `workers/` (si existe):
       - Ejecuta el mismo comando de instalación.

3. Para Flutter:
   - Asume que el SDK de Flutter ya está instalado y disponible en el PATH.
   - En la carpeta de la app Flutter:
       - Ejecuta `flutter pub get`.
       - Prepara dos comandos que yo pueda usar:
         - `flutter run -d chrome` para desarrollo web.
         - `flutter run` para móvil/emulador.

4. Arranque de los servicios:
   - Detecta en los `package.json` los scripts adecuados (`dev`, `start:dev`, etc.).
   - Proponme un bloque de comandos, en orden, tipo:

     ```bash
     # Terminal 1 – backend
     cd backend
     pnpm dev

     # Terminal 2 – workers
     cd workers
     pnpm dev

     # Terminal 3 – Flutter (web)
     cd app
     flutter run -d chrome
     ```

5. Restricciones:
   - No ejecutes `sudo` ni intentes modificar la instalación global de Node, pnpm o Flutter.
   - Cualquier dependencia nueva que necesites debe instalarse a nivel de proyecto (`pnpm add` en el directorio correspondiente).

Al final, devuélveme:
- Los comandos exactos que has ejecutado.
- Los comandos finales que debo usar en cada terminal para levantar todo el sistema.
- Cualquier ajuste que hayas hecho a los scripts de `package.json` o a la config de Flutter para que funcione el modo web.
