// hooks/useBootstrap.js
'use client';

import { useEffect } from 'react';

export function useBootstrap() {
  useEffect(() => {
    // Importar Bootstrap JavaScript dinámicamente
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
      .then((bootstrap) => {
        // Bootstrap se inicializa automáticamente
        console.log('Bootstrap inicializado');
      })
      .catch((error) => {
        console.error('Error al cargar Bootstrap:', error);
      });
  }, []);
}