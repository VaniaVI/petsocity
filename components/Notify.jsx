'use client';
import { useEffect, useRef } from 'react';

export default function Notify({ show, title = 'Confirmación', message = '', onHide }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const toastEl = ref.current;
    const bt = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3500 });
    const handler = () => onHide?.();
    toastEl.addEventListener('hidden.bs.toast', handler);
    if (show) bt.show();
    return () => { toastEl.removeEventListener('hidden.bs.toast', handler); bt.dispose(); };
  }, [show, onHide]);

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
      <div ref={ref} className="toast align-items-center text-bg-success border-0" role="alert">
        <div className="d-flex">
          <div className="toast-body">
            <strong className="me-2">{title}:</strong> {message}
          </div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
  );
}
