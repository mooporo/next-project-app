"use client";

import Drawer from "./Drawer";
import { useState } from "react";

export default function DrawerWrapper({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    // console.log(isOpen)

    return (
        <>
            <div className="relative w-full">
                <Drawer onToggle={setIsOpen} />
                <main className={`flex-1 transition-all duration-250 bg-white min-h-screen ${isOpen ? "ml-72" : "ml-0"
                    }`}
                >
                    {children}
                </main>
            </div>
        </>
    );
}
