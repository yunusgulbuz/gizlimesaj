import React from 'react';
import type { TemplateFormPageProps } from './shared/form-page';
import type { TemplatePreviewPageProps } from './shared/preview-page';

import AffetBeniForm from './affet-beni/form';
import AffetBeniPreview from './affet-beni/preview';
import AffetBeniClassicForm from './affet-beni-classic/form';
import AffetBeniClassicPreview from './affet-beni-classic/preview';
import AffetBeniSignatureForm from './affet-beni-signature/form';
import AffetBeniSignaturePreview from './affet-beni-signature/preview';
import SeniSeviyorumForm from './seni-seviyorum/form';
import SeniSeviyorumPreview from './seni-seviyorum/preview';
import SeniSeviyorumTeenForm from './seni-seviyorum-teen/form';
import SeniSeviyorumTeenPreview from './seni-seviyorum-teen/preview';
import SeniSeviyorumPremiumForm from './seni-seviyorum-premium/form';
import SeniSeviyorumPremiumPreview from './seni-seviyorum-premium/preview';
import EvlilikTeklifiElegantForm from './evlilik-teklifi-elegant/form';
import EvlilikTeklifiElegantPreview from './evlilik-teklifi-elegant/preview';
import DogumGunuFunForm from './dogum-gunu-fun/form';
import DogumGunuFunPreview from './dogum-gunu-fun/preview';
import OzurDilerimClassicForm from './ozur-dilerim-classic/form';
import OzurDilerimClassicPreview from './ozur-dilerim-classic/preview';
import TesekkurAdultForm from './tesekkur-adult/form';
import TesekkurAdultPreview from './tesekkur-adult/preview';
import MutluYillarFunForm from './mutlu-yillar-fun/form';
import MutluYillarFunPreview from './mutlu-yillar-fun/preview';
import CikmaTeklifiForm from './cikma-teklifi/form';
import CikmaTeklifiPreview from './cikma-teklifi/preview';
import YilDonumuForm from './yil-donumu/form';
import YilDonumuPreview from './yil-donumu/preview';
import IsTebrigiForm from './is-tebrigi/form';
import IsTebrigiPreview from './is-tebrigi/preview';
import RomantikMesajElegantForm from './romantik-mesaj-elegant/form';
import RomantikMesajElegantPreview from './romantik-mesaj-elegant/preview';

export type TemplateFormComponent = (props: TemplateFormPageProps) => React.ReactElement;
export type TemplatePreviewComponent = (props: TemplatePreviewPageProps) => React.ReactElement;

interface TemplateEntry {
  slug: string;
  form: TemplateFormComponent;
  preview: TemplatePreviewComponent;
}

export const templateRegistry: Record<string, TemplateEntry> = {
  'affet-beni': {
    slug: 'affet-beni',
    form: AffetBeniForm,
    preview: AffetBeniPreview,
  },
  'affet-beni-classic': {
    slug: 'affet-beni-classic',
    form: AffetBeniClassicForm,
    preview: AffetBeniClassicPreview,
  },
  'affet-beni-signature': {
    slug: 'affet-beni-signature',
    form: AffetBeniSignatureForm,
    preview: AffetBeniSignaturePreview,
  },
  'seni-seviyorum': {
    slug: 'seni-seviyorum',
    form: SeniSeviyorumForm,
    preview: SeniSeviyorumPreview,
  },
  'seni-seviyorum-teen': {
    slug: 'seni-seviyorum-teen',
    form: SeniSeviyorumTeenForm,
    preview: SeniSeviyorumTeenPreview,
  },
  'seni-seviyorum-premium': {
    slug: 'seni-seviyorum-premium',
    form: SeniSeviyorumPremiumForm,
    preview: SeniSeviyorumPremiumPreview,
  },
  'evlilik-teklifi-elegant': {
    slug: 'evlilik-teklifi-elegant',
    form: EvlilikTeklifiElegantForm,
    preview: EvlilikTeklifiElegantPreview,
  },
  'dogum-gunu-fun': {
    slug: 'dogum-gunu-fun',
    form: DogumGunuFunForm,
    preview: DogumGunuFunPreview,
  },
  'ozur-dilerim-classic': {
    slug: 'ozur-dilerim-classic',
    form: OzurDilerimClassicForm,
    preview: OzurDilerimClassicPreview,
  },
  'tesekkur-adult': {
    slug: 'tesekkur-adult',
    form: TesekkurAdultForm,
    preview: TesekkurAdultPreview,
  },
  'mutlu-yillar-fun': {
    slug: 'mutlu-yillar-fun',
    form: MutluYillarFunForm,
    preview: MutluYillarFunPreview,
  },
  'yil-donumu': {
    slug: 'yil-donumu',
    form: YilDonumuForm,
    preview: YilDonumuPreview,
  },
  'cikma-teklifi': {
    slug: 'cikma-teklifi',
    form: CikmaTeklifiForm,
    preview: CikmaTeklifiPreview,
  },
  'is-tebrigi': {
    slug: 'is-tebrigi',
    form: IsTebrigiForm,
    preview: IsTebrigiPreview,
  },
  'romantik-mesaj-elegant': {
    slug: 'romantik-mesaj-elegant',
    form: RomantikMesajElegantForm,
    preview: RomantikMesajElegantPreview,
  },
};

export function getTemplateEntry(slug: string): TemplateEntry | null {
  return templateRegistry[slug] ?? null;
}

export { TemplateFormPageProps, TemplatePreviewPageProps };
export { templateConfigs, getTemplateConfig, getDefaultTextFields } from './shared/types';
export { default as TemplateFormPage } from './shared/form-page';
export { default as TemplatePreviewPage } from './shared/preview-page';
export { default as TemplateRenderer } from './shared/template-renderer';
