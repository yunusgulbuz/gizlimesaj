'use client';

import { useState } from 'react';
import TemplatePreviewPage, { TemplatePreviewPageProps } from '../shared/preview-page';
import PremiumModernTemplate from './components/PremiumModernTemplate';
import KlasikElegansTemplate from './components/KlasikElegansTemplate';
import MinimalistNeonTemplate from './components/MinimalistNeonTemplate';
import EglenceliInteraktifTemplate from './components/EglenceliInteraktifTemplate';

const designStyles = [
  {
    id: 'premium-modern',
    name: 'Premium Modern',
    description: '3D ve Parçacık Efekti',
    component: PremiumModernTemplate
  },
  {
    id: 'klasik-elegans',
    name: 'Klasik Elegans',
    description: 'Art Deco + Şampanya Köpüğü',
    component: KlasikElegansTemplate
  },
  {
    id: 'minimalist-neon',
    name: 'Minimalist Neon',
    description: 'Siberpunk Yılbaşı',
    component: MinimalistNeonTemplate
  },
  {
    id: 'eglenceli-interaktif',
    name: 'Eğlenceli & Interaktif',
    description: 'Mini Oyun: Hediye Avı',
    component: EglenceliInteraktifTemplate
  }
];

export default function MutluYillarFunPreview(props: TemplatePreviewPageProps) {
  const [selectedStyle, setSelectedStyle] = useState('premium-modern');
  
  // For now, we'll use the default preview page structure
  // The custom templates will be integrated through the template renderer system
  return <TemplatePreviewPage {...props} />;
}