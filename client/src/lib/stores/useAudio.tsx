import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  winSound: HTMLAudioElement | null;
  loseSound: HTMLAudioElement | null;
  gameOverSound: HTMLAudioElement | null;
  isMuted: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  setWinSound: (sound: HTMLAudioElement) => void;
  setLoseSound: (sound: HTMLAudioElement) => void;
  setGameOverSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playWin: () => void;
  playLose: () => void;
  playGameOver: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  winSound: null,
  loseSound: null,
  gameOverSound: null,
  isMuted: true, // Start muted by default
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  setWinSound: (sound) => set({ winSound: sound }),
  setLoseSound: (sound) => set({ loseSound: sound }),
  setGameOverSound: (sound) => set({ gameOverSound: sound }),
  
  toggleMute: () => {
    const { isMuted } = get();
    const newMutedState = !isMuted;
    
    // Just update the muted state
    set({ isMuted: newMutedState });
    
    // Log the change
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Hit sound skipped (muted)");
        return;
      }
      
      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Success sound skipped (muted)");
        return;
      }
      
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  },
  
  playWin: () => {
    const { winSound, isMuted } = get();
    if (winSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Win sound skipped (muted)");
        return;
      }
      
      winSound.currentTime = 0;
      winSound.volume = 0.5;
      winSound.play().catch(error => {
        console.log("Win sound play prevented:", error);
      });
    }
  },
  
  playLose: () => {
    const { loseSound, isMuted } = get();
    if (loseSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Lose sound skipped (muted)");
        return;
      }
      
      loseSound.currentTime = 0;
      loseSound.volume = 0.5;
      loseSound.play().catch(error => {
        console.log("Lose sound play prevented:", error);
      });
    }
  },
  
  playGameOver: () => {
    const { gameOverSound, isMuted } = get();
    if (gameOverSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Game over sound skipped (muted)");
        return;
      }
      
      gameOverSound.currentTime = 0;
      gameOverSound.volume = 0.6;
      gameOverSound.play().catch(error => {
        console.log("Game over sound play prevented:", error);
      });
    }
  }
}));
