import Link from "next/link";

export default function Header({ pageTitle }: { pageTitle: string }) {
    return (
        <div className="p-5 bg-gray-100 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-black">{pageTitle}</h1>
        </div>
    )
}