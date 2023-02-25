export type StreamHost = 'youtube' | 'meet' | 'twitch';

const map: Record<string, StreamHost> = {
  'youtube.com': 'youtube',
  'meet.google.com': 'meet',
  'twitch.tv': 'twitch',
};

export function getStreamProviderFromUrl(streamUrl: string) {
  const url = new URL(streamUrl);
  return map[url.host] || null;
}
