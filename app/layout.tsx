import type {Metadata} from "next";
import "./globals.css";
import {BackgroundWave} from "@/components/background-wave";
import Link from "next/link";
import {Fellowship360Logo, GithubLogo} from "@/components/logos";

export const metadata: Metadata = {
    title: "Grace - Your AI Assistant",
    description: "Have a conversation with Grace, your helpful AI assistant",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={"h-full w-full"}>
        <body className={`antialiased w-full h-full lex flex-col`}>
        <div className="flex flex-col flex-grow w-full items-center justify-center sm:px-4">
            <nav
                className={
                    "sm:fixed w-full top-0 left-0 grid grid-cols-2 py-4 px-8"
                }
            >
                <div className={"flex items-center"}>
                    <Link href={"/"} prefetch={true}>
                        <Fellowship360Logo className="h-8 w-auto" />
                    </Link>
                </div>

                <div className={"flex gap-4 justify-end"}>
                    <Link
                        href="https://github.com/jonatanvm/convai-demo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={"py-0.5"}
                        aria-label="View source on GitHub"
                    >
                        <GithubLogo
                            className={"w-5 h-5 hover:text-gray-500 text-[#24292f]"}
                        />
                    </Link>
                </div>
            </nav>
            {children}
            <BackgroundWave/>
        </div>
        </body>
        </html>
    );
}
