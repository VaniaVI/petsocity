"use client";

import dynamic from "next/dynamic";

const CompraExitosaComponent = dynamic(() => import("./compraExitosaClient"), {
  ssr: false, // ⚠️ evita prerendering
});

export default function Page() {
  return <CompraExitosaComponent />;
}
