import { createHash } from 'crypto';

// Base64 encoding and decoding
export function fromB64Url(input: string): Buffer {
  // Convert base64url to base64 by replacing URL-safe characters and adding padding
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64');
}

export function toB64Url(buffer: Buffer): string {
  // Convert buffer to base64, then replace URL-unsafe characters and remove padding
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''); // Remove any trailing '='
}

export function b64UrlToUtf8(input: string): string {
  return fromB64Url(input).toString('utf8');
}

export function utf8ToB64Url(input: string): string {
  return toB64Url(Buffer.from(input, 'utf8'));
}

export function b64UrlToHex(input: string): string {
  return fromB64Url(input).toString('hex');
}

export function hexToB64Url(input: string): string {
  return toB64Url(Buffer.from(input, 'hex'));
}

export function toB64UrlOfSHA256(input: Buffer): string {
  return toB64Url(createHash('sha256').update(input).digest());
}
