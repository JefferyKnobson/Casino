// Audio utilities for the casino game

type AudioType = "background" | "win" | "loss" | "hit" | "cash" | "deal" | "bet" | "spin" | "gameOver";

interface AudioFiles {
  backgroundMusic: HTMLAudioElement;
  hitSound: HTMLAudioElement;
  successSound: HTMLAudioElement;
  // Additional audio files
  spinSound: HTMLAudioElement;
  dealSound: HTMLAudioElement;
  betSound: HTMLAudioElement;
  winSound: HTMLAudioElement;
  lossSound: HTMLAudioElement;
  gameOverSound: HTMLAudioElement;
}

let audioFiles: AudioFiles | null = null;

// Initialize all audio files
export async function initAudio(): Promise<AudioFiles> {
  if (audioFiles) {
    return audioFiles;
  }
  
  // Create audio elements
  const backgroundMusic = new Audio("/sounds/background.mp3");
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.3;
  
  const hitSound = new Audio("/sounds/hit.mp3");
  hitSound.volume = 0.5;
  
  const successSound = new Audio("/sounds/success.mp3");
  successSound.volume = 0.6;
  
  // Additional sounds using the available sound files
  // We'll reuse the existing sound files with different volumes/settings
  // for different game actions
  const spinSound = new Audio("/sounds/hit.mp3");
  spinSound.volume = 0.4;
  spinSound.playbackRate = 1.2;
  
  const dealSound = new Audio("/sounds/hit.mp3");
  dealSound.volume = 0.3;
  dealSound.playbackRate = 0.8;
  
  const betSound = new Audio("/sounds/hit.mp3");
  betSound.volume = 0.2;
  
  const winSound = new Audio("/sounds/success.mp3");
  winSound.volume = 0.8;
  
  const lossSound = new Audio("/sounds/hit.mp3");
  lossSound.volume = 0.3;
  lossSound.playbackRate = 0.6;
  
  // Game over sound (using hit sound but with deeper tone for dramatic effect)
  const gameOverSound = new Audio("/sounds/hit.mp3");
  gameOverSound.volume = 0.7;
  gameOverSound.playbackRate = 0.5;
  
  audioFiles = {
    backgroundMusic,
    hitSound,
    successSound,
    spinSound,
    dealSound,
    betSound,
    winSound,
    lossSound,
    gameOverSound,
  };
  
  return audioFiles;
}

// Play a sound with optional volume override
export function playSound(type: AudioType, volumeOverride?: number): void {
  if (!audioFiles) return;
  
  let sound: HTMLAudioElement;
  
  switch (type) {
    case "background":
      sound = audioFiles.backgroundMusic;
      break;
    case "win":
      sound = audioFiles.winSound;
      break;
    case "loss":
      sound = audioFiles.lossSound;
      break;
    case "hit":
      sound = audioFiles.hitSound;
      break;
    case "cash":
      sound = audioFiles.successSound;
      break;
    case "deal":
      sound = audioFiles.dealSound;
      break;
    case "bet":
      sound = audioFiles.betSound;
      break;
    case "spin":
      sound = audioFiles.spinSound;
      break;
    case "gameOver":
      sound = audioFiles.gameOverSound;
      break;
    default:
      return;
  }
  
  // Clone the sound to allow overlapping playback
  const soundClone = sound.cloneNode() as HTMLAudioElement;
  if (volumeOverride !== undefined) {
    soundClone.volume = volumeOverride;
  }
  
  soundClone.play().catch(error => {
    console.log(`Sound play prevented: ${error}`);
  });
}

// Start or stop background music
export function toggleBackgroundMusic(play: boolean): void {
  if (!audioFiles) return;
  
  const { backgroundMusic } = audioFiles;
  
  if (play) {
    backgroundMusic.play().catch(error => {
      console.log(`Background music play prevented: ${error}`);
    });
  } else {
    backgroundMusic.pause();
  }
}

// Set volume for all sounds
export function setMasterVolume(volume: number): void {
  if (!audioFiles) return;
  
  const normalizedVolume = Math.max(0, Math.min(1, volume));
  
  Object.values(audioFiles).forEach(audio => {
    // Keep relative volume differences, but scale by master volume
    const originalVolume = parseFloat(audio.dataset.originalVolume || "0.5");
    audio.volume = originalVolume * normalizedVolume;
  });
}

// Preload all audio files to prevent delays
export function preloadAudio(): void {
  initAudio().then(() => {
    if (!audioFiles) return;
    
    // Store original volumes for reference
    Object.values(audioFiles).forEach(audio => {
      audio.dataset.originalVolume = audio.volume.toString();
      // Preload by loading a bit of the audio
      audio.load();
      audio.currentTime = 0;
      audio.volume = 0;
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = parseFloat(audio.dataset.originalVolume || "0.5");
      }).catch(() => {
        // Ignore errors during preload
      });
    });
  });
}
