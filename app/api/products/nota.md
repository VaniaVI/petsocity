# Documentación Técnica: Problema con la obtención de productos por ID

## 1. Contexto

En el desarrollo de un sistema de e-commerce con **Next.js (App Router, versión 15+)**, se implementó un endpoint para obtener la información de un producto específico mediante su ID:


Los datos de los productos se encontraban en un archivo estático `data/products.js`, y se utilizaba un servicio `getProductoById(id)` para acceder a ellos.

El frontend consumía este endpoint en la página de detalle del producto (`detalleProducto/[id]/page.jsx`) usando `fetch` y `useParams()`.

---

## 2. Problema encontrado

Al intentar acceder a un producto por su ID, el frontend mostraba:

Error al cargar producto

Y la consola del servidor devolvía:

Route "/api/products/[id]" used params.id. params is a Promise and must be unwrapped with await...

### Causas identificadas:

1. **Uso incorrecto de `params` en Next.js 15+:**  
   En las rutas dinámicas de la App Router, `params` ya no se pasa como objeto síncrono. Es una **Promise** que debe resolverse con `await`.

2. **Uso incorrecto de la función `getProductoById`:**  
   En algunos intentos se hacía:

   ```js
   const product = getProductoById.find(p => p.id === productId);
❌ Esto es incorrecto porque getProductoById es una función, no un array, y no tiene método .find().

3. Extensión de archivo incorrecta:
Algunos archivos estaban como route.jsx. Las rutas API deben ser .js o .ts.

## 3. Solución implementada

Se implementaron las siguientes correcciones para resolver el problema de obtención de productos por ID en Next.js:

### 3.1. Uso correcto de `params`
Se corrigió la desestructuración de los parámetros en las rutas dinámicas de la API. En Next.js 15+, `params` es una promesa y debe resolverse con `await` antes de acceder a sus propiedades. Esto asegura que el ID del producto se obtenga correctamente desde la URL.

```js
export async function GET(request, context) {
  const { id } = await context.params; // ✅ Desestructuración correcta
}
```

### 3.2. Llamada correcta al servicio
Se ajustó la llamada a la función `getProductoById` para que reciba el ID como argumento, en lugar de intentar usar métodos de array sobre la función. Esto garantiza que la función retorne el producto correcto basado en el ID.

```js
const product = getProductoById(productId); // ✅ Llamar la función con el ID
```

### 3.3. Validación de ID y manejo de errores
Se implementaron verificaciones para asegurar que el ID recibido sea válido y numérico. Si el ID no es válido o el producto no existe, se devuelve un mensaje de error adecuado (`ID inválido` o `Producto no encontrado`) con el código HTTP correspondiente (400 o 404). Esto mejora la seguridad y robustez del API.

```js
if (!productId || isNaN(productId)) {
  return NextResponse.json({ error: "ID inválido" }, { status: 400 });
}

if (!product) {
  return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
}
```

### 3.4. Archivo con extensión correcta
Se corrigió la extensión del archivo de la ruta API a `.js` (`route.js`), asegurando compatibilidad con Next.js y evitando errores de ejecución que se presentaban al usar `.jsx`.
```js
app/api/products/[id]/route.js
```
### 3.5. Función `getProductoById` en `productsService.js`
Se definió la función `getProductoById` de manera que busque el producto en el array de productos y devuelva el objeto correspondiente o `null` si no se encuentra. Esto permite que la lógica de obtención de productos quede centralizada y escalable para futuras modificaciones o migraciones a bases de datos reales.

```js
import { productos } from "@/data/products.js";

export function getProductoById(id) {
  return productos.find(p => p.id === id) || null;
}

```