export interface JoinForm {
  email: string;
  firstName: string;
  lastName: string;
  hasPlusOne: boolean;
}

export interface AdminInviteForm {
  email: string;
  firstName: string;
  lastName: string;
}

export interface ContactForm {
  subject: string;
  message: string;
  firstName: string;
  lastName: string;
  email: string;
}
