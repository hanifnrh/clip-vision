"use client";

import { easeInOut, motion } from "framer-motion";
import { Bell, Home, Search, Video } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Import ModeToggle from the external file
import { ModeToggle } from "./mode-toggle"; // Adjust path as needed

const navItems = [
  {
    id: 1,
    label: "Home",
    href: "/",
    icon: <Home className="h-full w-full" />,
  },
  {
    id: 2,
    label: "Search",
    href: "/search",
    icon: <Search className="h-full w-full" />,
  },
  {
    id: 3,
    label: "Upload",
    href: "/upload",
    icon: <Video className="h-full w-full" />,
  },
  {
    id: 4,
    label: "Notification",
    href: "/notification",
    icon: <Bell className="h-full w-full" />,
  },
  {
    id: 5,
    label: "Theme",
    icon: <ModeToggle />,  // ModeToggle component imported from another file
  },
  {
    id: 6,
    label: "Profile",
    icon: <img src="/profile.jpg" alt="Profile" className="w-6 h-6 rounded-full" />,  // Profile picture from public
  },
];

const Dock = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<number | null>(
    navItems.find((item) => item.href === pathname)?.id || null
  );

  useEffect(() => {
    setActiveTab(navItems.find((item) => item.href === pathname)?.id || null);
  }, [pathname]);

  const duration = 0.4;

  const dockVariants = {
    open: {
      width: "fit-content",
      opacity: 1,
      transition: {
        easeInOut,
        duration,
      },
    },
    closed: {
      width: 0,
      opacity: 0,
      transition: {
        easeInOut,
        duration,
      },
    },
  };

  const initialX = activeTab !== null ? (activeTab - 1) * 40 : 0;

  return (
    <motion.div
      variants={dockVariants}
      initial="closed"
      animate="open"
      className="md:hidden dock-shadow fixed inset-x-0 bottom-8 z-50 mx-auto rounded-2xl bg-popover p-1"
    >
      <div className="relative flex items-center">
        {activeTab !== null && (
          <motion.span
            className="absolute bottom-0 top-0 z-[99] w-10 rounded-[12px] bg-primary/40 mix-blend-difference outline-none ring-0 dark:bg-primary/80"
            initial={{ translateX: initialX, opacity: 0, scale: 0 }}
            animate={{ translateX: (activeTab - 1) * 40, opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        {navItems.map((item) =>
          item.href ? (
            <Link
              key={item.id}
              href={item.href}
              scroll={true}
              onClick={() => setActiveTab(item.id)}
              className={`${activeTab === item.id
                ? "text-foreground"
                : "text-muted-foreground"
                } group/dock relative h-10 w-10 p-3 text-sm transition-all duration-300 ease-in-out focus-visible:outline-none`}
              style={{
                WebkitTapHighlightColor: "transparent",
              }}
              aria-label={item.label}
            >
              {item.icon}
              <span className="absolute -top-8 left-1/2 hidden -translate-x-1/2 -translate-y-2 scale-75 rounded-md border bg-popover p-1 px-1.5 text-[10px] font-medium leading-none text-foreground opacity-0 transition-all duration-200 ease-in-out group-hover/dock:translate-y-0 group-hover/dock:scale-100 group-hover/dock:opacity-100 md:block">
                {item.label}
              </span>
            </Link>
          ) : (
            <div
              key={item.id}
              onClick={() => {
                // ModeToggle will handle the theme change
              }}
              className={`group/dock relative h-10 w-10 text-sm transition-all duration-300 ease-in-out focus-visible:outline-none items-center justify-center flex`}
              aria-label="Change theme button"
            >
              {item.icon}
              <span className="absolute -top-8 left-1/2 hidden -translate-x-1/2 -translate-y-2 scale-75 rounded-md border bg-popover p-1 px-1.5 text-[10px] font-medium leading-none text-foreground opacity-0 transition-all duration-200 ease-in-out group-hover/dock:translate-y-0 group-hover/dock:scale-100 group-hover/dock:opacity-100 md:block">
                {item.label}
              </span>
            </div>
          )
        )}
      </div>
    </motion.div>
  );
};

export default Dock;
