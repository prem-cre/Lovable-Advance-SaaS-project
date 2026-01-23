import { AnimatedBackground } from "@/modules/home/ui/components/animated-background";

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        <main className="flex flex-col min-h-screen w-full text-foreground dark:bg-[#030303] dark:text-white relative font-sans selection:bg-orange-500/30">
            {/* Deep Ambient Background - Only visible in dark mode or if intended */}
            <div className="hidden dark:block">
                <AnimatedBackground />
            </div>
            {/* Light mode ambient background if needed, otherwise default bg applies */}

            <div className="flex-1 flex flex-col relative z-10 h-full">
                {children}
            </div>
        </main>
    );
};

export default Layout;
