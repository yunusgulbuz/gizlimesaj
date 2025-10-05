'use client';

import { useState, useEffect } from 'react';
import { Heart, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SeniSeviyorumTemplate from '../seni-seviyorum/components/SeniSeviyorumTemplate';
import AffetBeniTemplate from '../affet-beni/components/AffetBeniTemplate';
import EglenceliSeniSeviyorumTemplate from '../seni-seviyorum-teen/components/EglenceliSeniSeviyorumTemplate';
import SeniSeviyorumPremiumTemplate from '../seni-seviyorum-premium/components/SeniSeviyorumPremiumTemplate';
import EvlilikTeklifiTemplate from '../evlilik-teklifi-elegant/components/EvlilikTeklifiTemplate';
import DogumGunuStandardTemplate from '../dogum-gunu/components/DogumGunuStandardTemplate';
import DogumGunuFunTemplate from '../dogum-gunu-fun/components/DogumGunuFunTemplate';
import OzurDilerimClassicTemplate from '../ozur-dilerim-classic/components/OzurDilerimClassicTemplate';
import AffetBeniSignatureTemplate from '../affet-beni-signature/components/AffetBeniSignatureTemplate';
import PremiumModernTesekkur from '../tesekkur-adult/components/PremiumModernTesekkur';
import KlasikElegansTesekkur from '../tesekkur-adult/components/KlasikElegansTesekkur';
import MinimalistNeonTesekkur from '../tesekkur-adult/components/MinimalistNeonTesekkur';
import EglenceliInteraktifTesekkur from '../tesekkur-adult/components/EglenceliInteraktifTesekkur';
import NeonSoftGlowThanks from '../tesekkur-ederim-askim/components/NeonSoftGlowThanks';
import LetterRoseThanks from '../tesekkur-ederim-askim/components/LetterRoseThanks';
import PureLoveMinimalThanks from '../tesekkur-ederim-askim/components/PureLoveMinimalThanks';
import HeartBubblesThanks from '../tesekkur-ederim-askim/components/HeartBubblesThanks';
import HolographicCelebration from '../mutlu-yillar-celebration/components/HolographicCelebration';
import GoldenMidnight from '../mutlu-yillar-celebration/components/GoldenMidnight';
import PureNewBeginning from '../mutlu-yillar-celebration/components/PureNewBeginning';
import FireworkParty from '../mutlu-yillar-celebration/components/FireworkParty';
import PremiumModernTemplate from '../mutlu-yillar-fun/components/PremiumModernTemplate';
import KlasikElegansTemplate from '../mutlu-yillar-fun/components/KlasikElegansTemplate';
import MinimalistNeonTemplate from '../mutlu-yillar-fun/components/MinimalistNeonTemplate';
import EglenceliInteraktifTemplate from '../mutlu-yillar-fun/components/EglenceliInteraktifTemplate';
import CikmaTeklifiTemplate from '../cikma-teklifi/components/CikmaTeklifiTemplate';
import ModernTimelineAnniversary from '../yil-donumu/components/ModernTimelineAnniversary';
import ClassicMemoryBoxTemplate from '../yil-donumu/components/ClassicMemoryBoxTemplate';
import MinimalistSecretMessage from '../yil-donumu/components/MinimalistSecretMessage';
import InteractiveQuizCelebration from '../yil-donumu/components/InteractiveQuizCelebration';
import AnniversaryLuxeTemplate from '../yil-donumu-luxe/components/AnniversaryLuxeTemplate';
import ModernCorporateCongrats from '../is-tebrigi/components/ModernCorporateCongrats';
import ClassicPrestigeCertificate from '../is-tebrigi/components/ClassicPrestigeCertificate';
import MinimalistProfessionalCard from '../is-tebrigi/components/MinimalistProfessionalCard';
import PremiumDynamicCelebration from '../is-tebrigi/components/PremiumDynamicCelebration';
import NeonGlowLove from '../romantik-mesaj-elegant/components/NeonGlowLove';
import RomanticLetterScene from '../romantik-mesaj-elegant/components/RomanticLetterScene';
import PureLoveMinimal from '../romantik-mesaj-elegant/components/PureLoveMinimal';
import HeartAdventureInteractive from '../romantik-mesaj-elegant/components/HeartAdventureInteractive';
import SoftGlassInvitation from '../surpriz-randevu-daveti/components/SoftGlassInvitation';
import RomantikAksamInvitation from '../surpriz-randevu-daveti/components/RomantikAksamInvitation';
import CleanRomanticPlan from '../surpriz-randevu-daveti/components/CleanRomanticPlan';
import HiddenSurpriseGame from '../surpriz-randevu-daveti/components/HiddenSurpriseGame';
import PastelGradientCelebration from '../dogum-gunu-kutlama/components/PastelGradientCelebration';
import ElegantGoldInvitation from '../dogum-gunu-kutlama/components/ElegantGoldInvitation';
import SimpleJoyCard from '../dogum-gunu-kutlama/components/SimpleJoyCard';
import InteractivePartyMode from '../dogum-gunu-kutlama/components/InteractivePartyMode';
import KlasikAltinIsikli from '../kandil-tebrigi/components/KlasikAltinIsikli';
import ModernSoftGlow from '../kandil-tebrigi/components/ModernSoftGlow';
import MinimalistGeceNur from '../kandil-tebrigi/components/MinimalistGeceNur';
import SanatsalGoldInk from '../kandil-tebrigi/components/SanatsalGoldInk';
import type { TemplateTextFields } from './types';

interface TemplateRendererProps {
  template: {
    id: string;
    slug: string;
    title: string;
    audience: 'teen' | 'adult' | 'classic' | 'fun' | 'elegant' | string[];
    bg_audio_url: string | null;
  };
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist' | 'eglenceli';
  isPreview?: boolean;
  creatorName?: string;
  textFields?: TemplateTextFields;
  shortId?: string;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

export default function TemplateRenderer({
  template,
  recipientName,
  message,
  designStyle,
  isPreview = false,
  creatorName,
  textFields,
  shortId,
  isEditable = false,
  onTextFieldChange
}: TemplateRendererProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (template.bg_audio_url && !isPreview) {
      const audioElement = new Audio(template.bg_audio_url);
      audioElement.loop = true;
      setAudio(audioElement);
      
      return () => {
        audioElement.pause();
        audioElement.src = '';
      };
    }
  }, [template.bg_audio_url, isPreview]);

  const toggleAudio = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getTemplateComponent = () => {
    switch (template.slug) {
      case 'seni-seviyorum-teen':
        if (designStyle === 'eglenceli') {
          return <EglenceliSeniSeviyorumTemplate
          recipientName={recipientName}
          message={message}
          creatorName={creatorName}
          shortId={shortId}
          isEditable={isEditable}
          onTextFieldChange={onTextFieldChange}
          textFields={textFields}
        />;
        }
        return <SeniSeviyorumTemplate
          recipientName={recipientName}
          message={message}
          designStyle={designStyle as 'modern' | 'classic' | 'minimalist'}
          creatorName={creatorName}
          textFields={textFields}
          isEditable={isEditable}
          onTextFieldChange={onTextFieldChange}
        />;
      case 'seni-seviyorum-premium':
        return <SeniSeviyorumPremiumTemplate
          recipientName={recipientName}
          message={message}
          designStyle={designStyle}
          creatorName={creatorName}
          textFields={textFields}
          isEditable={isEditable}
          onTextFieldChange={onTextFieldChange}
        />;
      case 'affet-beni':
      case 'affet-beni-classic':
        return <AffetBeniTemplate
          recipientName={recipientName}
          message={message}
          designStyle={designStyle}
          creatorName={creatorName}
          textFields={textFields}
          isEditable={isEditable}
          onTextFieldChange={onTextFieldChange}
        />;
      case 'affet-beni-signature':
        return <AffetBeniSignatureTemplate
          recipientName={recipientName}
          message={message}
          designStyle={designStyle}
          creatorName={creatorName}
          textFields={textFields}
          isEditable={isEditable}
          onTextFieldChange={onTextFieldChange}
        />;
      case 'evlilik-teklifi-elegant':
        return <EvlilikTeklifiTemplate
          recipientName={recipientName}
          message={message}
          designStyle={designStyle as 'modern' | 'classic' | 'minimalist' | 'eglenceli'}
          creatorName={creatorName}
          textFields={textFields}
          shortId={shortId}
          isEditable={isEditable}
          onTextFieldChange={onTextFieldChange}
        />;
      case 'dogum-gunu':
        return <DogumGunuStandardTemplate
          recipientName={recipientName}
          message={message}
          designStyle={designStyle as 'modern' | 'classic' | 'minimalist' | 'eglenceli'}
          creatorName={creatorName}
          textFields={textFields}
          isEditable={isEditable}
          onTextFieldChange={onTextFieldChange}
        />;
      case 'dogum-gunu-fun':
        return <DogumGunuFunTemplate
          recipientName={recipientName}
          message={message}
          designStyle={designStyle as 'modern' | 'classic' | 'minimalist' | 'eglenceli'}
          creatorName={creatorName}
          textFields={textFields}
          isEditable={isEditable}
          onTextFieldChange={onTextFieldChange}
        />;
      case 'tesekkur':
        return <TesekkurTemplate 
          recipientName={recipientName} 
          message={message} 
          designStyle={designStyle as 'modern' | 'classic' | 'minimalist'}
          creatorName={creatorName}
        />;
      case 'tesekkur-ederim-askim':
        switch (designStyle) {
          case 'modern':
            return (
              <NeonSoftGlowThanks
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'classic':
            return (
              <LetterRoseThanks
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'minimalist':
            return (
              <PureLoveMinimalThanks
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'eglenceli':
            return (
              <HeartBubblesThanks
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          default:
            return (
              <NeonSoftGlowThanks
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
        }
      case 'surpriz-randevu-daveti':
        switch (designStyle) {
          case 'modern':
            return (
              <SoftGlassInvitation
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'classic':
            return (
              <RomantikAksamInvitation
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'minimalist':
            return (
              <CleanRomanticPlan
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'eglenceli':
            return (
              <HiddenSurpriseGame
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          default:
            return (
              <SoftGlassInvitation
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
        }
      case 'tesekkur-adult':
        switch (designStyle) {
          case 'modern':
            return <PremiumModernTesekkur
              recipientName={recipientName}
              message={message}
              creatorName={creatorName}
              textFields={textFields}
              isEditable={isEditable}
              onTextFieldChange={onTextFieldChange}
            />;
          case 'classic':
            return <KlasikElegansTesekkur
              recipientName={recipientName}
              message={message}
              creatorName={creatorName}
              textFields={textFields}
              isEditable={isEditable}
              onTextFieldChange={onTextFieldChange}
            />;
          case 'minimalist':
            return <MinimalistNeonTesekkur
              recipientName={recipientName}
              message={message}
              creatorName={creatorName}
              textFields={textFields}
              isEditable={isEditable}
              onTextFieldChange={onTextFieldChange}
            />;
          case 'eglenceli':
            return <EglenceliInteraktifTesekkur
              recipientName={recipientName}
              message={message}
              creatorName={creatorName}
              textFields={textFields}
              isEditable={isEditable}
              onTextFieldChange={onTextFieldChange}
            />;
          default:
            return <PremiumModernTesekkur
              recipientName={recipientName}
              message={message}
              creatorName={creatorName}
              textFields={textFields}
              isEditable={isEditable}
              onTextFieldChange={onTextFieldChange}
            />;
        }
      case 'ozur-dilerim':
      case 'ozur-dilerim-classic':
        return <OzurDilerimClassicTemplate
          recipientName={recipientName}
          message={message}
          designStyle={designStyle as 'modern' | 'classic' | 'minimalist' | 'eglenceli'}
          creatorName={creatorName}
          textFields={textFields}
          isEditable={isEditable}
          onTextFieldChange={onTextFieldChange}
        />;
      case 'mutlu-yillar':
        return <MutluYillarTemplate 
          recipientName={recipientName} 
          message={message} 
          designStyle={designStyle as 'modern' | 'classic' | 'minimalist'}
          creatorName={creatorName}
        />;
      case 'mutlu-yillar-celebration':
        switch (designStyle) {
          case 'modern':
            return (
              <HolographicCelebration
                recipientName={recipientName}
                message={textFields?.message || message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'classic':
            return (
              <GoldenMidnight
                recipientName={recipientName}
                message={textFields?.message || message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'minimalist':
            return (
              <PureNewBeginning
                recipientName={recipientName}
                message={textFields?.message || message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'eglenceli':
            return (
              <FireworkParty
                recipientName={recipientName}
                message={textFields?.message || message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          default:
            return (
              <HolographicCelebration
                recipientName={recipientName}
                message={textFields?.message || message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
        }
      case 'mutlu-yillar-fun':
        switch (designStyle) {
          case 'modern':
            return <PremiumModernTemplate
              recipientName={recipientName}
              mainMessage={textFields?.mainMessage || message}
              wishMessage={textFields?.wishMessage}
              footerMessage={textFields?.footerMessage}
              creatorName={creatorName}
              isEditable={isEditable}
              onTextFieldChange={onTextFieldChange}
            />;
          case 'classic':
            return <KlasikElegansTemplate
              recipientName={recipientName}
              mainMessage={textFields?.mainMessage || message}
              wishMessage={textFields?.wishMessage}
              footerMessage={textFields?.footerMessage}
              creatorName={creatorName}
              isEditable={isEditable}
              onTextFieldChange={onTextFieldChange}
            />;
          case 'minimalist':
            return <MinimalistNeonTemplate
              recipientName={recipientName}
              mainMessage={textFields?.mainMessage || message}
              wishMessage={textFields?.wishMessage}
              footerMessage={textFields?.footerMessage}
              creatorName={creatorName}
              isEditable={isEditable}
              onTextFieldChange={onTextFieldChange}
            />;
          case 'eglenceli':
            return <EglenceliInteraktifTemplate
              recipientName={recipientName}
              mainMessage={textFields?.mainMessage || message}
              wishMessage={textFields?.wishMessage}
              footerMessage={textFields?.footerMessage}
              creatorName={creatorName}
              shortId={shortId}
              isEditable={isEditable}
              onTextFieldChange={onTextFieldChange}
            />;
          default:
            return <PremiumModernTemplate
              recipientName={recipientName}
              mainMessage={textFields?.mainMessage || message}
              wishMessage={textFields?.wishMessage}
              footerMessage={textFields?.footerMessage}
              creatorName={creatorName}
              isEditable={isEditable}
              onTextFieldChange={onTextFieldChange}
            />;
        }
      case 'yil-donumu-luxe':
        return (
          <AnniversaryLuxeTemplate
            recipientName={recipientName}
            message={message}
            designStyle={designStyle}
            creatorName={creatorName}
            textFields={textFields}
            isEditable={isEditable}
            onTextFieldChange={onTextFieldChange}
          />
        );
      case 'yil-donumu':
        switch (designStyle) {
          case 'modern':
            return (
              <ModernTimelineAnniversary
                recipientName={recipientName}
                creatorName={creatorName}
                textFields={textFields}
                primaryMessage={textFields?.mainMessage || message}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'classic':
            return (
              <ClassicMemoryBoxTemplate
                recipientName={recipientName}
                creatorName={creatorName}
                textFields={textFields}
                primaryMessage={textFields?.mainMessage || message}
                shortId={shortId}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'minimalist':
            return (
              <MinimalistSecretMessage
                recipientName={recipientName}
                creatorName={creatorName}
                textFields={textFields}
                primaryMessage={textFields?.mainMessage || message}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'eglenceli':
            return (
              <InteractiveQuizCelebration
                recipientName={recipientName}
                creatorName={creatorName}
                textFields={textFields}
                primaryMessage={textFields?.mainMessage || message}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          default:
            return (
              <ModernTimelineAnniversary
                recipientName={recipientName}
                creatorName={creatorName}
                textFields={textFields}
                primaryMessage={textFields?.mainMessage || message}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
        }
      case 'is-tebrigi':
        switch (designStyle) {
          case 'modern':
            return (
              <ModernCorporateCongrats
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'classic':
            return (
              <ClassicPrestigeCertificate
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'minimalist':
            return (
              <MinimalistProfessionalCard
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                shortId={shortId}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'eglenceli':
            return (
              <PremiumDynamicCelebration
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                shortId={shortId}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          default:
            return (
              <ModernCorporateCongrats
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
        }
      case 'romantik-mesaj-elegant':
        switch (designStyle) {
          case 'modern':
            return (
              <NeonGlowLove
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'classic':
            return (
              <RomanticLetterScene
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'minimalist':
            return (
              <PureLoveMinimal
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'eglenceli':
            return (
              <HeartAdventureInteractive
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          default:
            return (
              <NeonGlowLove
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
        }
      case 'dogum-gunu-kutlama':
        switch (designStyle) {
          case 'modern':
            return (
              <PastelGradientCelebration
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'classic':
            return (
              <ElegantGoldInvitation
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'minimalist':
            return (
              <SimpleJoyCard
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'eglenceli':
            return (
              <InteractivePartyMode
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          default:
            return (
              <PastelGradientCelebration
                recipientName={recipientName}
                message={message}
                creatorName={creatorName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
        }
      case 'cikma-teklifi':
        return (
          <CikmaTeklifiTemplate
            recipientName={recipientName}
            message={message}
            designStyle={designStyle as 'modern' | 'classic' | 'minimalist' | 'eglenceli'}
            creatorName={creatorName}
            textFields={textFields}
            shortId={shortId}
            isEditable={isEditable}
            onTextFieldChange={onTextFieldChange}
          />
        );
      case 'kandil-tebrigi':
        switch (designStyle) {
          case 'classic':
            return (
              <KlasikAltinIsikli
                recipientName={recipientName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'modern':
            return (
              <ModernSoftGlow
                recipientName={recipientName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'minimalist':
            return (
              <MinimalistGeceNur
                recipientName={recipientName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          case 'eglenceli':
            return (
              <SanatsalGoldInk
                recipientName={recipientName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
          default:
            return (
              <KlasikAltinIsikli
                recipientName={recipientName}
                textFields={textFields}
                isEditable={isEditable}
                onTextFieldChange={onTextFieldChange}
              />
            );
        }
      case 'romantik-mesaj':
        return <RomantikMesajTemplate 
          recipientName={recipientName} 
          message={message} 
          designStyle={designStyle as 'modern' | 'classic' | 'minimalist'}
          creatorName={creatorName}
        />;
      default:
        return <DefaultTemplate 
          recipientName={recipientName} 
          message={message} 
          designStyle={designStyle as 'modern' | 'classic' | 'minimalist'}
          title={template.title}
          creatorName={creatorName}
        />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {getTemplateComponent()}
    </div>
  );
  // Fallback
  return <div>Tasarım stili bulunamadı</div>;
}

function TesekkurTemplate({ recipientName, message, designStyle, creatorName }: {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist';
  creatorName?: string;
}) {
  const styles = getDesignStyles(designStyle);
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${styles.background}`}>
      <div className={`max-w-2xl mx-auto p-8 text-center ${styles.container}`}>
        {/* Creator Name Display - Added to Top */}
        {creatorName && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Hazırlayan: {creatorName}
            </p>
          </div>
        )}
        
        <div className="mb-8">
          <div className="text-6xl mb-4">🙏</div>
          <h1 className={`${styles.titleSize} font-bold ${styles.titleColor} mb-4`}>
            {recipientName ? `${recipientName},` : 'Değerli İnsan,'}
          </h1>
          <h2 className={`${styles.subtitleSize} ${styles.subtitleColor} mb-8`}>
            Teşekkür Ederim 🌟
          </h2>
        </div>
        
        <div className={`${styles.messageContainer} p-6 rounded-lg mb-8`}>
          <p className={`${styles.messageSize} ${styles.messageColor} leading-relaxed`}>
            {message || "Bana gösterdiğin destek ve anlayış için çok teşekkür ederim. Senin gibi değerli insanların varlığı hayatımı çok daha anlamlı kılıyor."}
          </p>
        </div>
        
        <div className="flex justify-center space-x-4 text-3xl">
          <span>🌹</span>
          <span>💝</span>
          <span>🌟</span>
        </div>
      </div>
    </div>
  );
}

function OzurDilerimTemplate({ recipientName, message, designStyle, creatorName }: {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist';
  creatorName?: string;
}) {
  const styles = getDesignStyles(designStyle);
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${styles.background}`}>
      <div className={`max-w-2xl mx-auto p-8 text-center ${styles.container}`}>
        {/* Creator Name Display - Added to Top */}
        {creatorName && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Hazırlayan: {creatorName}
            </p>
          </div>
        )}
        
        <div className="mb-8">
          <div className="text-6xl mb-4">😔</div>
          <h1 className={`${styles.titleSize} font-bold ${styles.titleColor} mb-4`}>
            {recipientName ? `${recipientName},` : 'Sevgili Arkadaşım,'}
          </h1>
          <h2 className={`${styles.subtitleSize} ${styles.subtitleColor} mb-8`}>
            Özür Dilerim 💙
          </h2>
        </div>
        
        <div className={`${styles.messageContainer} p-6 rounded-lg mb-8`}>
          <p className={`${styles.messageSize} ${styles.messageColor} leading-relaxed`}>
            {message || "Yaptığım hata için gerçekten çok üzgünüm. Seni kırdığım için kendimi affetmiyorum. Umarım beni anlayışla karşılar ve özrümü kabul edersin."}
          </p>
        </div>
        
        <div className="text-4xl">🕊️</div>
      </div>
    </div>
  );
}

function MutluYillarTemplate({ recipientName, message, designStyle, creatorName }: {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist';
  creatorName?: string;
}) {
  const styles = getDesignStyles(designStyle);
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${styles.background}`}>
      <div className={`max-w-2xl mx-auto p-8 text-center ${styles.container}`}>
        {/* Creator Name Display - Added to Top */}
        {creatorName && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Hazırlayan: {creatorName}
            </p>
          </div>
        )}
        
        <div className="mb-8">
          <div className="text-6xl mb-4">🎊</div>
          <h1 className={`${styles.titleSize} font-bold ${styles.titleColor} mb-4`}>
            {recipientName ? `${recipientName},` : 'Sevgili Dostum,'}
          </h1>
          <h2 className={`${styles.subtitleSize} ${styles.subtitleColor} mb-8`}>
            Mutlu Yıllar! ✨
          </h2>
        </div>
        
        <div className={`${styles.messageContainer} p-6 rounded-lg mb-8`}>
          <p className={`${styles.messageSize} ${styles.messageColor} leading-relaxed`}>
            {message || "Yeni yıl yeni umutlar, yeni başlangıçlar demek. Bu yıl sana sağlık, mutluluk ve başarı getirsin. Mutlu yıllar!"}
          </p>
        </div>
        
        <div className="flex justify-center space-x-4 text-3xl">
          <span>🎆</span>
          <span>🥂</span>
          <span>🎊</span>
          <span>✨</span>
        </div>
      </div>
    </div>
  );
}

function RomantikMesajTemplate({ recipientName, message, designStyle, creatorName }: {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist';
  creatorName?: string;
}) {
  const styles = getDesignStyles(designStyle);
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${styles.background}`}>
      <div className={`max-w-2xl mx-auto p-8 text-center ${styles.container}`}>
        {/* Creator Name Display - Added to Top */}
        {creatorName && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Hazırlayan: {creatorName}
            </p>
          </div>
        )}
        
        <div className="mb-8">
          <div className="text-6xl mb-4">💕</div>
          <h1 className={`${styles.titleSize} font-bold ${styles.titleColor} mb-4`}>
            {recipientName ? `${recipientName},` : 'Aşkım,'}
          </h1>
          <h2 className={`${styles.subtitleSize} ${styles.subtitleColor} mb-8`}>
            Sana Özel Bir Mesaj 💖
          </h2>
        </div>
        
        <div className={`${styles.messageContainer} p-6 rounded-lg mb-8`}>
          <p className={`${styles.messageSize} ${styles.messageColor} leading-relaxed`}>
            {message || "Sen benim hayatımın en güzel parçasısın. Seninle geçirdiğim her an bir hayal gibi. Seni ne kadar sevdiğimi kelimelerle anlatmak mümkün değil."}
          </p>
        </div>
        
        <div className="flex justify-center space-x-2">
          {[...Array(7)].map((_, i) => (
            <span key={i} className="text-2xl animate-pulse" style={{animationDelay: `${i * 0.3}s`}}>
              💖
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DefaultTemplate({ recipientName, message, designStyle, title, creatorName }: {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist';
  title: string;
  creatorName?: string;
}) {
  const styles = getDesignStyles(designStyle);
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${styles.background}`}>
      <div className={`max-w-2xl mx-auto p-8 text-center ${styles.container}`}>
        {/* Creator Name Display - Added to Top */}
        {creatorName && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Hazırlayan: {creatorName}
            </p>
          </div>
        )}
        
        <div className="mb-8">
          <Heart className={`mx-auto mb-4 ${styles.iconSize} ${styles.heartColor}`} />
          <h1 className={`${styles.titleSize} font-bold ${styles.titleColor} mb-4`}>
            {recipientName ? `${recipientName},` : 'Sevgili İnsan,'}
          </h1>
          <h2 className={`${styles.subtitleSize} ${styles.subtitleColor} mb-8`}>
            {title}
          </h2>
        </div>
        
        <div className={`${styles.messageContainer} p-6 rounded-lg mb-8`}>
          <p className={`${styles.messageSize} ${styles.messageColor} leading-relaxed`}>
            {message || "Bu özel mesaj sizin için hazırlandı."}
          </p>
        </div>
      </div>
    </div>
  );
}

// Design Styles Helper
function getDesignStyles(designStyle: 'modern' | 'classic' | 'minimalist') {
  switch (designStyle) {
    case 'modern':
      return {
        background: 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500',
        container: 'bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20',
        titleSize: 'text-4xl md:text-6xl',
        titleColor: 'text-gray-800',
        subtitleSize: 'text-xl md:text-2xl',
        subtitleColor: 'text-gray-600',
        messageContainer: 'bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200',
        messageSize: 'text-lg md:text-xl',
        messageColor: 'text-gray-700',
        iconSize: 'h-16 w-16',
        heartColor: 'text-pink-500'
      };
    case 'classic':
      return {
        background: 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50',
        container: 'bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border-2 border-amber-200',
        titleSize: 'text-3xl md:text-5xl',
        titleColor: 'text-amber-800',
        subtitleSize: 'text-lg md:text-xl',
        subtitleColor: 'text-amber-700',
        messageContainer: 'bg-amber-50/80 border-2 border-amber-200',
        messageSize: 'text-base md:text-lg',
        messageColor: 'text-amber-900',
        iconSize: 'h-14 w-14',
        heartColor: 'text-amber-600'
      };
    case 'minimalist':
      return {
        background: 'bg-gray-50',
        container: 'bg-white rounded-lg shadow-sm border border-gray-200',
        titleSize: 'text-2xl md:text-4xl',
        titleColor: 'text-gray-900',
        subtitleSize: 'text-base md:text-lg',
        subtitleColor: 'text-gray-600',
        messageContainer: 'bg-gray-50',
        messageSize: 'text-sm md:text-base',
        messageColor: 'text-gray-800',
        iconSize: 'h-12 w-12',
        heartColor: 'text-gray-600'
      };
    default:
      return {
        background: 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500',
        container: 'bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20',
        titleSize: 'text-4xl md:text-6xl',
        titleColor: 'text-gray-800',
        subtitleSize: 'text-xl md:text-2xl',
        subtitleColor: 'text-gray-600',
        messageContainer: 'bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200',
        messageSize: 'text-lg md:text-xl',
        messageColor: 'text-gray-700',
        iconSize: 'h-16 w-16',
        heartColor: 'text-pink-500'
      };
  }
}
