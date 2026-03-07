import Image from "next/image"

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl animate-in fade-in duration-500">
            {/* Background Gradients for Depth - Light Theme */}
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-[#c12830]/5 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-[#18182e]/10 blur-[120px] rounded-full animate-pulse delay-700"></div>

            <div className="relative flex flex-col items-center gap-10">
                {/* Logo Container */}
                <div className="flex items-center gap-8 md:gap-16 animate-in fade-in zoom-in duration-1000">
                    <div className="relative size-24 md:size-32">
                        <Image
                            src="/assets/morgana.webp"
                            alt="Morgana Loading"
                            fill
                            className="object-contain drop-shadow-sm"
                            priority
                            sizes="(max-width: 768px) 96px, 128px"
                        />
                    </div>
                    <div className="h-16 w-px bg-zinc-200"></div>
                    <div className="relative size-24 md:size-32">
                        <Image
                            src="/assets/orum.webp"
                            alt="Orum Loading"
                            fill
                            className="object-contain drop-shadow-sm"
                            priority
                            sizes="(max-width: 768px) 96px, 128px"
                        />
                    </div>
                </div>

                {/* Loading Text & Bar */}
                <div className="flex flex-col items-center gap-6">
                    <span className="text-zinc-400 text-[11px] uppercase tracking-[0.4em] font-bold">
                        Caricamento in corso
                    </span>
                    <div className="w-64 h-[2px] bg-zinc-100 rounded-full overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#c12830] via-[#808080] to-[#18182e] animate-loading-bar origin-left w-full"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
