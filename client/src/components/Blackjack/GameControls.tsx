import { CasinoButton } from "../ui/button-casino";

interface GameControlsProps {
  onHit: () => void;
  onStand: () => void;
  onDoubleDown: () => void;
  onSplit: () => void;
  disableControls?: boolean;
  canDoubleDown?: boolean;
  canSplit?: boolean;
}

const GameControls = ({ 
  onHit, 
  onStand, 
  onDoubleDown,
  onSplit,
  disableControls = false,
  canDoubleDown = false,
  canSplit = false,
}: GameControlsProps) => {
  return (
    <div className="mt-4 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-4">
      <CasinoButton
        variant="green"
        size="md"
        onClick={onHit}
        disabled={disableControls}
        className="min-w-[80px] sm:min-w-0"
      >
        Hit
      </CasinoButton>
      
      <CasinoButton
        variant="red"
        size="md"
        onClick={onStand}
        className="min-w-[80px] sm:min-w-0"
      >
        Stand
      </CasinoButton>
      
      <CasinoButton
        variant="blue"
        size="md"
        onClick={onDoubleDown}
        disabled={!canDoubleDown || disableControls}
        className="min-w-[80px] sm:min-w-0"
      >
        <span className="hidden sm:inline">Double Down</span>
        <span className="sm:hidden">Double</span>
      </CasinoButton>
      
      <CasinoButton
        variant="purple"
        size="md"
        onClick={onSplit}
        disabled={!canSplit || disableControls}
        className="min-w-[80px] sm:min-w-0"
      >
        Split
      </CasinoButton>
    </div>
  );
};

export default GameControls;
