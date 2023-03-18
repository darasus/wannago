import Head from 'next/head';
import React from 'react';
import {getBaseUrl} from 'utils';

interface Props {
  title?: string;
  description: string;
  imageSrc?: string | null;
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
  const url = shortEventId ? `${baseUrl}/e/${shortEventId}` : `${baseUrl}/`;

  return (
    <Head>
      <title>{actualTitle}</title>
      <meta name="title" content={actualTitle} />
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={actualTitle} />
      <meta property="og:description" content={description} />
      {imageSrc && <meta property="og:image" content={imageSrc} />}

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={actualTitle} />
      <meta property="twitter:description" content={description} />
      {imageSrc && <meta property="twitter:image" content={imageSrc} />}

      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
};
