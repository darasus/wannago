export interface Form {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  address?: string;
  streamUrl?: string;
  maxNumberOfAttendees: number;
  featuredImageSrc: string;
  featuredImageHeight: number;
  featuredImageWidth: number;
  featuredImagePreviewSrc: string;
  type: 'online' | 'offline';
}
