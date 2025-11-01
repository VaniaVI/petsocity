# Guía Completa: Configuración de Proyecto Next.js (App Router) + Bootstrap + Entorno Python (Windows)

Este documento explica paso a paso cómo dejar listo tu entorno de desarrollo para una página web usando **Next.js con App Router**, **Bootstrap** y un **entorno virtual Python (Windows + VS Code)** para scripts o servicios adicionales.

Incluye:
✅ Crear proyecto Next.js
✅ Instalar dependencias
✅ Integrar Bootstrap
✅ Uso de venv Python en Windows
✅ Estructura real del proyecto (igual que tu screenshot)
✅ Comandos y explicación

---

## 🧰 Requisitos Previos

| Tecnología                  | Versión recomendada | Verificar          |
| --------------------------- | ------------------- | ------------------ |
| Node.js                     | 18.x o 20.x         | `node -v`          |
| npm                         | Incluido en Node    | `npm -v`           |
| Python                      | 3.8+                | `python --version` |
| Editor código               | Visual Studio Code  | ✅                  |
| Windows Terminal/PowerShell | Sí                  | ✅                  |

---

## 📁 Estructura del Proyecto (Final)

Tu proyecto debe verse así:

```
PETSOCITY/
├─ app/
│  ├─ registrarUsuario/
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx      ✅ Layout global
│  └─ page.tsx        ✅ Página principal (solo un page)
│
├─ components/
│  ├─ Navbar.jsx
│  ├─ LoginModal.jsx
│  └─ Footer.jsx
│
├─ hooks/
│  └─ useCart.jsx
│
├─ public/
├─ pet2/              ✅ Virtual env Python
├─ package.json
├─ tsconfig.json
├─ .gitignore
└─ README.md
```

> ⚠️ Si tienes `page.jsx` y `page.tsx`, elimina uno. Recomendación: **usa `.tsx`**.

---

## 🟦 1) Inicializar Proyecto Next.js (App Router)

```bash
npx create-next-app@latest
```

Selecciona TypeScript ✅

---

## 🟨 2) Instalar Bootstrap y librerías UI

```bash
npm install react-bootstrap bootstrap
npm install react-bootstrap-icons
```

---

## 🎨 3) Importar Bootstrap correctamente (App Router)

### Edita `app/layout.tsx`:

```ts
import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Petsocity',
  description: 'Plataforma de gestión para cuidado de mascotas',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

> ✅ Bootstrap está cargado globalmente

---

## 🐍 4) Crear y Activar Entorno Python (Windows)

### Crear venv

```bash
python -m venv pet2
```

### Activar venv en VS Code

```powershell
pet2\Scripts\activate
```

### Si PowerShell bloquea scripts

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### Salir del entorno

```
deactivate
```

> Esto mantiene dependencias Python separadas del sistema.

---

## 📦 5) Ver dependencias instaladas

### Node

```bash
cat package.json
```

### Python

Si usas requisitos:

```bash
pip freeze > requirements.txt
```

---

## 🚀 6) Iniciar Servidor de Desarrollo

```bash
npm run dev
```

Abrir en navegador:

```
http://localhost:3000
```

---

## 🧠 Consejos

✔ Mantén `pet2/` fuera del repo → agregado en `.gitignore`
✔ Usa TypeScript para mejor escalabilidad
✔ Documenta comandos internos del proyecto
✔ Usa `NEXT_PUBLIC_` para variables públicas de entorno

---

## ✅ Checklist Final

* [x] Proyecto Next.js creado
* [x] App Router (`app/` folder)
* [x] Bootstrap importado en `layout.tsx`
* [x] Virtual env Python `pet2/`
* [x] `npm run dev` funcionando

---