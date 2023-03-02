import Head from 'next/head';
import React from 'react';
import {getBaseUrl} from 'utils';

interface Props {
  title?: string;
  description: string;
  imageSrc?: string;
  shortEventId?: string;
}

export const Meta: React.FC<Props> = ({
  title,
  description,
  imageSrc,
  shortEventId,
}) => {
  const baseUrl = getBaseUrl();
  const canonicalUrl = `${baseUrl}`;
  const actualTitle = title ? `${title} | WannaGo` : 'WannaGo';
  const imgSrc = imageSrc
    ? `${baseUrl}${imageSrc}`
    : `${baseUrl}/thumbnail.png`;
  const utl = shortEventId ? `${baseUrl}/e/${shortEventId}` : `${baseUrl}/`;

  return (
    <Head>
      <title>{actualTitle}</title>
      <meta name="title" content={actualTitle} />
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={utl} />
      <meta property="og:title" content={actualTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imgSrc} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={utl} />
      <meta property="twitter:title" content={actualTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imgSrc} />

      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
};
