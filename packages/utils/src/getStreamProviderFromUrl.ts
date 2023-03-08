export type StreamHost = 'youtube' | 'meet' | 'twitch';

const map: Record<string, StreamHost> = {
  'youtube.com': 'youtube',
  'meet.google.com': 'meet',
  'twitch.tv': 'twitch',
};

export function getStreamProviderFromUrl(streamUrl: string) {
  try {
    const url = new URL(streamUrl);
    let streamHost: StreamHost | null = null;

    for (const key in map) {
      if (url.host.includes(key)) {
        streamHost = map[key];
        break;
      }
    }
    return streamHost;
  } catch (error) {
    return null;
  }
}
