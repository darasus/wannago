export type StreamHost = 'youtube' | 'google' | 'twitch';

const map: Record<string, StreamHost> = {
  'youtube.com': 'youtube',
  'google.com': 'google',
  'twitch.tv': 'twitch',
};

export function getStreamProviderFromUrl(streamUrl: string) {
  const url = new URL(streamUrl);
  return map[url.host] || null;
}
