# Playwright + TypeScript

Proyecto E2E + API que valida Pokémon en **PokeAPI** y descarga/valida imágenes en **Wikipedia**, leyendo datos desde **Excel** y aplicando **fixtures** para manejo de secretos y entornos.

> **Stack**: Node.js · Playwright Test · TypeScript · Dotenv · cross-env · xlsx

---

## 🚀 Requisitos previos (Windows)

1. **Instalar Chocolatey**

    ```powershell
    powershell -c "irm https://community.chocolatey.org/install.ps1 | iex"
    ```

2. **Instalar Node.js LTS 22.20.0**

    ```powershell
    choco install nodejs-lts --version="22.20.0"
    ```

3. **Verificar versiones**

    ```powershell
    node -v   # → v22.20.0
    npm -v    # → 10.9.3
    ```

> También funciona en macOS/Linux (instala Node 22 LTS por tu gestor preferido).
> Playwright descargará navegadores la primera vez que lo ejecutes.

---

## 📦 Instalación del proyecto

1. **Clona el repo** y entra a la carpeta.

```bash
  git clone
```

2. **Instala dependencias**:

```bash
npm ci
```

3. **(Sólo si arrancas de cero)** Inicializar Playwright:

```bash
npm init playwright@latest
```

### Dependencias clave y por qué

-   **cross-env** (dev): permite definir variables de entorno de forma **cross‑platform** en scripts de npm.
-   **dotenv** (dev): carga variables desde un archivo **.env** sin exponerlas en el código fuente.
-   **xlsx**: lectura directa del archivo Excel (`/data/pokemon.xlsx`) para generar tests **dinámicos** sin convertir a JSON.

Instalación manual (si hace falta):

```bash
npm i -D cross-env dotenv
npm i xlsx
```

---

## 🔐 Entornos y secretos

El proyecto usa **fixtures** para encriptar (SHA‑256) una **clave secreta** según el entorno y **loguearla** antes de cada test, sin exponer la clave en código. Los entornos válidos son:

-   `QA`
-   `CERT`

> **No** genera el archivo `.env` y setea ambiente, secretos.

### Configuración local (.env)

Crea un archivo `.env` en la raíz del proyecto:

```env
ENVIRONMENT=CERT

# Secretos por entorno, esto se puede respaldar en HV.
QA="<tu-clave-qa>"
CERT="<tu-clave-cert>"
```

> El fixture lee `process.env.ENVIRONMENT`.

### Cambiar de entorno en PowerShell

```powershell
$env:ENV = "CERT"      # o "QA"
```

---

## 📚 Datos de prueba (Excel)

-   Archivo: `data/pokemon.xlsx`
-   El runner lee **todas las filas** (ignorando encabezado) para crear casos de prueba por **id** y por **name** (API) y por **name** (Web).
-   La lectura se hace con `xlsx`.

---

## 🧪 Ejecutar pruebas

### Todas las pruebas

```bash
npx playwright test
```

### Un archivo específico

```bash
npx playwright test tests/api/posts.spec.ts
```

### Por proyecto/navegador (ej.: Chromium)

```bash
npx playwright test tests/web/pokemon-wiki.spec.ts --project=chromium
```

### Modo UI interactivo

```bash
npx playwright test --ui
```

### Filtrar por título

```bash
npx playwright test -g "Crear Post"
```

> Asegura definir `ENV=QA|CERT` antes de ejecutar (ver sección de **Entornos**). Si la variable está vacía o inválida, el fixture falla de forma explícita.

---

## 🧩 Estructura del proyecto (resumen)

```
config/
  environments.ts
.data/
  pokemon.xlsx
pages/
  wikipediaPage.ts
tests/
  api/
    pokemon.spec.ts
    posts.spec.ts
  web/
    pokemon-wiki.spec.ts
  fixtures/
    secret.fixture.ts
utils/
  fsHelper.ts
  logger.ts
images/           # destino de descargas (se crea si no existe)
playwright.config.ts
```

-   **fixtures/secret.fixture.ts**: resuelve entorno, lee secreto desde variables, genera **hash SHA‑256** y lo `console.log` **antes de cada test**.
-   **pages/wikipediaPage.ts**: POM para interacción/validaciones en Wikipedia.
-   **utils/fsHelper.ts**: helpers para crear carpeta `images/`, manejar sobrescritura, validar extensión/tamaño del archivo descargado.

---

## 📑 Reportes, trazas y evidencias

-   **Reporte HTML** de Playwright

    ```bash
    npx playwright show-report
    ```

-   **Screenshots/Video/Trace**: configurados en `playwright.config.ts` (capturas en fallo, trazas conservadas para análisis).
-   **Descargas**: las imágenes se guardan/actualizan en `images/` (se crea si no existe y **sobrescribe** si ya existe el mismo nombre).

---

## 🧭 Buenas prácticas aplicadas

-   **POM** (Page Object Model) para aislar selectores/acciones de Wikipedia.
-   **Fixtures** en lugar de `beforeEach` para preparar **hash** y contexto por test.
-   **Asserts** claros (título, artista, tiempos de respuesta < 10s, id/name/abilities, extensión/tamaño de imagen).
-   **Lectura directa de Excel** (sin convertir a JSON/archivo intermedio).
-   **Logs** de inicio/fin de cada test con fecha/hora.
-   **Cross‑platform** (scripts con `cross-env`).

---

## 🧰 Comandos útiles

```bash
# Ejecutar sólo API
npx playwright test tests/api

# Ejecutar sólo Web
npx playwright test tests/web

# Retries y reporter por CLI
npx playwright test --retries=2 --reporter=html
```

---

## 📄 Licencia

Challengue Monnet Payments
