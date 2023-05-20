interface Ticket {
  id: string;
  title: string;
  description?: string;
  price: string;
  maxQuantity: string;
}

export interface Form {
  title: string;
  startDate: string;
  description: string | null;
  endDate: string;
  address: string;
  maxNumberOfAttendees: number | null;
  featuredImageSrc: string | null;
  featuredImageHeight: number | null;
  featuredImageWidth: number | null;
  featuredImagePreviewSrc: string | null;
  tickets: Ticket[];
}
