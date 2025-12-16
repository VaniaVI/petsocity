import dynamic from "next/dynamic";
import { Suspense } from "react";
const CompraExitosaComponent = dynamic(() => import("./compraExitosaClient"), {
  ssr: false, // ⚠️ evita prerendering
});

export default function Page() {
  return ( 
  <Suspense fallback={<div>Cargando...</div>}>
      <CompraExitosaComponent />
    </Suspense>
  )
}
