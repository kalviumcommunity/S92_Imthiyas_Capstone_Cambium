import { BadRequestException } from '@nestjs/common';
import * as dns from 'dns/promises';
import * as net from 'net';

const PRIVATE_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'metadata.google.internal',
  '169.254.169.254',
]);

/**
 * Checks whether an IPv4 or IPv6 address belongs to loopback, link-local,
 * cloud metadata, multicast, or RFC1918/RFC4193 private ranges.
 */
export function isPrivateOrReservedIp(ip: string): boolean {
  const clean = ip.replace(/^\[|\]$/g, '').split('%')[0];
  const version = net.isIP(clean);
  if (!version) return true;

  if (version === 4) {
    const octets = clean.split('.').map(Number);
    if (octets.length !== 4 || octets.some((n) => Number.isNaN(n) || n < 0 || n > 255)) {
      return true;
    }
    const [a, b] = octets;
    if (a === 0) return true; // 0.0.0.0/8
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 127) return true; // 127.0.0.0/8 loopback
    if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local & cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 CGNAT
    if (a >= 224) return true; // multicast / reserved
    return false;
  }

  // IPv6 checks
  const lower = clean.toLowerCase();
  if (lower === '::1' || lower === '::') return true;
  if (lower.startsWith('::ffff:')) {
    return isPrivateOrReservedIp(lower.slice(7));
  }
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true; // fc00::/7 ULA
  if (lower.startsWith('fe80') || lower.startsWith('ff')) return true; // link-local / multicast
  return false;
}

/**
 * Validates that an external URL is strictly HTTP(S), not targeting private/internal/metadata
 * network space, and resolves DNS to public IP addresses before outbound fetch.
 */
export async function validateSafeExternalUrl(
  rawUrl: string,
  options: { allowHttp?: boolean; resolveDns?: boolean } = {},
): Promise<URL> {
  if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.length > 2048) {
    throw new BadRequestException('Invalid external URL');
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    throw new BadRequestException('Malformed external URL');
  }

  const allowedProtocols = options.allowHttp ? ['https:', 'http:'] : ['https:'];
  if (!allowedProtocols.includes(parsed.protocol)) {
    throw new BadRequestException(`Disallowed URL protocol: ${parsed.protocol}`);
  }

  if (parsed.username || parsed.password) {
    throw new BadRequestException('Embedded URL credentials are not permitted');
  }

  const hostname = parsed.hostname.toLowerCase();
  if (
    !hostname ||
    PRIVATE_HOSTNAMES.has(hostname) ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal')
  ) {
    throw new BadRequestException('Blocked internal or reserved hostname target (SSRF protection)');
  }

  if (net.isIP(hostname) && isPrivateOrReservedIp(hostname)) {
    throw new BadRequestException('Blocked private/loopback/metadata IP target (SSRF protection)');
  }

  if (options.resolveDns !== false) {
    try {
      const addresses = await dns.lookup(hostname, { all: true });
      if (!addresses || addresses.length === 0) {
        throw new BadRequestException('Target hostname could not be resolved safely');
      }
      for (const addr of addresses) {
        if (isPrivateOrReservedIp(addr.address)) {
          throw new BadRequestException(
            'Resolved destination IP lies in blocked private/metadata range (SSRF protection)',
          );
        }
      }
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new BadRequestException('Unable to safely verify destination DNS resolution');
    }
  }

  return parsed;
}
