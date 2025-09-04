"use client";

import { useEffect, useState } from "react";

// Hook to detect if animations should be disabled for performance
export function usePerformanceMode() {
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    // Check for performance hints
    const checkPerformance = () => {
      // Check device memory (if available)
      const deviceMemory = (navigator as any).deviceMemory;
      const connectionSpeed = (navigator as any).connection?.effectiveType;
      
      // Low memory devices (< 4GB)
      const lowMemory = deviceMemory && deviceMemory < 4;
      
      // Slow connection
      const slowConnection = connectionSpeed && ['slow-2g', '2g', '3g'].includes(connectionSpeed);
      
      // Battery status (if available)
      const lowBattery = (navigator as any).getBattery?.()?.then?.((battery: any) => {
        return battery.level < 0.3 && !battery.charging;
      });

      setIsLowPerformance(lowMemory || slowConnection || lowBattery);
    };

    checkPerformance();
  }, []);

  return isLowPerformance;
}

// Utility to conditionally apply animations based on performance
export function withPerformanceCheck<T>(
  highPerformanceValue: T,
  lowPerformanceValue: T,
  isLowPerformance: boolean
): T {
  return isLowPerformance ? lowPerformanceValue : highPerformanceValue;
}

// Debounced resize hook for better performance
export function useDebouncedResize(delay: number = 100) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, delay);
    };

    // Set initial size
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [delay]);

  return size;
}
