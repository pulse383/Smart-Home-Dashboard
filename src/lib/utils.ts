import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPower(watts: number): string {
  if (watts >= 1000) {
    return `${(watts / 1000).toFixed(1)} kW`;
  }
  return `${watts} W`;
}

export function formatTemperature(celsius: number): string {
  return `${celsius}°C`;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function getAQILevel(aqi: number): 'good' | 'moderate' | 'poor' | 'hazardous' {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'poor';
  return 'hazardous';
}

export function getAQIColor(level: 'good' | 'moderate' | 'poor' | 'hazardous'): string {
  const colors = {
    good: '#22c55e',
    moderate: '#eab308',
    poor: '#f97316',
    hazardous: '#ef4444',
  };
  return colors[level];
}

export function calculateEnergyCost(kwh: number, ratePerKwh: number = 0.12): number {
  return kwh * ratePerKwh;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export function getStatusColor(status: 'active' | 'inactive'): string {
  return status === 'active' ? 'bg-green-500' : 'bg-gray-400';
}

export function getDeviceIcon(type: DeviceType): string {
  const icons: Record<DeviceType, string> = {
    tv: '📺',
    speaker: '🔊',
    router: '📡',
    wifi: '📶',
    heater: '🔥',
    socket: '🔌',
    lamp: '💡',
  };
  return icons[type];
}

type DeviceType = 'tv' | 'speaker' | 'router' | 'wifi' | 'heater' | 'socket' | 'lamp';
