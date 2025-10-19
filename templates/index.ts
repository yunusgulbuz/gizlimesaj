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
import TesekkurEderimAskimForm from './tesekkur-ederim-askim/form';
import TesekkurEderimAskimPreview from './tesekkur-ederim-askim/preview';
import MutluYillarCelebrationForm from './mutlu-yillar-celebration/form';
import MutluYillarCelebrationPreview from './mutlu-yillar-celebration/preview';
import MutluYillarFunForm from './mutlu-yillar-fun/form';
import MutluYillarFunPreview from './mutlu-yillar-fun/preview';
import CikmaTeklifiForm from './cikma-teklifi/form';
import CikmaTeklifiPreview from './cikma-teklifi/preview';
import YilDonumuForm from './yil-donumu/form';
import YilDonumuPreview from './yil-donumu/preview';
import YilDonumuLuxeForm from './yil-donumu-luxe/form';
import YilDonumuLuxePreview from './yil-donumu-luxe/preview';
import IsTebrigiForm from './is-tebrigi/form';
import IsTebrigiPreview from './is-tebrigi/preview';
import YeniIsTerfiTebrigiForm from './yeni-is-terfi-tebrigi/form';
import YeniIsTerfiTebrigiPreview from './yeni-is-terfi-tebrigi/preview';
import RomantikMesajElegantForm from './romantik-mesaj-elegant/form';
import RomantikMesajElegantPreview from './romantik-mesaj-elegant/preview';
import EglenceliOyunluMesajlarForm from './eglenceli-oyunlu-mesajlar/form';
import EglenceliOyunluMesajlarPreview from './eglenceli-oyunlu-mesajlar/preview';
import SurprizRandevuDavetiForm from './surpriz-randevu-daveti/form';
import SurprizRandevuDavetiPreview from './surpriz-randevu-daveti/preview';
import DogumGunuKutlamaForm from './dogum-gunu-kutlama/form';
import DogumGunuKutlamaPreview from './dogum-gunu-kutlama/preview';
import CumaTebrigiForm from './cuma-tebrigi/form';
import CumaTebrigiPreview from './cuma-tebrigi/preview';
import KandilTebrigiForm from './kandil-tebrigi/form';
import KandilTebrigiPreview from './kandil-tebrigi/preview';
import KandilTebrigiPremiumForm from './kandil-tebrigi-premium/form';
import KandilTebrigiPremiumPreview from './kandil-tebrigi-premium/preview';
import SevgililerGunuTebrigiForm from './sevgililer-gunu-tebrigi/form';
import SevgililerGunuTebrigiPreview from './sevgililer-gunu-tebrigi/preview';
import SakaYaptimForm from './saka-yaptim/form';
import SakaYaptimPreview from './saka-yaptim/preview';
import MezuniyetTebrigiForm from './mezuniyet-tebrigi/form';
import MezuniyetTebrigiPreview from './mezuniyet-tebrigi/preview';

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
  'tesekkur-ederim-askim': {
    slug: 'tesekkur-ederim-askim',
    form: TesekkurEderimAskimForm,
    preview: TesekkurEderimAskimPreview,
  },
  'mutlu-yillar-celebration': {
    slug: 'mutlu-yillar-celebration',
    form: MutluYillarCelebrationForm,
    preview: MutluYillarCelebrationPreview,
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
  'yil-donumu-luxe': {
    slug: 'yil-donumu-luxe',
    form: YilDonumuLuxeForm,
    preview: YilDonumuLuxePreview,
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
  'yeni-is-terfi-tebrigi': {
    slug: 'yeni-is-terfi-tebrigi',
    form: YeniIsTerfiTebrigiForm,
    preview: YeniIsTerfiTebrigiPreview,
  },
  'romantik-mesaj-elegant': {
    slug: 'romantik-mesaj-elegant',
    form: RomantikMesajElegantForm,
    preview: RomantikMesajElegantPreview,
  },
  'eglenceli-oyunlu-mesajlar': {
    slug: 'eglenceli-oyunlu-mesajlar',
    form: EglenceliOyunluMesajlarForm,
    preview: EglenceliOyunluMesajlarPreview,
  },
  'surpriz-randevu-daveti': {
    slug: 'surpriz-randevu-daveti',
    form: SurprizRandevuDavetiForm,
    preview: SurprizRandevuDavetiPreview,
  },
  'dogum-gunu-kutlama': {
    slug: 'dogum-gunu-kutlama',
    form: DogumGunuKutlamaForm,
    preview: DogumGunuKutlamaPreview,
  },
  'cuma-tebrigi': {
    slug: 'cuma-tebrigi',
    form: CumaTebrigiForm,
    preview: CumaTebrigiPreview,
  },
  'kandil-tebrigi': {
    slug: 'kandil-tebrigi',
    form: KandilTebrigiForm,
    preview: KandilTebrigiPreview,
  },
  'kandil-tebrigi-premium': {
    slug: 'kandil-tebrigi-premium',
    form: KandilTebrigiPremiumForm,
    preview: KandilTebrigiPremiumPreview,
  },
  'sevgililer-gunu-tebrigi': {
    slug: 'sevgililer-gunu-tebrigi',
    form: SevgililerGunuTebrigiForm,
    preview: SevgililerGunuTebrigiPreview,
  },
  'saka-yaptim': {
    slug: 'saka-yaptim',
    form: SakaYaptimForm,
    preview: SakaYaptimPreview,
  },
  'mezuniyet-tebrigi': {
    slug: 'mezuniyet-tebrigi',
    form: MezuniyetTebrigiForm,
    preview: MezuniyetTebrigiPreview,
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
