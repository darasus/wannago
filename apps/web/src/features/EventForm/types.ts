export interface Form {
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  address: string;
  maxNumberOfAttendees: number | null;
  featuredImageSrc: string | null;
  featuredImageHeight: number | null;
  featuredImageWidth: number | null;
  featuredImagePreviewSrc: string | null;
}
