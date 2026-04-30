
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = '$') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === '$' ? 'USD' : currency === '€' ? 'EUR' : currency === '£' ? 'GBP' : 'INR',
    minimumFractionDigits: 2,
  }).format(value).replace(/USD|EUR|GBP|INR/g, currency);
}
