export default function shortToken(token?: string): string {
  return token ? token.substring(0, 6) : '';
}
