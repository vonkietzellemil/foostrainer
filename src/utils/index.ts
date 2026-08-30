import type { Session, SessionStats, DrillRecord } from '../types';

const STORAGE_KEY_SESSIONS = 'foos-trainer-sessions';

export const storageUtils = {
  /**
   * Save sessions to local storage
   */
  saveSessions(sessions: Session[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save sessions to storage:', error);
    }
  },

  /**
   * Load sessions from local storage
   */
  loadSessions(): Session[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load sessions from storage:', error);
      return [];
    }
  },

  /**
   * Clear all sessions from local storage
   */
  clearSessions(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_SESSIONS);
    } catch (error) {
      console.error('Failed to clear sessions:', error);
    }
  },
};

/**
 * Shuffle bag algorithm for randomizing drills
 * Ensures all drills are shown before the bag is reshuffled
 */
export class ShuffleBag {
  private bag: string[];
  private original: string[];

  constructor(items: string[]) {
    this.original = [...items];
    this.bag = [...items];
    this.shuffle();
  }

  private shuffle(): void {
    for (let i = this.bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
    }
  }

  next(): string {
    if (this.bag.length === 0) {
      this.bag = [...this.original];
      this.shuffle();
    }
    return this.bag.pop()!;
  }

  reset(): void {
    this.bag = [...this.original];
    this.shuffle();
  }
}

/**
 * Calculate statistics from session drills
 */
export function calculateStats(drills: DrillRecord[]): SessionStats {
  if (drills.length === 0) {
    return {
      totalReps: 0,
      averageDelay: 0,
      fastestDelay: 0,
      longestDelay: 0,
      drillFrequency: {},
    };
  }

  const delays = drills.map((d) => d.randomDelay);
  const frequency: Record<string, number> = {};

  drills.forEach((drill) => {
    frequency[drill.drillName] = (frequency[drill.drillName] || 0) + 1;
  });

  return {
    totalReps: drills.length,
    averageDelay: delays.reduce((a, b) => a + b, 0) / delays.length,
    fastestDelay: Math.min(...delays),
    longestDelay: Math.max(...delays),
    drillFrequency: frequency,
  };
}


/**
 * Prepare speech synthesis for mobile browsers.
 *
 * Must be called from a user interaction such as
 * pressing the Start Training button.
 */
export function unlockSpeech(): void {
  try {
    if (!('speechSynthesis' in window)) {
      console.warn(
        'Speech synthesis is not supported.'
      );
      return;
    }

    // Cancel anything that may already be queued.
    window.speechSynthesis.cancel();

    // Speak a silent/empty utterance to initialize
    // the speech engine on some mobile browsers.
    const utterance =
      new SpeechSynthesisUtterance('');

    utterance.volume = 0;

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error(
      'Could not unlock speech:',
      error
    );
  }
}


/**
 * Play audio cue using Web Audio API
 */

let audioContext: AudioContext | null = null;

export async function unlockAudio(): Promise<void> {
  try {
    if (!audioContext) {
      audioContext = new (
        window.AudioContext ||
        (window as any).webkitAudioContext
      )();
    }

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
  } catch (error) {
    console.error(
      'Could not unlock audio:',
      error
    );
  }
}

/**
 * Play audio cue using Web Audio API
 */
export function playAudioCue(): void {
  try {
    if (!audioContext) {
      console.warn(
        'Audio has not been unlocked yet.'
      );
      return;
    }

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator =
      audioContext.createOscillator();

    const gainNode =
      audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    const now = audioContext.currentTime;

    gainNode.gain.setValueAtTime(0.3, now);

    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      now + 0.2
    );

    oscillator.start(now);
    oscillator.stop(now + 0.2);
  } catch (error) {
    console.error(
      'Failed to play audio cue:',
      error
    );
  }
}


/**
 * Speak text using Web Speech API
 */
export function speakText(
  text: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      if (!('speechSynthesis' in window)) {
        reject(
          new Error(
            'Speech synthesis is not supported.'
          )
        );
        return;
      }

      const utterance =
        new SpeechSynthesisUtterance(text);

      utterance.rate = 1.2;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = (event) => {
        console.error(
          'Speech synthesis error:',
          event
        );

        reject(event);
      };

      // Cancel anything currently speaking.
      window.speechSynthesis.cancel();

      // Small delay can help on some mobile browsers
      // after canceling the previous utterance.
      window.setTimeout(() => {
        window.speechSynthesis.speak(
          utterance
        );
      }, 50);
    } catch (error) {
      console.error(
        'Failed to speak text:',
        error
      );

      reject(error);
    }
  });
}


/**
 * Generate random delay within range
 */
export function getRandomDelay(minSeconds: number, maxSeconds: number): number {
  const minMs = minSeconds * 1000;
  const maxMs = maxSeconds * 1000;
  return Math.random() * (maxMs - minMs) + minMs;
}

/**
 * Format milliseconds to seconds with decimal places
 */
export function formatDelay(ms: number): string {
  return (ms / 1000).toFixed(2);
}

/**
 * Export session as CSV
 */
export function exportSessionAsCSV(session: Session): string {
  const headers = ['Rep', 'Drill', 'Delay (s)', 'Timestamp'];
  const rows = session.drills.map((drill: DrillRecord) => [
    drill.repNumber,
    drill.drillName,
    formatDelay(drill.randomDelay),
    new Date(drill.timestamp).toLocaleString(),
  ]);

  const csv = [
    [`Session: ${session.trainerName}`, `Date: ${new Date(session.startTime).toLocaleString()}`],
    headers,
    ...rows,
  ]
    .map((row: (string | number)[]) => row.map((cell: string | number) => `"${cell}"`).join(','))
    .join('\n');

  return csv;
}

/**
 * Export session as JSON
 */
export function exportSessionAsJSON(session: Session): string {
  return JSON.stringify(session, null, 2);
}

/**
 * Download file helper
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
