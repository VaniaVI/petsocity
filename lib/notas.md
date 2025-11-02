Utilizaremos lib de una mejor forma cuando nos conectemos realmente con una base de datos.
con el siguiente esquema
/lib
  /db.js                  ← conexión BD o mock temporal
  /models
    producto.model.js     ← esquema / interfaz del producto
  /services
    productos.service.js  ← lógica CRUD real (leer BD o JSON)