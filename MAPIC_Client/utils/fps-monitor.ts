/**
 * FPS Monitor Utility
 * Monitors frame rate performance
 */

class FPSMonitor {
  private frameCount = 0;
  private lastTime = Date.now();
  private fps = 60;
  private rafId: number | null = null;
  private listeners: ((fps: number) => void)[] = [];

  start() {
    if (this.rafId !== null) return; // Already running

    const measure = () => {
      this.frameCount++;
      const currentTime = Date.now();
      const elapsed = currentTime - this.lastTime;

      // Update FPS every second
      if (elapsed >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / elapsed);
        this.frameCount = 0;
        this.lastTime = currentTime;

        // Notify listeners
        this.listeners.forEach((listener) => listener(this.fps));
      }

      this.rafId = requestAnimationFrame(measure);
    };

    this.rafId = requestAnimationFrame(measure);
  }

  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  getFPS(): number {
    return this.fps;
  }

  subscribe(listener: (fps: number) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  reset() {
    this.frameCount = 0;
    this.lastTime = Date.now();
    this.fps = 60;
  }
}

// Singleton instance
export const fpsMonitor = new FPSMonitor();

/**
 * React hook for monitoring FPS
 */
export function useFPSMonitor(enabled: boolean = false): number {
  const [fps, setFps] = React.useState(60);

  React.useEffect(() => {
    if (!enabled) return;

    fpsMonitor.start();
    const unsubscribe = fpsMonitor.subscribe(setFps);

    return () => {
      unsubscribe();
      fpsMonitor.stop();
    };
  }, [enabled]);

  return fps;
}

// For React import
import React from 'react';
