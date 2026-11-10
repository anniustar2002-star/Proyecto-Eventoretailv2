export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute -left-32 -top-32 h-[34rem] w-[34rem] animate-pulse-glow rounded-full bg-gs1-blue/10 blur-[130px]" />
      <div className="absolute -right-28 top-1/4 h-[38rem] w-[38rem] animate-pulse-glow rounded-full bg-gs1-orange/10 blur-[140px]" style={{ animationDelay: '1.5s' }} />
      <div className="absolute -bottom-24 left-1/3 h-[36rem] w-[36rem] rounded-full bg-gs1-purple/10 blur-[130px]" />
      <div className="absolute left-10 top-2/3 h-96 w-96 rounded-full bg-gs1-fuchsia/10 blur-[110px]" />
    </div>
  );
}
