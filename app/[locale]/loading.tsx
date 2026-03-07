import Image from "next/image"

export default function Loading() {
    return (
        <div className="flex-1 flex flex-col min-h-[60vh] items-center justify-center bg-zinc-950 overflow-hidden rounded-3xl my-8">
            {/* Background Gradients for Depth */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#c12830]/10 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#18182e]/30 blur-[120px] rounded-full animate-pulse delay-700"></div>

            <div className="relative flex flex-col items-center gap-8">
                {/* Logo Container */}
                <div className="flex items-center gap-6 md:gap-12 animate-in fade-in zoom-in duration-700">
                    <div className="relative size-20 md:size-28 animate-pulse">
                        <Image
                            src="/assets/morgana.webp"
                            alt="Morgana Loading"
                            fill
                            className="object-contain drop-shadow-[0_0_15px_rgba(193,40,48,0.3)]"
                            sizes="(max-width: 768px) 80px, 112px"
                        />
                    </div>
                    <div className="h-12 w-px bg-zinc-800 animate-in fade-in slide-in-from-bottom duration-1000"></div>
                    <div className="relative size-20 md:size-28 animate-pulse delay-300">
                        <Image
                            src="/assets/orum.webp"
                            alt="Orum Loading"
                            fill
                            className="object-contain drop-shadow-[0_0_15px_rgba(24,24,46,0.5)]"
                            sizes="(max-width: 768px) 80px, 112px"
                        />
                    </div>
                </div>

                {/* Loading Text & Bar */}
                <div className="flex flex-col items-center gap-4">
                    <span className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black animate-pulse">
                        Caricamento ...
                    </span>
                    <div className="w-48 h-[2px] bg-zinc-900 rounded-full overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#c12830] via-[#ffffff] to-[#18182e] animate-loading-bar origin-left w-full"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
