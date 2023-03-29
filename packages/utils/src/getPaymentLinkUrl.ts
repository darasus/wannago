export function getPaymentLinkUrl({email}: {email: string | undefined}) {
  const url = new URL(`https://buy.stripe.com/test_cN2dTufl8dc29YkdQQ`);

  if (email) {
    url.searchParams.set(`prefilled_email`, email);
  }

  return url.toString();
}
