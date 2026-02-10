import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 select-none">
      <div className="w-9 h-9 rounded-md bg-neon-500/10 border border-neon-500/50 flex items-center justify-center shadow-neon">
        <span className="text-neon-300 font-bold">{'>_'}</span>
      </div>
      <div className="leading-tight">
        <div className="font-bold text-neon-300">CyberTrain</div>
        <div className="text-[10px] text-cyber-muted uppercase tracking-wider">secure · learn · compete</div>
      </div>
    </Link>
  );
}
