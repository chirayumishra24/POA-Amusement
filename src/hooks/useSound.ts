import { useRef } from 'react';

const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  select: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  budget_low: 'https://assets.mixkit.co/active_storage/sfx/1070/1070-preview.mp3',
  applause: 'https://assets.mixkit.co/active_storage/sfx/1992/1992-preview.mp3',
};

export function useSound() {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const playSound = (name: keyof typeof SOUNDS) => {
    if (!audioRefs.current[name]) {
      audioRefs.current[name] = new Audio(SOUNDS[name]);
      audioRefs.current[name].volume = 0.4;
    }
    
    // Play with a fresh copy to allow overlapping sounds
    const audio = audioRefs.current[name].cloneNode() as HTMLAudioElement;
    audio.volume = 0.4;
    audio.play().catch(e => console.warn('Sound play blocked by browser', e));
  };

  return { playSound };
}
