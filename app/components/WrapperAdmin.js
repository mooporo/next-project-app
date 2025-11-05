"use client";

import DrawerAdmin from "./DrawerAdmin";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function WrapperAdmin({ children }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // หน้า Auth ของแอดมิน
  const isAuthPage = pathname === "/login-admin";

  if (isAuthPage) {
    return <main className="w-full min-h-screen">{children}</main>;
  }

  return (
    <div className="relative w-full">
      <DrawerAdmin isOpen={isOpen} onToggle={setIsOpen} />

      <main
        className={`flex-1 transition-all duration-300 bg-white min-h-screen ${
          isOpen ? "ml-72" : "ml-0"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
