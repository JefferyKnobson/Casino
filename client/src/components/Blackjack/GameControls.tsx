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
    <div className="mt-8 flex flex-wrap justify-center gap-4">
      <CasinoButton
        variant="green"
        size="lg"
        onClick={onHit}
        disabled={disableControls}
      >
        Hit
      </CasinoButton>
      
      <CasinoButton
        variant="red"
        size="lg"
        onClick={onStand}
      >
        Stand
      </CasinoButton>
      
      <CasinoButton
        variant="blue"
        size="lg"
        onClick={onDoubleDown}
        disabled={!canDoubleDown || disableControls}
      >
        Double Down
      </CasinoButton>
      
      <CasinoButton
        variant="purple"
        size="lg"
        onClick={onSplit}
        disabled={!canSplit || disableControls}
      >
        Split
      </CasinoButton>
    </div>
  );
};

export default GameControls;
