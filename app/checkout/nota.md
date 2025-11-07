## 📝 **Explicación Paso a Paso**

### **1. Flujo de Datos**
```
Registro → guarda "clienteCorreo" en localStorage
         ↓
Checkout → lee "clienteCorreo"
         ↓
clientService.obtenerClientePorCorreo()
         ↓
Devuelve objeto completo del cliente
         ↓
setFormData() rellena el formulario