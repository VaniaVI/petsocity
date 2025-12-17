import { Suspense } from "react";
import CompraExitosaClient from "./compraExitosaClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Cargando compra...</p>}>
      <CompraExitosaClient />
    </Suspense>
  );
}
