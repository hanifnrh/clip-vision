"use client";
import {
    Link
} from "@nextui-org/react";
import { Bell, Video } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./button";
import { ModeToggle } from "./mode-toggle";
import { PlaceholdersAndVanishInput } from "./placeholders-and-vanish-input";

export default function ResponsiveNavbar() {
    const currentPath = usePathname();
    const router = useRouter(); // Initialize router
    const [value, setValue] = useState(""); // State for input value

    const placeholders = [
        "What are you gonna search?",
        "Search everything",
        "Yes. You can search any videos from YouTube",
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value); // Update value state as user types
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (value) {
            router.push(`/search?query=${value}`); // Navigate with the query parameter
        }
    };

    return (
        <div
            className={`sticky top-0 w-full z-50 bg-white dark:bg-zinc-950`}
        >
            {/* Navbar for large screens */}
            <nav className="max-w-screen-xl flex-wrap items-center justify-center md:justify-between mx-auto gap-4 p-4 flex">
                <div className="left-nav flex items-center space-x-4">
                    <Link
                        href="/"
                        className={`flex items-center ${currentPath === "/" ? "flex items-center space-x-3 rtl:space-x-reverse p-0 sm:py-2 sm:px-3 md:bg-transparent md:p-0" : "flex items-center space-x-3 rtl:space-x-reverse md:bg-transparent md:p-0 p-0 sm:py-2 sm:px-3"}`}
                    >
                        <img
                            src="/logo.png"
                            className="h-12 navbar-logo rounded-lg"
                            alt="Clipvision Logo"
                        />
                        <div className="text-2xl coolvetica hidden lg:block dark:text-white">
                            Clipvision
                        </div>
                    </Link>
                </div>
                <PlaceholdersAndVanishInput
                    placeholders={placeholders}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                />
                <div className={`w-full hidden lg:block lg:w-auto`} id="navbar-default">
                    <div className="items-center flex font-bold flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
                        <div className={`flex flex-col md:flex-row gap-x-5 gap-y-3 items-center`}>
                            <Link href="/">
                                <div
                                    className="cursor-pointer uppercase text-black dark:text-white hover:text-foreground"
                                >
                                    <Button
                                        variant="noborder"
                                        size="icon"
                                    >
                                        <Video />
                                    </Button>
                                </div>
                            </Link>
                            <Link href="/">
                                <div
                                    className="cursor-pointer uppercase text-black dark:text-white hover:text-foreground"
                                >
                                    <Button
                                        variant="noborder"
                                        size="icon"
                                    >
                                        <Bell />
                                    </Button>
                                </div>
                            </Link>

                            <ModeToggle></ModeToggle>

                            <Link href="/profile">
                                <div
                                    className="cursor-pointer uppercase text-zinc-500 hover:text-foreground ml-2"
                                >
                                    <div className="text-2xl">
                                        <Image
                                            src="/profile.jpg"
                                            alt="Profile"
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 rounded-full"
                                        />
                                    </div>
                                </div>
                            </Link>

                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}
