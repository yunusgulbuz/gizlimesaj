'use client';

import dynamic from 'next/dynamic';

const TemplateCardPreview = dynamic(
  () => import('./template-card-preview'),
  { ssr: false }
);

export default TemplateCardPreview;
