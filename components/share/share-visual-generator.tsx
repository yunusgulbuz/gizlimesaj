'use client';

import type { CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Image as ImageIcon, Loader2, Sparkles, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type ShareFormat = 'story' | 'landscape' | 'square';
type VisualTheme =
  | 'aurora-bloom'
  | 'heart-beat'
  | 'bear-hug'
  | 'rose-poetry'
  | 'line-art-love'
  | 'ring-lux'
  | 'daisy-meadow'
  | 'floral-daydream'
  | 'lunar-dream'
  | 'emoji-splash'
  | 'prism-pop'
  | 'bubble-smiles'
  | 'retro-wave'
  | 'gaming-neon'
  | 'balloon-fest'
  | 'calm-horizon'
  | 'minimal-frost'
  | 'zen-garden'
  | 'corporate-vision'
  | 'lux-gilded'
  | 'ember-noir';

type GlowLayer = {
  background: string;
  width: string;
  height: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  opacity?: number;
  blur: string;
  rotate?: string;
};

type ThemePattern = {
  backgroundImage: string;
  backgroundSize: string;
  opacity: number;
};

type ThemeGrain = {
  opacity: number;
  size: string;
};

interface VisualThemeDefinition {
  label: string;
  description: string;
  gradient: string;
  accent: string;
  highlight: string;
  foreground: string;
  subtitle: string;
  glassTint: string;
  glassBorder: string;
  panelTint: string;
  panelBorder: string;
  glowLayers: GlowLayer[];
  pattern?: ThemePattern;
  grain?: ThemeGrain;
}

const HEART_PATTERN_SVG =
  '%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 width%3D%22120%22 height%3D%22120%22 viewBox%3D%220 0 120 120%22%3E%3Cpath d%3D%22M60 96L23 59.5C14 50.8 14 36.8 23 28.1c8.1-7.7 21-7.7 29 0 8-7.7 20.9-7.7 29 0 9 8.7 9 22.7 0 31.4L60 96z%22 fill%3D%22rgba(255%2C255%2C255%2C0.24)%22/%3E%3C/svg%3E';

const CONFETTI_PATTERN_SVG =
  '%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 width%3D%2280%22 height%3D%2280%22 viewBox%3D%220 0 80 80%22%3E%3Cg fill%3D%22none%22 stroke-width%3D%224%22 stroke-linecap%3D%22round%22%3E%3Cpath stroke%3D%22rgba(255%2C255%2C255%2C0.32)%22 d%3D%22M10 10l10 10M60 20l10 10M30 60l10 10%22/%3E%3Cpath stroke%3D%22rgba(255%2C255%2C255%2C0.18)%22 d%3D%22M20 55l5 5M50 15l5 5M65 55l5 5%22/%3E%3Ccircle fill%3D%22rgba(255%2C255%2C255%2C0.24)%22 cx%3D%2215%22 cy%3D%2245%22 r%3D%223%22/%3E%3Ccircle fill%3D%22rgba(255%2C255%2C255%2C0.24)%22 cx%3D%2245%22 cy%3D%2235%22 r%3D%223%22/%3E%3Ccircle fill%3D%22rgba(255%2C255%2C255%2C0.24)%22 cx%3D%2265%22 cy%3D%2215%22 r%3D%223%22/%3E%3C/g%3E%3C/svg%3E';

const SUBTLE_GRID_PATTERN_SVG =
  '%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 width%3D%2290%22 height%3D%2290%22 viewBox%3D%220 0 90 90%22%3E%3Cpath d%3D%22M0 45h90M45 0v90%22 stroke%3D%22rgba(255%2C255%2C255%2C0.15)%22 stroke-width%3D%221.5%22/%3E%3C/svg%3E';

const MICRO_DOT_PATTERN_SVG =
  '%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 width%3D%2260%22 height%3D%2260%22 viewBox%3D%220 0 60 60%22%3E%3Ccircle cx%3D%2230%22 cy%3D%2230%22 r%3D%222.4%22 fill%3D%22rgba(255%2C255%2C255%2C0.16)%22/%3E%3C/svg%3E';

const BEAR_PATTERN_SVG =
  '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2296%22%20height%3D%2296%22%20viewBox%3D%220%200%2096%2096%22%3E%3Crect%20width%3D%2296%22%20height%3D%2296%22%20fill%3D%22none%22%2F%3E%3Cg%20transform%3D%22translate(12%2C48)%22%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2218%22%20r%3D%2210%22%20fill%3D%22%23c9986b%22%2F%3E%3Ccircle%20cx%3D%2252%22%20cy%3D%2218%22%20r%3D%2210%22%20fill%3D%22%23c9986b%22%2F%3E%3Ccircle%20cx%3D%2236%22%20cy%3D%2224%22%20r%3D%2220%22%20fill%3D%22%23c9986b%22%2F%3E%3Ccircle%20cx%3D%2228%22%20cy%3D%2222%22%20r%3D%223%22%20fill%3D%22%233f2f23%22%2F%3E%3Ccircle%20cx%3D%2244%22%20cy%3D%2222%22%20r%3D%223%22%20fill%3D%22%233f2f23%22%2F%3E%3Cpath%20d%3D%22M32%2030c2%203%206%203%208%200%22%20stroke%3D%22%233f2f23%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20fill%3D%22none%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E';

const LINE_ART_PATTERN_SVG =
  '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22120%22%20height%3D%22120%22%20viewBox%3D%220%200%20120%20120%22%3E%3Crect%20width%3D%22120%22%20height%3D%22120%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22M20%2040c10-20%2030-20%2040%200%2010-20%2030-20%2040%200%22%20stroke%3D%22%231f2937%22%20stroke-width%3D%224%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3Cpath%20d%3D%22M20%2090c10-14%2018-14%2028%200%2010-14%2018-14%2028%200%22%20stroke%3D%22%231f2937%22%20stroke-width%3D%224%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E';

const RING_PATTERN_SVG =
  '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22140%22%20height%3D%22140%22%20viewBox%3D%220%200%20140%20140%22%3E%3Crect%20width%3D%22140%22%20height%3D%22140%22%20fill%3D%22none%22%2F%3E%3Cg%20stroke%3D%22%231f2937%22%20stroke-width%3D%223%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%3E%3Cg%20transform%3D%22translate(28%2C32)%22%3E%3Ccircle%20cx%3D%2224%22%20cy%3D%2224%22%20r%3D%2218%22%2F%3E%3Cellipse%20cx%3D%2224%22%20cy%3D%2224%22%20rx%3D%2226%22%20ry%3D%228%22%20opacity%3D%220.25%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(76%2C12)%22%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2220%22%20r%3D%2216%22%2F%3E%3Cellipse%20cx%3D%2220%22%20cy%3D%2220%22%20rx%3D%2222%22%20ry%3D%227%22%20opacity%3D%220.25%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';

const DAISY_PATTERN_SVG =
  '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22140%22%20height%3D%22140%22%20viewBox%3D%220%200%20140%20140%22%3E%3Crect%20width%3D%22140%22%20height%3D%22140%22%20fill%3D%22none%22%2F%3E%3Cg%20transform%3D%22translate(20%2C20)%22%3E%3Cg%20transform%3D%22translate(0%2C0)%22%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%224%22%20r%3D%224%22%20fill%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2210%22%20r%3D%224%22%20fill%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%2236%22%20cy%3D%2224%22%20r%3D%224%22%20fill%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2238%22%20r%3D%224%22%20fill%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2244%22%20r%3D%224%22%20fill%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%228%22%20cy%3D%2238%22%20r%3D%224%22%20fill%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%224%22%20cy%3D%2224%22%20r%3D%224%22%20fill%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%228%22%20cy%3D%2210%22%20r%3D%224%22%20fill%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2224%22%20r%3D%227%22%20fill%3D%22%23fbbf24%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(60%2C24)%22%3E%3Ccircle%20cx%3D%2216%22%20cy%3D%223%22%20r%3D%223%22%20fill%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%2226%22%20cy%3D%228%22%20r%3D%223%22%20fill%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2218%22%20r%3D%223%22%20fill%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%2226%22%20cy%3D%2228%22%20r%3D%223%22%20fill%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%2216%22%20cy%3D%2233%22%20r%3D%223%22%20fill%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%226%22%20cy%3D%2228%22%20r%3D%223%22%20fill%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%222%22%20cy%3D%2218%22%20r%3D%223%22%20fill%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%226%22%20cy%3D%228%22%20r%3D%223%22%20fill%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%2216%22%20cy%3D%2218%22%20r%3D%225%22%20fill%3D%22%23facc15%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';

const PETITE_FLOWER_PATTERN_SVG =
  '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%3Crect%20width%3D%22160%22%20height%3D%22160%22%20fill%3D%22none%22%2F%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22none%22%3E%3Cg%20transform%3D%22translate(20%2C24)%22%3E%3Ccircle%20cx%3D%228%22%20cy%3D%228%22%20r%3D%226%22%20fill%3D%22%23fca5a5%22%2F%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2216%22%20r%3D%225%22%20fill%3D%22%23facc15%22%2F%3E%3Ccircle%20cx%3D%2218%22%20cy%3D%2236%22%20r%3D%226%22%20fill%3D%22%23fda4af%22%2F%3E%3Ccircle%20cx%3D%2240%22%20cy%3D%2240%22%20r%3D%226%22%20fill%3D%22%23f59e0b%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2256%22%20r%3D%225%22%20fill%3D%22%23a7f3d0%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(80%2C12)%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%226%22%20fill%3D%22%23fcd34d%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%226%22%20r%3D%225%22%20fill%3D%22%23f472b6%22%2F%3E%3Ccircle%20cx%3D%2226%22%20cy%3D%2228%22%20r%3D%225%22%20fill%3D%22%23bbf7d0%22%2F%3E%3Ccircle%20cx%3D%226%22%20cy%3D%2230%22%20r%3D%225%22%20fill%3D%22%23c4b5fd%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(60%2C90)%22%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%2210%22%20r%3D%226%22%20fill%3D%22%23f472b6%22%2F%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2212%22%20r%3D%225%22%20fill%3D%22%23fde68a%22%2F%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2230%22%20r%3D%225%22%20fill%3D%22%23a5b4fc%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(110%2C70)%22%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%2210%22%20r%3D%225%22%20fill%3D%22%23fca5a5%22%2F%3E%3Ccircle%20cx%3D%2226%22%20cy%3D%2216%22%20r%3D%225%22%20fill%3D%22%23facc15%22%2F%3E%3Ccircle%20cx%3D%2218%22%20cy%3D%2232%22%20r%3D%225%22%20fill%3D%22%23fcd34d%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';

const BALLOON_PATTERN_SVG =
  '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%3Crect%20width%3D%22160%22%20height%3D%22160%22%20fill%3D%22none%22%2F%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22none%22%3E%3Cg%20transform%3D%22translate(16%2C24)%22%3E%3Cellipse%20cx%3D%2224%22%20cy%3D%2230%22%20rx%3D%2216%22%20ry%3D%2222%22%20fill%3D%22%23fcd2d7%22%2F%3E%3Cpath%20d%3D%22M24%2052v12%22%20stroke%3D%22%23bd6f7c%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%2F%3E%3Cpath%20d%3D%22M24%2064c-6%204-10%204-16%208%22%20stroke%3D%22%23bd6f7c%22%20stroke-width%3D%221.6%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(72%2C12)%22%3E%3Cellipse%20cx%3D%2224%22%20cy%3D%2230%22%20rx%3D%2215%22%20ry%3D%2221%22%20fill%3D%22%23fbe29d%22%2F%3E%3Cpath%20d%3D%22M24%2051v12%22%20stroke%3D%22%23c79536%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%2F%3E%3Cpath%20d%3D%22M24%2063c6%204%2010%204%2016%208%22%20stroke%3D%22%23c79536%22%20stroke-width%3D%221.6%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(90%2C72)%22%3E%3Cellipse%20cx%3D%2220%22%20cy%3D%2224%22%20rx%3D%2214%22%20ry%3D%2219%22%20fill%3D%22%23c7d8fe%22%2F%3E%3Cpath%20d%3D%22M20%2043v11%22%20stroke%3D%22%236c7cc5%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%2F%3E%3Cpath%20d%3D%22M20%2054c5%203%208%203%2012%206%22%20stroke%3D%22%236c7cc5%22%20stroke-width%3D%221.6%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(24%2C96)%22%3E%3Cellipse%20cx%3D%2218%22%20cy%3D%2222%22%20rx%3D%2213%22%20ry%3D%2218%22%20fill%3D%22%23aef0e4%22%2F%3E%3Cpath%20d%3D%22M18%2040v10%22%20stroke%3D%22%233f9c8a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%2F%3E%3Cpath%20d%3D%22M18%2050c-5%203-7%203-11%206%22%20stroke%3D%22%233f9c8a%22%20stroke-width%3D%221.6%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%3Cg%20fill%3D%22%23fcdce1%22%3E%3Ccircle%20cx%3D%22130%22%20cy%3D%2226%22%20r%3D%225%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22118%22%20r%3D%226%22%2F%3E%3Ccircle%20cx%3D%2244%22%20cy%3D%2210%22%20r%3D%224%22%2F%3E%3Ccircle%20cx%3D%22138%22%20cy%3D%2278%22%20r%3D%224%22%2F%3E%3Ccircle%20cx%3D%2256%22%20cy%3D%22130%22%20r%3D%225%22%2F%3E%3C%2Fg%3E%3Cg%20fill%3D%22%23dbeafe%22%3E%3Ccircle%20cx%3D%22110%22%20cy%3D%2254%22%20r%3D%225%22%2F%3E%3Ccircle%20cx%3D%2280%22%20cy%3D%22120%22%20r%3D%226%22%2F%3E%3Ccircle%20cx%3D%22140%22%20cy%3D%22120%22%20r%3D%224%22%2F%3E%3C%2Fg%3E%3Cg%20fill%3D%22%23fef08a%22%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2264%22%20r%3D%224%22%2F%3E%3Ccircle%20cx%3D%22116%22%20cy%3D%2290%22%20r%3D%224%22%2F%3E%3Ccircle%20cx%3D%2298%22%20cy%3D%22140%22%20r%3D%225%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';

const BUBBLE_PATTERN_SVG =
  '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%3Crect%20width%3D%22160%22%20height%3D%22160%22%20fill%3D%22none%22%2F%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22none%22%3E%3Cg%20transform%3D%22translate(20%2C20)%22%3E%3Ccircle%20cx%3D%2218%22%20cy%3D%2218%22%20r%3D%2216%22%20fill%3D%22%23fde4ef%22%20opacity%3D%220.9%22%2F%3E%3Ccircle%20cx%3D%2218%22%20cy%3D%2218%22%20r%3D%2216%22%20stroke%3D%22%23f8b6d6%22%20stroke-width%3D%221.2%22%20opacity%3D%220.5%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%222%22%20fill%3D%22%23f390c7%22%2F%3E%3Cpath%20d%3D%22M12%2020c2%202%204%202%206%200%22%20stroke%3D%22%23f390c7%22%20stroke-width%3D%221.4%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(80%2C32)%22%3E%3Ccircle%20cx%3D%2218%22%20cy%3D%2218%22%20r%3D%2215%22%20fill%3D%22%23d7f0fd%22%20opacity%3D%220.9%22%2F%3E%3Ccircle%20cx%3D%2218%22%20cy%3D%2218%22%20r%3D%2215%22%20stroke%3D%22%239ed0f4%22%20stroke-width%3D%221.2%22%20opacity%3D%220.5%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2214%22%20r%3D%222%22%20fill%3D%22%237ec2ee%22%2F%3E%3Cpath%20d%3D%22M12%2022c2%202%204%202%206%200%22%20stroke%3D%22%237ec2ee%22%20stroke-width%3D%221.4%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(48%2C86)%22%3E%3Ccircle%20cx%3D%2215%22%20cy%3D%2215%22%20r%3D%2213%22%20fill%3D%22%23e7e7ff%22%20opacity%3D%220.9%22%2F%3E%3Ccircle%20cx%3D%2215%22%20cy%3D%2215%22%20r%3D%2213%22%20stroke%3D%22%23c2c0f6%22%20stroke-width%3D%221.1%22%20opacity%3D%220.5%22%2F%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%2212%22%20r%3D%222%22%20fill%3D%22%23a49cee%22%2F%3E%3Cpath%20d%3D%22M10%2020c2%202%204%202%206%200%22%20stroke%3D%22%23a49cee%22%20stroke-width%3D%221.2%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(110%2C90)%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20fill%3D%22%23fce7c5%22%20opacity%3D%220.9%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20stroke%3D%22%23f6ca7c%22%20stroke-width%3D%221%22%20opacity%3D%220.5%22%2F%3E%3Ccircle%20cx%3D%228%22%20cy%3D%229%22%20r%3D%221.6%22%20fill%3D%22%23f1b454%22%2F%3E%3Cpath%20d%3D%22M8%2015c1.6%201.4%203.2%201.4%204.8%200%22%20stroke%3D%22%23f1b454%22%20stroke-width%3D%221.1%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';

interface ShareVisualGeneratorProps {
  shortId: string;
  recipientName: string;
  senderName: string;
  templateTitle: string;
  message: string;
  pageUrl: string;
  qrDataUrl?: string;
  templateAudience?: string | string[];
}

const formatConfig: Record<
  ShareFormat,
  { width: number; height: number; label: string; hint: string }
> = {
  story: {
    width: 1080,
    height: 1920,
    label: 'Dikey Hikaye',
    hint: 'Instagram Story, Reels, Snapchat',
  },
  landscape: {
    width: 1920,
    height: 1080,
    label: 'Yatay Paylaşım',
    hint: 'WhatsApp, Web Banner, E-posta',
  },
  square: {
    width: 1080,
    height: 1080,
    label: 'Kare Gönderi',
    hint: 'Instagram Akışı, Facebook, Pinterest',
  },
};

const themeConfig: Record<VisualTheme, VisualThemeDefinition> = {
  'aurora-bloom': {
    label: 'Aurora Bloom',
    description: 'Lila ve pembe aurora geçişi, holografik ışık oyunları.',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #F472B6 45%, #22D3EE 100%)',
    accent: '#F9A8D4',
    highlight: '#22D3EE',
    foreground: '#FDF4FF',
    subtitle: 'rgba(255,255,255,0.72)',
    glassTint: 'rgba(255,255,255,0.12)',
    glassBorder: 'rgba(255,255,255,0.22)',
    panelTint: 'rgba(10,9,23,0.18)',
    panelBorder: 'rgba(253,244,255,0.2)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 70%)',
        width: '45%',
        height: '45%',
        top: '-15%',
        left: '-10%',
        blur: 'blur(90px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(168,85,247,0.4) 0%, rgba(168,85,247,0) 70%)',
        width: '42%',
        height: '42%',
        bottom: '-18%',
        left: '20%',
        blur: 'blur(80px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(236,72,153,0.35) 0%, rgba(236,72,153,0) 70%)',
        width: '38%',
        height: '38%',
        top: '18%',
        right: '-12%',
        blur: 'blur(80px)',
      },
    ],
    pattern: {
      backgroundImage:
        'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 55%)',
      backgroundSize: '240px 240px',
      opacity: 0.45,
    },
    grain: {
      opacity: 0.18,
      size: '2px 2px',
    },
  },
  'prism-pop': {
    label: 'Prism Pop',
    description: 'Neon turuncu & pembe karışımı, genç ve eğlenceli vibe.',
    gradient: 'linear-gradient(140deg, #FF8FA9 0%, #FFB347 40%, #7C3AED 100%)',
    accent: '#FBBF24',
    highlight: '#34D399',
    foreground: '#FFF7ED',
    subtitle: 'rgba(255,255,255,0.8)',
    glassTint: 'rgba(255,255,255,0.14)',
    glassBorder: 'rgba(255,255,255,0.24)',
    panelTint: 'rgba(15,23,42,0.3)',
    panelBorder: 'rgba(255,255,255,0.25)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(255,196,56,0.35) 0%, rgba(255,196,56,0) 70%)',
        width: '40%',
        height: '40%',
        top: '-12%',
        left: '-8%',
        blur: 'blur(85px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(236,72,153,0.4) 0%, rgba(236,72,153,0) 70%)',
        width: '46%',
        height: '46%',
        bottom: '-18%',
        left: '32%',
        blur: 'blur(95px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(34,211,238,0.32) 0%, rgba(34,211,238,0) 70%)',
        width: '35%',
        height: '35%',
        top: '10%',
        right: '-15%',
        blur: 'blur(90px)',
      },
    ],
    pattern: {
      backgroundImage:
        'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 55%), linear-gradient(225deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 55%)',
      backgroundSize: '180px 180px',
      opacity: 0.4,
    },
    grain: {
      opacity: 0.22,
      size: '3px 3px',
    },
  },
  'ember-noir': {
    label: 'Ember Noir',
    description: 'Gece mavisi üstüne bakır parıltılar, profesyonel şıklık.',
    gradient: 'linear-gradient(145deg, #050214 0%, #1E1B4B 45%, #7C2D12 100%)',
    accent: '#F97316',
    highlight: '#FDE68A',
    foreground: '#FEF3C7',
    subtitle: 'rgba(254,243,199,0.75)',
    glassTint: 'rgba(15,23,42,0.35)',
    glassBorder: 'rgba(251,191,36,0.28)',
    panelTint: 'rgba(8,9,22,0.55)',
    panelBorder: 'rgba(251,191,36,0.24)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(124,45,18,0.5) 0%, rgba(124,45,18,0) 70%)',
        width: '38%',
        height: '38%',
        top: '-14%',
        left: '-10%',
        blur: 'blur(120px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(37,99,235,0.28) 0%, rgba(37,99,235,0) 70%)',
        width: '42%',
        height: '42%',
        top: '32%',
        right: '-14%',
        blur: 'blur(120px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(255,187,92,0.35) 0%, rgba(255,187,92,0) 70%)',
        width: '48%',
        height: '48%',
        bottom: '-18%',
        left: '18%',
        blur: 'blur(120px)',
      },
    ],
    pattern: {
      backgroundImage:
        'linear-gradient(0deg, rgba(253,230,138,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(253,230,138,0.12) 1px, transparent 1px)',
      backgroundSize: '90px 90px',
      opacity: 0.3,
    },
    grain: {
      opacity: 0.24,
      size: '2px 2px',
    },
  },
  'lunar-dream': {
    label: 'Lunar Dream',
    description: 'Pastel ay ışığı, kutlama ve doğum günü hissi.',
    gradient: 'linear-gradient(140deg, #FDE68A 0%, #C084FC 45%, #38BDF8 100%)',
    accent: '#FDE68A',
    highlight: '#A855F7',
    foreground: '#FDF9FF',
    subtitle: 'rgba(255,255,255,0.78)',
    glassTint: 'rgba(255,255,255,0.14)',
    glassBorder: 'rgba(255,255,255,0.24)',
    panelTint: 'rgba(12,20,39,0.22)',
    panelBorder: 'rgba(255,255,255,0.2)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(253,224,71,0.35) 0%, rgba(253,224,71,0) 70%)',
        width: '40%',
        height: '40%',
        top: '-16%',
        left: '-8%',
        blur: 'blur(95px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(168,85,247,0.38) 0%, rgba(168,85,247,0) 70%)',
        width: '44%',
        height: '44%',
        top: '24%',
        right: '-12%',
        blur: 'blur(90px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(59,130,246,0.32) 0%, rgba(59,130,246,0) 70%)',
        width: '38%',
        height: '38%',
        bottom: '-16%',
        left: '24%',
        blur: 'blur(92px)',
      },
    ],
    pattern: {
      backgroundImage:
        'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%)',
      backgroundSize: '220px 220px',
      opacity: 0.35,
    },
    grain: {
      opacity: 0.16,
      size: '2px 2px',
    },
  },
  'emoji-splash': {
    label: 'Emoji Splash',
    description: 'Renkli confetti enerjisi ve sosyal medya dostu neon tonlar.',
    gradient: 'linear-gradient(135deg, #FF7F9C 0%, #FFD166 40%, #7CFFCB 100%)',
    accent: '#FFE082',
    highlight: '#34D399',
    foreground: '#FFFDF5',
    subtitle: 'rgba(255,255,255,0.85)',
    glassTint: 'rgba(255,255,255,0.18)',
    glassBorder: 'rgba(255,255,255,0.26)',
    panelTint: 'rgba(15,23,42,0.24)',
    panelBorder: 'rgba(255,255,255,0.28)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(255,182,77,0.42) 0%, rgba(255,182,77,0) 70%)',
        width: '40%',
        height: '40%',
        top: '-10%',
        left: '-12%',
        blur: 'blur(80px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(236,72,153,0.4) 0%, rgba(236,72,153,0) 70%)',
        width: '44%',
        height: '44%',
        top: '28%',
        right: '-14%',
        blur: 'blur(90px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(59,130,246,0.35) 0%, rgba(59,130,246,0) 70%)',
        width: '42%',
        height: '42%',
        bottom: '-18%',
        left: '18%',
        blur: 'blur(88px)',
      },
    ],
    pattern: {
      backgroundImage: `url("data:image/svg+xml,${CONFETTI_PATTERN_SVG}")`,
      backgroundSize: '160px 160px',
      opacity: 0.5,
    },
    grain: {
      opacity: 0.22,
      size: '3px 3px',
    },
  },
  'heart-beat': {
    label: 'Heart Beat',
    description: 'Kalpli neon dokularla romantik vibe yüksek.',
    gradient: 'linear-gradient(140deg, #FF4D6D 0%, #FF758F 45%, #FFA6C1 100%)',
    accent: '#FFE3EC',
    highlight: '#F472B6',
    foreground: '#FFF5F7',
    subtitle: 'rgba(255,255,255,0.82)',
    glassTint: 'rgba(255,255,255,0.18)',
    glassBorder: 'rgba(255,255,255,0.28)',
    panelTint: 'rgba(74,16,51,0.28)',
    panelBorder: 'rgba(255,255,255,0.3)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(255,129,167,0.45) 0%, rgba(255,129,167,0) 70%)',
        width: '46%',
        height: '46%',
        top: '-14%',
        left: '-10%',
        blur: 'blur(95px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(255,207,222,0.4) 0%, rgba(255,207,222,0) 70%)',
        width: '40%',
        height: '40%',
        top: '32%',
        right: '-12%',
        blur: 'blur(90px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(220,38,126,0.32) 0%, rgba(220,38,126,0) 70%)',
        width: '42%',
        height: '42%',
        bottom: '-18%',
        left: '20%',
        blur: 'blur(96px)',
      },
    ],
    pattern: {
      backgroundImage: `url("data:image/svg+xml,${HEART_PATTERN_SVG}")`,
      backgroundSize: '200px 200px',
      opacity: 0.45,
    },
    grain: {
      opacity: 0.2,
      size: '2px 2px',
    },
  },
  'bear-hug': {
    label: 'Bear Hug',
    description: 'Tatlı kahverengi tonları ve sevimli ayıcık figürü.',
    gradient: 'linear-gradient(135deg, #F4E6D3 0%, #EDD8C0 45%, #E1C9AC 100%)',
    accent: '#E3B78F',
    highlight: '#8B5E3C',
    foreground: '#3F2F23',
    subtitle: 'rgba(63,47,35,0.6)',
    glassTint: 'rgba(242,230,210,0.35)',
    glassBorder: 'rgba(191,155,110,0.35)',
    panelTint: 'rgba(133,99,68,0.28)',
    panelBorder: 'rgba(191,155,110,0.3)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(216,170,121,0.36) 0%, rgba(216,170,121,0) 70%)',
        width: '42%',
        height: '42%',
        top: '-12%',
        left: '-10%',
        blur: 'blur(95px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(173,129,91,0.32) 0%, rgba(173,129,91,0) 70%)',
        width: '38%',
        height: '38%',
        top: '32%',
        right: '-12%',
        blur: 'blur(100px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(239,206,165,0.3) 0%, rgba(239,206,165,0) 70%)',
        width: '40%',
        height: '40%',
        bottom: '-18%',
        left: '24%',
        blur: 'blur(100px)',
      },
    ],
    pattern: {
      backgroundImage: `url("data:image/svg+xml,${BEAR_PATTERN_SVG}")`,
      backgroundSize: '160px 160px',
      opacity: 0.45,
    },
    grain: {
      opacity: 0.14,
      size: '2px 2px',
    },
  },
  'rose-poetry': {
    label: 'Rose Poetry',
    description: 'Gül yapraklarıyla şiirsel ve sıcak paylaşımlar.',
    gradient: 'linear-gradient(140deg, #FF6B9A 0%, #FF99B8 45%, #FFD6E0 100%)',
    accent: '#FFC1D9',
    highlight: '#FF4D6D',
    foreground: '#FFF5F7',
    subtitle: 'rgba(255,255,255,0.82)',
    glassTint: 'rgba(255,255,255,0.22)',
    glassBorder: 'rgba(255,255,255,0.3)',
    panelTint: 'rgba(130,40,82,0.24)',
    panelBorder: 'rgba(255,255,255,0.28)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(255,209,220,0.48) 0%, rgba(255,209,220,0) 70%)',
        width: '44%',
        height: '44%',
        top: '-16%',
        left: '-12%',
        blur: 'blur(95px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(255,140,178,0.42) 0%, rgba(255,140,178,0) 70%)',
        width: '42%',
        height: '42%',
        top: '24%',
        right: '-14%',
        blur: 'blur(92px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(255,184,212,0.32) 0%, rgba(255,184,212,0) 70%)',
        width: '38%',
        height: '38%',
        bottom: '-16%',
        left: '22%',
        blur: 'blur(88px)',
      },
    ],
    pattern: {
      backgroundImage:
        'radial-gradient(circle at 25% 30%, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0) 55%), radial-gradient(circle at 70% 65%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%)',
      backgroundSize: '220px 220px',
      opacity: 0.5,
    },
    grain: {
      opacity: 0.2,
      size: '2px 2px',
    },
  },
  'line-art-love': {
    label: 'Line Art Love',
    description: 'Minimalist çizgilerle zarif birliktelik vurgusu.',
    gradient: 'linear-gradient(135deg, #F7F7F8 0%, #E7E7EA 45%, #DADADF 100%)',
    accent: '#1F2937',
    highlight: '#111827',
    foreground: '#1F2937',
    subtitle: 'rgba(17,24,39,0.55)',
    glassTint: 'rgba(255,255,255,0.6)',
    glassBorder: 'rgba(209,213,219,0.55)',
    panelTint: 'rgba(209,213,219,0.35)',
    panelBorder: 'rgba(148,163,184,0.4)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(209,213,219,0.35) 0%, rgba(209,213,219,0) 70%)',
        width: '42%',
        height: '42%',
        top: '-16%',
        left: '-14%',
        blur: 'blur(95px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(229,231,235,0.28) 0%, rgba(229,231,235,0) 70%)',
        width: '38%',
        height: '38%',
        top: '30%',
        right: '-12%',
        blur: 'blur(90px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(156,163,175,0.3) 0%, rgba(156,163,175,0) 70%)',
        width: '40%',
        height: '40%',
        bottom: '-18%',
        left: '24%',
        blur: 'blur(95px)',
      },
    ],
    pattern: {
      backgroundImage: `url("data:image/svg+xml,${LINE_ART_PATTERN_SVG}")`,
      backgroundSize: '200px 200px',
      opacity: 0.25,
    },
    grain: {
      opacity: 0.1,
      size: '2px 2px',
    },
  },
  'daisy-meadow': {
    label: 'Daisy Meadow',
    description: 'Pastel yeşil zeminde papatya desenleri.',
    gradient: 'linear-gradient(135deg, #D4E6C7 0%, #BBD9AE 45%, #A4C694 100%)',
    accent: '#FACC15',
    highlight: '#3F6212',
    foreground: '#253418',
    subtitle: 'rgba(37,52,24,0.55)',
    glassTint: 'rgba(243,250,236,0.42)',
    glassBorder: 'rgba(184,206,162,0.42)',
    panelTint: 'rgba(119,153,96,0.32)',
    panelBorder: 'rgba(184,206,162,0.35)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(196,219,166,0.42) 0%, rgba(196,219,166,0) 70%)',
        width: '44%',
        height: '44%',
        top: '-14%',
        left: '-12%',
        blur: 'blur(95px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(147,191,110,0.3) 0%, rgba(147,191,110,0) 70%)',
        width: '38%',
        height: '38%',
        top: '30%',
        right: '-12%',
        blur: 'blur(95px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(228,242,208,0.32) 0%, rgba(228,242,208,0) 70%)',
        width: '40%',
        height: '40%',
        bottom: '-16%',
        left: '24%',
        blur: 'blur(100px)',
      },
    ],
    pattern: {
      backgroundImage: `url("data:image/svg+xml,${DAISY_PATTERN_SVG}")`,
      backgroundSize: '200px 200px',
      opacity: 0.4,
    },
    grain: {
      opacity: 0.16,
      size: '2px 2px',
    },
  },
  'floral-daydream': {
    label: 'Floral Daydream',
    description: 'Pastel çiçeklerden ilham alan yumuşak tonlar.',
    gradient: 'linear-gradient(140deg, #FDE68A 0%, #FBCFE8 40%, #86EFAC 100%)',
    accent: '#F9A8D4',
    highlight: '#F472B6',
    foreground: '#FFFBF7',
    subtitle: 'rgba(255,255,255,0.8)',
    glassTint: 'rgba(255,255,255,0.18)',
    glassBorder: 'rgba(255,255,255,0.28)',
    panelTint: 'rgba(221,214,254,0.26)',
    panelBorder: 'rgba(255,255,255,0.26)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(249,168,212,0.38) 0%, rgba(249,168,212,0) 70%)',
        width: '44%',
        height: '44%',
        top: '-12%',
        left: '-10%',
        blur: 'blur(90px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(134,239,172,0.34) 0%, rgba(134,239,172,0) 70%)',
        width: '40%',
        height: '40%',
        top: '30%',
        right: '-12%',
        blur: 'blur(92px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(253,230,138,0.35) 0%, rgba(253,230,138,0) 70%)',
        width: '42%',
        height: '42%',
        bottom: '-18%',
        left: '24%',
        blur: 'blur(92px)',
      },
    ],
    pattern: {
      backgroundImage:
        'radial-gradient(circle at 15% 70%, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 55%), radial-gradient(circle at 80% 25%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 60%)',
      backgroundSize: '210px 210px',
      opacity: 0.45,
    },
    grain: {
      opacity: 0.18,
      size: '2px 2px',
    },
  },
  'ring-lux': {
    label: 'Ring Sketch',
    description: 'Minimal çizgilerle nişan halkası vurgusu.',
    gradient: 'linear-gradient(135deg, #F5F5F6 0%, #ECEDEF 45%, #E2E4E7 100%)',
    accent: '#1F2937',
    highlight: '#4B5563',
    foreground: '#1F2937',
    subtitle: 'rgba(31,41,55,0.55)',
    glassTint: 'rgba(255,255,255,0.65)',
    glassBorder: 'rgba(209,213,219,0.4)',
    panelTint: 'rgba(209,213,219,0.32)',
    panelBorder: 'rgba(148,163,184,0.35)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(156,163,175,0.28) 0%, rgba(156,163,175,0) 70%)',
        width: '42%',
        height: '42%',
        top: '-16%',
        left: '-12%',
        blur: 'blur(95px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(107,114,128,0.26) 0%, rgba(107,114,128,0) 70%)',
        width: '38%',
        height: '38%',
        top: '30%',
        right: '-12%',
        blur: 'blur(95px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(209,213,219,0.28) 0%, rgba(209,213,219,0) 70%)',
        width: '36%',
        height: '36%',
        bottom: '-18%',
        left: '24%',
        blur: 'blur(100px)',
      },
    ],
    pattern: {
      backgroundImage: `url("data:image/svg+xml,${RING_PATTERN_SVG}")`,
      backgroundSize: '220px 220px',
      opacity: 0.24,
    },
    grain: {
      opacity: 0.08,
      size: '2px 2px',
    },
  },
  'floral-daydream': {
    label: 'Floral Daydream',
    description: 'Pastel tonlarda minik çiçek desenleri.',
    gradient: 'linear-gradient(140deg, #FFF8F1 0%, #FEE7EF 45%, #FFF6D6 100%)',
    accent: '#F9A8D4',
    highlight: '#EA580C',
    foreground: '#5B2337',
    subtitle: 'rgba(91,35,55,0.55)',
    glassTint: 'rgba(255,255,255,0.35)',
    glassBorder: 'rgba(251,191,188,0.35)',
    panelTint: 'rgba(251,219,215,0.32)',
    panelBorder: 'rgba(251,191,188,0.32)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(252,211,77,0.32) 0%, rgba(252,211,77,0) 70%)',
        width: '44%',
        height: '44%',
        top: '-14%',
        left: '-12%',
        blur: 'blur(95px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(250,191,202,0.3) 0%, rgba(250,191,202,0) 70%)',
        width: '40%',
        height: '40%',
        top: '30%',
        right: '-14%',
        blur: 'blur(95px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(190,227,248,0.3) 0%, rgba(190,227,248,0) 70%)',
        width: '42%',
        height: '42%',
        bottom: '-18%',
        left: '22%',
        blur: 'blur(96px)',
      },
    ],
    pattern: {
      backgroundImage: `url("data:image/svg+xml,${PETITE_FLOWER_PATTERN_SVG}")`,
      backgroundSize: '200px 200px',
      opacity: 0.38,
    },
    grain: {
      opacity: 0.14,
      size: '2px 2px',
    },
  },
  'bubble-smiles': {
    label: 'Bubble Smiles',
    description: 'Pastel baloncuklar ve sevimli yüz ifadeleri.',
    gradient: 'linear-gradient(135deg, #FFEFF6 0%, #E7F5FF 45%, #FDF9EC 100%)',
    accent: '#F9A8D4',
    highlight: '#7C9DE6',
    foreground: '#2E1E41',
    subtitle: 'rgba(46,30,65,0.55)',
    glassTint: 'rgba(255,255,255,0.35)',
    glassBorder: 'rgba(213,195,242,0.35)',
    panelTint: 'rgba(205,186,238,0.28)',
    panelBorder: 'rgba(213,195,242,0.3)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(250,191,202,0.32) 0%, rgba(250,191,202,0) 70%)',
        width: '42%',
        height: '42%',
        top: '-14%',
        left: '-12%',
        blur: 'blur(90px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(183,206,255,0.3) 0%, rgba(183,206,255,0) 70%)',
        width: '40%',
        height: '40%',
        top: '30%',
        right: '-12%',
        blur: 'blur(93px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(247,220,173,0.28) 0%, rgba(247,220,173,0) 70%)',
        width: '38%',
        height: '38%',
        bottom: '-18%',
        left: '24%',
        blur: 'blur(95px)',
      },
    ],
    pattern: {
      backgroundImage: `url("data:image/svg+xml,${BUBBLE_PATTERN_SVG}")`,
      backgroundSize: '200px 200px',
      opacity: 0.36,
    },
    grain: {
      opacity: 0.16,
      size: '2px 2px',
    },
  },
  'retro-wave': {
    label: 'Retro Wave',
    description: 'Synthwave ışıltısı ve nostaljik neon gridler.',
    gradient: 'linear-gradient(135deg, #2D1B69 0%, #7C3AED 45%, #F72585 100%)',
    accent: '#F472B6',
    highlight: '#38BDF8',
    foreground: '#F8F5FF',
    subtitle: 'rgba(255,255,255,0.78)',
    glassTint: 'rgba(255,255,255,0.16)',
    glassBorder: 'rgba(255,255,255,0.26)',
    panelTint: 'rgba(30,19,60,0.32)',
    panelBorder: 'rgba(255,255,255,0.28)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(124,58,237,0.42) 0%, rgba(124,58,237,0) 70%)',
        width: '42%',
        height: '42%',
        top: '-16%',
        left: '-12%',
        blur: 'blur(100px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(55,48,163,0.4) 0%, rgba(55,48,163,0) 70%)',
        width: '38%',
        height: '38%',
        top: '30%',
        right: '-12%',
        blur: 'blur(105px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(247,37,133,0.32) 0%, rgba(247,37,133,0) 70%)',
        width: '40%',
        height: '40%',
        bottom: '-18%',
        left: '24%',
        blur: 'blur(105px)',
      },
    ],
    pattern: {
      backgroundImage: `url("data:image/svg+xml,${SUBTLE_GRID_PATTERN_SVG}")`,
      backgroundSize: '180px 180px',
      opacity: 0.35,
    },
    grain: {
      opacity: 0.22,
      size: '2px 2px',
    },
  },
  'gaming-neon': {
    label: 'Gaming Neon',
    description: 'Oyun dünyasına özel neon ve piksel efektleri.',
    gradient: 'linear-gradient(135deg, #030712 0%, #0F172A 45%, #22D3EE 100%)',
    accent: '#34D399',
    highlight: '#22D3EE',
    foreground: '#F8FAFC',
    subtitle: 'rgba(226,232,240,0.8)',
    glassTint: 'rgba(15,23,42,0.32)',
    glassBorder: 'rgba(56,189,248,0.28)',
    panelTint: 'rgba(8,13,25,0.55)',
    panelBorder: 'rgba(56,189,248,0.26)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(34,211,238,0.38) 0%, rgba(34,211,238,0) 70%)',
        width: '40%',
        height: '40%',
        top: '-16%',
        left: '-10%',
        blur: 'blur(110px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(20,184,166,0.32) 0%, rgba(20,184,166,0) 70%)',
        width: '38%',
        height: '38%',
        top: '28%',
        right: '-12%',
        blur: 'blur(110px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)',
        width: '36%',
        height: '36%',
        bottom: '-20%',
        left: '24%',
        blur: 'blur(115px)',
      },
    ],
    pattern: {
      backgroundImage:
        'linear-gradient(90deg, rgba(34,211,238,0.18) 1px, transparent 1px), linear-gradient(0deg, rgba(34,211,238,0.12) 1px, transparent 1px)',
      backgroundSize: '120px 120px',
      opacity: 0.32,
    },
    grain: {
      opacity: 0.22,
      size: '2px 2px',
    },
  },
  'balloon-fest': {
    label: 'Balloon Fest',
    description: 'Kutlamalar için pastel balon desenleri.',
    gradient: 'linear-gradient(135deg, #FFF4EC 0%, #FFEFF8 45%, #F4FBFF 100%)',
    accent: '#FCD2D7',
    highlight: '#F9C74F',
    foreground: '#483B4F',
    subtitle: 'rgba(72,59,79,0.55)',
    glassTint: 'rgba(255,255,255,0.32)',
    glassBorder: 'rgba(254,215,170,0.35)',
    panelTint: 'rgba(238,207,226,0.3)',
    panelBorder: 'rgba(254,215,170,0.32)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(252,210,215,0.34) 0%, rgba(252,210,215,0) 70%)',
        width: '42%',
        height: '42%',
        top: '-14%',
        left: '-12%',
        blur: 'blur(95px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(240,195,252,0.28) 0%, rgba(240,195,252,0) 70%)',
        width: '40%',
        height: '40%',
        top: '30%',
        right: '-14%',
        blur: 'blur(92px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(190,227,248,0.28) 0%, rgba(190,227,248,0) 70%)',
        width: '40%',
        height: '40%',
        bottom: '-18%',
        left: '22%',
        blur: 'blur(96px)',
      },
    ],
    pattern: {
      backgroundImage: `url("data:image/svg+xml,${BALLOON_PATTERN_SVG}")`,
      backgroundSize: '220px 220px',
      opacity: 0.42,
    },
    grain: {
      opacity: 0.16,
      size: '2px 2px',
    },
  },
  'calm-horizon': {
    label: 'Calm Horizon',
    description: 'Gökyüzü ve deniz tonlarıyla sakin paylaşımlar.',
    gradient: 'linear-gradient(140deg, #0EA5E9 0%, #38BDF8 45%, #E0F2FE 100%)',
    accent: '#BAE6FD',
    highlight: '#0EA5E9',
    foreground: '#F5FBFF',
    subtitle: 'rgba(148,163,184,0.85)',
    glassTint: 'rgba(15,23,42,0.22)',
    glassBorder: 'rgba(186,230,253,0.3)',
    panelTint: 'rgba(8,25,48,0.32)',
    panelBorder: 'rgba(186,230,253,0.28)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(14,165,233,0.34) 0%, rgba(14,165,233,0) 70%)',
        width: '42%',
        height: '42%',
        top: '-16%',
        left: '-12%',
        blur: 'blur(100px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(14,165,233,0.26) 0%, rgba(14,165,233,0) 70%)',
        width: '36%',
        height: '36%',
        top: '30%',
        right: '-14%',
        blur: 'blur(105px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(226,232,240,0.26) 0%, rgba(226,232,240,0) 70%)',
        width: '40%',
        height: '40%',
        bottom: '-18%',
        left: '24%',
        blur: 'blur(110px)',
      },
    ],
    pattern: {
      backgroundImage:
        'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%), linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%)',
      backgroundSize: '240px 240px',
      opacity: 0.32,
    },
    grain: {
      opacity: 0.16,
      size: '2px 2px',
    },
  },
  'zen-garden': {
    label: 'Zen Garden',
    description: 'Doğa ve meditasyon temalı huzurlu tonlar.',
    gradient: 'linear-gradient(135deg, #166534 0%, #4ADE80 45%, #F7FEE7 100%)',
    accent: '#BBF7D0',
    highlight: '#22C55E',
    foreground: '#F7FEE7',
    subtitle: 'rgba(240,253,244,0.8)',
    glassTint: 'rgba(22,101,52,0.28)',
    glassBorder: 'rgba(187,247,208,0.32)',
    panelTint: 'rgba(12,50,31,0.32)',
    panelBorder: 'rgba(187,247,208,0.28)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(34,197,94,0.36) 0%, rgba(34,197,94,0) 70%)',
        width: '40%',
        height: '40%',
        top: '-16%',
        left: '-12%',
        blur: 'blur(100px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(187,247,208,0.32) 0%, rgba(187,247,208,0) 70%)',
        width: '42%',
        height: '42%',
        top: '28%',
        right: '-14%',
        blur: 'blur(105px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(248,250,229,0.26) 0%, rgba(248,250,229,0) 70%)',
        width: '38%',
        height: '38%',
        bottom: '-18%',
        left: '24%',
        blur: 'blur(110px)',
      },
    ],
    pattern: {
      backgroundImage:
        'radial-gradient(circle at 30% 60%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%)',
      backgroundSize: '220px 220px',
      opacity: 0.32,
    },
    grain: {
      opacity: 0.18,
      size: '2px 2px',
    },
  },
  'lux-gilded': {
    label: 'Lux Gilded',
    description: 'Altın yansımalarıyla lüks ve premium görünüm.',
    gradient: 'linear-gradient(135deg, #3C2A1E 0%, #8B5E34 45%, #F6C65B 100%)',
    accent: '#FDE68A',
    highlight: '#FACC15',
    foreground: '#FFF9F0',
    subtitle: 'rgba(255,245,228,0.78)',
    glassTint: 'rgba(255,255,255,0.22)',
    glassBorder: 'rgba(255,255,255,0.32)',
    panelTint: 'rgba(66,44,27,0.32)',
    panelBorder: 'rgba(255,255,255,0.3)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(246,198,91,0.42) 0%, rgba(246,198,91,0) 70%)',
        width: '42%',
        height: '42%',
        top: '-16%',
        left: '-12%',
        blur: 'blur(115px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(139,94,52,0.38) 0%, rgba(139,94,52,0) 70%)',
        width: '40%',
        height: '40%',
        top: '30%',
        right: '-12%',
        blur: 'blur(120px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(255,244,214,0.32) 0%, rgba(255,244,214,0) 70%)',
        width: '38%',
        height: '38%',
        bottom: '-18%',
        left: '24%',
        blur: 'blur(120px)',
      },
    ],
    pattern: {
      backgroundImage:
        'linear-gradient(45deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%), linear-gradient(-45deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 55%)',
      backgroundSize: '220px 220px',
      opacity: 0.38,
    },
    grain: {
      opacity: 0.2,
      size: '2px 2px',
    },
  },
  'minimal-frost': {
    label: 'Minimal Frost',
    description: 'Sade, ferah ve modern pastel geçişli tasarım.',
    gradient: 'linear-gradient(135deg, #101827 0%, #1E293B 45%, #BAE6FD 100%)',
    accent: '#DBEAFE',
    highlight: '#38BDF8',
    foreground: '#F8FAFC',
    subtitle: 'rgba(226,232,240,0.82)',
    glassTint: 'rgba(15,23,42,0.32)',
    glassBorder: 'rgba(148,163,184,0.32)',
    panelTint: 'rgba(8,12,23,0.5)',
    panelBorder: 'rgba(148,163,184,0.28)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(56,189,248,0.32) 0%, rgba(56,189,248,0) 70%)',
        width: '38%',
        height: '38%',
        top: '-16%',
        left: '-12%',
        blur: 'blur(110px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(148,163,184,0.28) 0%, rgba(148,163,184,0) 70%)',
        width: '42%',
        height: '42%',
        top: '26%',
        right: '-14%',
        blur: 'blur(120px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(226,232,240,0.24) 0%, rgba(226,232,240,0) 70%)',
        width: '44%',
        height: '44%',
        bottom: '-18%',
        left: '22%',
        blur: 'blur(120px)',
      },
    ],
    pattern: {
      backgroundImage: `url("data:image/svg+xml,${MICRO_DOT_PATTERN_SVG}")`,
      backgroundSize: '180px 180px',
      opacity: 0.35,
    },
    grain: {
      opacity: 0.18,
      size: '2px 2px',
    },
  },
  'corporate-vision': {
    label: 'Corporate Vision',
    description: 'Kurumsal sunumlar için mavi odaklı, güven veren stil.',
    gradient: 'linear-gradient(140deg, #0F172A 0%, #1D4ED8 45%, #38BDF8 100%)',
    accent: '#60A5FA',
    highlight: '#FACC15',
    foreground: '#F8FAFC',
    subtitle: 'rgba(226,232,240,0.8)',
    glassTint: 'rgba(15,23,42,0.28)',
    glassBorder: 'rgba(96,165,250,0.3)',
    panelTint: 'rgba(12,19,36,0.55)',
    panelBorder: 'rgba(96,165,250,0.28)',
    glowLayers: [
      {
        background: 'radial-gradient(circle at center, rgba(29,78,216,0.32) 0%, rgba(29,78,216,0) 70%)',
        width: '40%',
        height: '40%',
        top: '-14%',
        left: '-10%',
        blur: 'blur(120px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(14,165,233,0.28) 0%, rgba(14,165,233,0) 70%)',
        width: '44%',
        height: '44%',
        top: '28%',
        right: '-14%',
        blur: 'blur(125px)',
      },
      {
        background: 'radial-gradient(circle at center, rgba(250,204,21,0.24) 0%, rgba(250,204,21,0) 70%)',
        width: '42%',
        height: '42%',
        bottom: '-18%',
        left: '24%',
        blur: 'blur(120px)',
      },
    ],
    pattern: {
      backgroundImage: `url("data:image/svg+xml,${SUBTLE_GRID_PATTERN_SVG}")`,
      backgroundSize: '200px 200px',
      opacity: 0.32,
    },
    grain: {
      opacity: 0.2,
      size: '2px 2px',
    },
  },
};

interface ThemeGroup {
  title: string;
  description?: string;
  themes: VisualTheme[];
}

const themeGroups: ThemeGroup[] = [
  {
    title: 'Romantik & Çiçekli',
    description: 'Güller, yüzükler ve çiçek temalı paylaşımlar.',
    themes: ['heart-beat', 'aurora-bloom', 'bear-hug', 'rose-poetry', 'line-art-love', 'ring-lux', 'daisy-meadow', 'floral-daydream'],
  },
  {
    title: 'Kutlama & Enerjik',
    description: 'Doğum günü, parti ve eğlenceli içerikler.',
    themes: ['lunar-dream', 'emoji-splash', 'prism-pop', 'bubble-smiles', 'retro-wave', 'gaming-neon', 'balloon-fest'],
  },
  {
    title: 'Sade & Huzurlu',
    description: 'Pastel ve dingin anları öne çıkarır.',
    themes: ['calm-horizon', 'minimal-frost', 'zen-garden'],
  },
  {
    title: 'Prestij & Kurumsal',
    description: 'Kurumsal, profesyonel ve lüks sunumlar.',
    themes: ['corporate-vision', 'lux-gilded', 'ember-noir'],
  },
];

type AudienceCopy = {
  headline: string;
  subheadline: string;
  highlight?: string;
  messageIntro: string;
  ctaLine: string;
};

const audienceCopyMap: Record<string, AudienceCopy> = {
  romantic: {
    headline: "Neo Aşk Dalgalanması",
    subheadline: "{{sender}} → {{recipient}} için kalpler aurora modunda",
    highlight: "Aurora Love Signal",
    messageIntro: "Holografik sevgi notu:",
    ctaLine: "Bu vibe'i paylaş, aşkı ışık hızında çoğalt ✨",
  },
  friendship: {
    headline: "Squad Goals Alert",
    subheadline: "{{sender}} & {{recipient}} için enerjisi yüksek not",
    highlight: "BFF Spark",
    messageIntro: "Anıları turbo moda al:",
    ctaLine: "Gülüşleri paylaş, ekibi hype'la ⚡️",
  },
  family: {
    headline: "Aile Aurasi Açılıyor",
    subheadline: "{{recipient}} için sıcaklık yayan dijital sürpriz",
    highlight: "Family Glow",
    messageIntro: "Kalp ısıtan satırlar:",
    ctaLine: "Sevgiyi paylaş, bağı güçlendir 🏡",
  },
  professional: {
    headline: "Takdir Frekansı",
    subheadline: "{{sender}} → {{recipient}} için ilham veren geri bildirim",
    highlight: "Pro Signal",
    messageIntro: "Motivasyon wave'i:",
    ctaLine: "Başarıyı paylaş, ekibi ateşle 💼",
  },
  birthday: {
    headline: "Birthday Neon Bash",
    subheadline: "{{recipient}} için kutlama enerjisi tavan",
    highlight: "Party Beacon",
    messageIntro: "Dileklerin ışık hızında:",
    ctaLine: "Kutlamayı paylaş, mood'u yükselt 🎂",
  },
  celebration: {
    headline: "Celebration Glow Up",
    subheadline: "{{recipient}} için mutluluğu çoğaltan vibe",
    highlight: "Celebration Spark",
    messageIntro: "Işıltılı satırlar:",
    ctaLine: "Parıltıyı paylaş, enerji yay 🎉",
  },
  fun: {
    headline: "Fun Frequency",
    subheadline: "{{sender}} → {{recipient}} için enerjisi maksimum mesaj",
    highlight: "Vibe Booster",
    messageIntro: "Eğlence başlasın:",
    ctaLine: "Gülüşleri paylaş, vibe'i yay ⚡️",
  },
  teen: {
    headline: "Trend Alarmı",
    subheadline: "{{recipient}} için 2025 modunda özel drop",
    highlight: "Pop Highlight",
    messageIntro: "Feed'i patlatacak satırlar:",
    ctaLine: "Story'de paylaş, herkes görsün 💬",
  },
  adult: {
    headline: "Zarif Jest 2.0",
    subheadline: "{{sender}} → {{recipient}} için sofistike sürpriz",
    highlight: "Elegant Pulse",
    messageIntro: "İncelikle seçilmiş cümle:",
    ctaLine: "Şıklığı paylaş, iz bırak ✨",
  },
  classic: {
    headline: "Timeless Romance",
    subheadline: "{{recipient}} için zamansız zarafet",
    highlight: "Classic Glow",
    messageIntro: "Zarif satırlar:",
    ctaLine: "Zarafeti paylaş, duyguyu yay 🌹",
  },
  elegant: {
    headline: "Future Chic",
    subheadline: "{{sender}} → {{recipient}} için şık ve parıltılı dokunuş",
    highlight: "Sleek Signal",
    messageIntro: "İncelikle yazılmış satırlar:",
    ctaLine: "Şıklığı paylaş, kalıcı iz bırak ✨",
  },
  default: {
    headline: "Dijital Sürpriz",
    subheadline: "{{sender}} → {{recipient}} için dijital mutluluk dalgası",
    highlight: "Holo Highlight",
    messageIntro: "Mutluluk yayan satırlar:",
    ctaLine: "Hikayene ekle, mutluluğu çoğalt ✨",
  },
};

export function ShareVisualGenerator({
  shortId,
  recipientName,
  senderName,
  templateTitle,
  message,
  pageUrl,
  qrDataUrl,
  templateAudience,
}: ShareVisualGeneratorProps) {
  const [selectedFormat, setSelectedFormat] = useState<ShareFormat>('story');
  const [selectedTheme, setSelectedTheme] = useState<VisualTheme>(() => {
    const primaryAudience = extractPrimaryAudience(templateAudience);
    return audienceToTheme(primaryAudience);
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasManualThemeSelection, setHasManualThemeSelection] = useState(false);

  const storyRef = useRef<HTMLDivElement>(null);
  const landscapeRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);

  const formatRefs: Record<ShareFormat, React.RefObject<HTMLDivElement>> = {
    story: storyRef,
    landscape: landscapeRef,
    square: squareRef,
  };

  const formattedUrl = useMemo(() => {
    try {
      const url = new URL(pageUrl);
      return url.hostname.replace('www.', '') + url.pathname;
    } catch {
      return pageUrl.replace(/^https?:\/\//, '');
    }
  }, [pageUrl]);

  const primaryAudience = extractPrimaryAudience(templateAudience);
  const copyTemplate = audienceCopyMap[primaryAudience] ?? audienceCopyMap.default;

  useEffect(() => {
    if (!hasManualThemeSelection) {
      setSelectedTheme(audienceToTheme(primaryAudience));
    }
  }, [primaryAudience, hasManualThemeSelection]);

  useEffect(() => {
    setHasManualThemeSelection(false);
  }, [shortId]);

  const handleThemeSelection = (themeKey: VisualTheme) => {
    setHasManualThemeSelection(true);
    setSelectedTheme(themeKey);
  };

  const applyCopyTemplate = (text: string) =>
    text
      .replace(/{{recipient}}/gi, recipientName)
      .replace(/{{sender}}/gi, senderName)
      .replace(/{{templateTitle}}/gi, templateTitle);

  const copy = {
    headline: applyCopyTemplate(copyTemplate.headline),
    subheadline: applyCopyTemplate(copyTemplate.subheadline),
    highlight: applyCopyTemplate(copyTemplate.highlight ?? templateTitle),
    messageIntro: applyCopyTemplate(copyTemplate.messageIntro),
    ctaLine: applyCopyTemplate(copyTemplate.ctaLine),
  };

  const getTruncatedMessage = (text: string, format: ShareFormat) => {
    const limit = format === 'story' ? 220 : 180;
    if (text.length <= limit) return text;
    return `${text.slice(0, limit).trim()}…`;
  };

  const renderVisualContent = (format: ShareFormat, theme: VisualTheme, isOffscreen = false) => {
    const { width, height } = formatConfig[format];
    const themeStyles = themeConfig[theme];
    const isStory = format === 'story';
    const truncatedMessage = getTruncatedMessage(message, format);

    const headingFontSize = isStory ? '60px' : format === 'square' ? '54px' : '56px';
    const subheadlineFontSize = isStory ? '26px' : '24px';
    const messageFontSize = isStory ? '44px' : format === 'square' ? '38px' : '40px';
    const signatureFontSize = isStory ? '26px' : '24px';
    const padding = isStory ? '96px' : format === 'square' ? '76px' : '72px';
    const blockPadding = isStory ? '56px' : '48px';
    const footerPadding = isStory ? '48px 64px' : '44px 58px';

    // For offscreen rendering, use more opaque backgrounds since backdrop-filter is not supported by html2canvas
    const accentGlass = hexToRgba(themeStyles.accent, isOffscreen ? 0.65 : 0.22);
    const highlightGlass = hexToRgba(themeStyles.highlight, isOffscreen ? 0.55 : 0.18);
    const qrBorder = hexToRgba(themeStyles.highlight, isOffscreen ? 0.5 : 0.35);

    // Enhance border colors for offscreen rendering
    const glassBorder = isOffscreen ? increaseOpacity(themeStyles.glassBorder, 1.4) : themeStyles.glassBorder;
    const panelBorder = isOffscreen ? increaseOpacity(themeStyles.panelBorder, 1.3) : themeStyles.panelBorder;

    // Enhance text colors for better contrast in offscreen rendering
    const foreground = isOffscreen ? increaseOpacity(themeStyles.foreground, 1.05) : themeStyles.foreground;
    const subtitle = isOffscreen ? increaseOpacity(themeStyles.subtitle, 1.15) : themeStyles.subtitle;

    // Override glassTint and panelTint for offscreen rendering
    const glassTint = isOffscreen ? increaseOpacity(themeStyles.glassTint, 3.5) : themeStyles.glassTint;
    const panelTint = isOffscreen ? increaseOpacity(themeStyles.panelTint, 2.8) : themeStyles.panelTint;

    // Enhanced shadows for offscreen rendering (html2canvas renders shadows MUCH lighter - need aggressive values)
    const iconShadow = isOffscreen ? '0 25px 50px rgba(13,16,35,0.75), 0 10px 20px rgba(13,16,35,0.4)' : '0 25px 50px rgba(13,16,35,0.25)';
    const badgeShadow = isOffscreen ? '0 18px 36px rgba(12,18,35,0.75), 0 8px 16px rgba(12,18,35,0.4)' : '0 18px 36px rgba(12,18,35,0.25)';
    const cardShadow = isOffscreen ? '0 30px 60px rgba(15,16,38,0.8), 0 12px 24px rgba(15,16,38,0.5)' : '0 30px 60px rgba(15,16,38,0.28)';
    const footerShadow = isOffscreen ? '0 24px 65px rgba(7,11,29,0.85), 0 10px 26px rgba(7,11,29,0.5)' : '0 24px 65px rgba(7,11,29,0.32)';
    const qrShadow = isOffscreen ? '0 32px 55px rgba(9,13,28,0.95), 0 14px 22px rgba(9,13,28,0.6)' : '0 32px 55px rgba(9,13,28,0.45)';
    const ctaShadow = isOffscreen ? '0 22px 40px rgba(11,17,32,0.8), 0 9px 16px rgba(11,17,32,0.5)' : '0 22px 40px rgba(11,17,32,0.28)';

    const gradientStyle: CSSProperties = {
      background: themeStyles.gradient,
      color: foreground,
      borderRadius: '54px',
      padding,
      width,
      height,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden',
    };

    return (
      <div style={gradientStyle}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {themeStyles.glowLayers.map((layer, index) => {
            // Increase glow opacity significantly for offscreen rendering (html2canvas renders lighter)
            const glowOpacity = isOffscreen
              ? Math.min((layer.opacity ?? 1) * 2, 1)
              : (layer.opacity ?? 1);

            return (
              <div
                key={`glow-${theme}-${index}`}
                style={{
                  position: 'absolute',
                  width: layer.width,
                  height: layer.height,
                  top: layer.top,
                  right: layer.right,
                  bottom: layer.bottom,
                  left: layer.left,
                  background: layer.background,
                  filter: layer.blur,
                  opacity: glowOpacity,
                  transform: layer.rotate ? `rotate(${layer.rotate})` : undefined,
                  borderRadius: '9999px',
                }}
              />
            );
          })}
          {themeStyles.pattern && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: isOffscreen ? themeStyles.pattern.opacity * 3 : themeStyles.pattern.opacity,
                backgroundImage: themeStyles.pattern.backgroundImage,
                backgroundSize: themeStyles.pattern.backgroundSize,
                backgroundRepeat: 'repeat',
                filter: isOffscreen ? 'contrast(1.3) brightness(1.1) saturate(1.2)' : undefined,
              }}
            />
          )}
          {themeStyles.grain && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: isOffscreen ? themeStyles.grain.opacity * 2.5 : themeStyles.grain.opacity,
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.28) 1px, transparent 1px)',
                backgroundSize: themeStyles.grain.size,
                backgroundRepeat: 'repeat',
                filter: isOffscreen ? 'contrast(1.2) brightness(1.15)' : undefined,
              }}
            />
          )}
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: isStory ? '4.5rem' : '3.8rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '28px',
                  background: accentGlass,
                  border: `1px solid ${glassBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: isOffscreen ? undefined : 'blur(18px)',
                  boxShadow: iconShadow,
                }}
              >
                <Sparkles style={{ width: '42px', height: '42px', color: themeStyles.highlight }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5em',
                    color: subtitle,
                  }}
                >
                  birmesajmutluluk.com
                </p>
                <p
                  style={{
                    fontSize: headingFontSize,
                    fontWeight: 700,
                    marginTop: '12px',
                    lineHeight: 1.05,
                    color: foreground,
                  }}
                >
                  {copy.headline}
                </p>
                <p
                  style={{
                    marginTop: '14px',
                    fontSize: subheadlineFontSize,
                    lineHeight: 1.35,
                    color: subtitle,
                    maxWidth: format === 'landscape' ? '540px' : '460px',
                  }}
                >
                  {copy.subheadline}
                </p>
              </div>
            </div>
            <div
              style={{
                padding: '14px 28px',
                borderRadius: '9999px',
                background: highlightGlass,
                border: `1px solid ${hexToRgba(themeStyles.highlight, 0.45)}`,
                fontSize: '13px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.35em',
                color: '#0B1120',
                backdropFilter: isOffscreen ? undefined : 'blur(14px)',
                boxShadow: badgeShadow,
                whiteSpace: 'nowrap',
              }}
            >
              {copy.highlight || templateTitle}
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              borderRadius: '40px',
              border: `1px solid ${glassBorder}`,
              background: glassTint,
              padding: blockPadding,
              backdropFilter: isOffscreen ? undefined : 'blur(24px)',
              boxShadow: cardShadow,
            }}
          >
            <p
              style={{
                fontSize: subheadlineFontSize,
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: subtitle,
                textTransform: 'none',
              }}
            >
              {copy.messageIntro}
            </p>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5em',
                color: hexToRgba(foreground, 0.7),
                marginTop: '18px',
              }}
            >
              {recipientName} için
            </p>
            <p
              style={{
                fontSize: messageFontSize,
                marginTop: '32px',
                lineHeight: 1.18,
                color: foreground,
                textAlign: 'center',
              }}
            >
              "{truncatedMessage}"
            </p>
            <p
              style={{
                fontSize: signatureFontSize,
                marginTop: '48px',
                textAlign: 'right',
                fontWeight: 600,
                color: hexToRgba(foreground, 0.68),
              }}
            >
              — {senderName}
            </p>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            marginTop: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '42px',
            border: `1px solid ${panelBorder}`,
            background: panelTint,
            padding: footerPadding,
            backdropFilter: isOffscreen ? undefined : 'blur(24px)',
            boxShadow: footerShadow,
          }}
        >
          <div style={{ maxWidth: '60%' }}>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.45em',
                color: subtitle,
              }}
            >
              Hemen tara
            </p>
            <p
              style={{
                marginTop: '14px',
                fontSize: '22px',
                fontWeight: 600,
                letterSpacing: '0.32em',
                textTransform: 'lowercase',
                color: foreground,
              }}
            >
              {formattedUrl}
            </p>
            <p
              style={{
                marginTop: '10px',
                fontSize: '18px',
                color: hexToRgba(foreground, 0.72),
              }}
            >
              Kodu: {shortId.toUpperCase()}
            </p>
            <div
              style={{
                marginTop: '26px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 28px',
                borderRadius: '9999px',
                background: `linear-gradient(130deg, ${themeStyles.highlight} 0%, ${themeStyles.accent} 100%)`,
                color: '#0B1120',
                fontWeight: 700,
                fontSize: '20px',
                letterSpacing: '0.04em',
                boxShadow: ctaShadow,
              }}
            >
              <Sparkles style={{ width: '22px', height: '22px', color: '#0B1120' }} />
              <span>{copy.ctaLine}</span>
            </div>
          </div>
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Gizli mesaj QR kodu"
              crossOrigin="anonymous"
              style={{
                width: '208px',
                height: '208px',
                borderRadius: '36px',
                border: `1px solid ${qrBorder}`,
                backgroundColor: isOffscreen ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.96)',
                padding: '26px',
                boxShadow: qrShadow,
              }}
            />
          ) : (
            <div
              style={{
                width: '208px',
                height: '208px',
                borderRadius: '36px',
                border: `1px solid ${qrBorder}`,
                background: hexToRgba(themeStyles.accent, 0.14),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                color: hexToRgba(themeStyles.highlight, 0.75),
              }}
            >
              QR hazırlanıyor
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPreview = (format: ShareFormat, theme: VisualTheme) => {
    const { width, height } = formatConfig[format];
    const previewScale = format === 'story' ? 0.22 : format === 'square' ? 0.24 : 0.2;
    const previewWidth = width * previewScale;
    const previewHeight = height * previewScale;

    return (
      <div
        className="relative overflow-hidden rounded-[36px] shadow-2xl shadow-purple-200/60"
        style={{ width: previewWidth, height: previewHeight }}
      >
        <div
          className="origin-top-left"
          style={{
            transform: `scale(${previewScale})`,
            width,
            height,
          }}
        >
          {renderVisualContent(format, theme)}
        </div>
      </div>
    );
  };

  const generateImage = async (format: ShareFormat) => {
    const ref = formatRefs[format].current;
    if (!ref) return;

    setIsGenerating(true);
    try {
      // Wait for DOM to update
      await new Promise(resolve => setTimeout(resolve, 200));

      // Get HTML content
      const htmlContent = ref.outerHTML;
      const { width, height } = formatConfig[format];

      // Inline styles ve gerekli CSS'leri HTML'e ekle
      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `;

      console.log('Sending HTML to server for rendering...');

      // Server-side rendering API'sine gönder
      const response = await fetch('/api/render-html-to-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: fullHtml,
          width,
          height,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate image');
      }

      const { image } = await response.json();

      // İndir
      const link = document.createElement('a');
      link.href = image;
      link.download = `gizlimesaj-${shortId}-${format}-${selectedTheme}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Share image generation failed:', error);
      alert('Görsel oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsGenerating(false);
    }
  };

  const { label, hint, width, height } = formatConfig[selectedFormat];
  const theme = themeConfig[selectedTheme] ?? themeConfig['aurora-bloom'];

  const handleShareImage = async (format: ShareFormat) => {
    // Paylaşım için görseli indir - kullanıcı cihazından paylaşabilir
    toast.info('Görsel indiriliyor. İndirdikten sonra cihazınızdan paylaşabilirsiniz.');
    await generateImage(format);
  };

  return (
    <div className="relative space-y-4 sm:space-y-6">
      <div>
        <p className="text-sm font-semibold text-gray-800">Görsel olarak paylaş</p>
        <p className="text-xs text-gray-500">
          Kare, dikey ve yatay PNG şablonları ile mesajınızı farklı sosyal ağ formatlarında öne çıkarın.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(formatConfig) as ShareFormat[]).map((format) => (
          <button
            key={format}
            type="button"
            onClick={() => setSelectedFormat(format)}
            className={cn(
              'flex items-center gap-1.5 sm:gap-2 rounded-full border px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all active:scale-95',
              format === selectedFormat
                ? 'border-purple-400 bg-purple-100/90 text-purple-700 shadow-md ring-2 ring-purple-200/50'
                : 'border-gray-200 bg-white/80 text-gray-600 hover:border-purple-200 hover:text-purple-600 hover:shadow-sm'
            )}
          >
            <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {formatConfig[format].label}
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-xl shadow-purple-200/60 backdrop-blur-sm sm:p-6">
        <div className="flex flex-col items-center gap-6">
          {renderPreview(selectedFormat, selectedTheme)}
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">{label}</p>
            <p className="text-xs text-gray-500">
              {hint} • {width} × {height}px
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => handleShareImage(selectedFormat)}
              disabled={isGenerating}
              className="flex flex-1 items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-200/50 hover:from-purple-700 hover:to-pink-700"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isGenerating ? 'Görsel hazırlanıyor...' : `${label} PNG İndir`}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
          Stil Seçimi
        </p>
        <div className="space-y-4">
          {themeGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-500">
                  {group.title}
                </p>
                {group.description && (
                  <span className="text-[11px] text-gray-400">{group.description}</span>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide">
                {group.themes.map((themeKey) => {
                  const themeValue = themeConfig[themeKey];
                  if (!themeValue) return null;
                  return (
                    <button
                      key={themeKey}
                      type="button"
                      onClick={() => handleThemeSelection(themeKey)}
                      className={cn(
                        'flex min-w-[130px] sm:min-w-[152px] snap-start items-center gap-2 rounded-xl sm:rounded-2xl border px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm transition-all backdrop-blur-sm active:scale-95',
                        selectedTheme === themeKey
                          ? 'border-purple-400 bg-purple-100/90 text-purple-700 shadow-md ring-2 ring-purple-200/50'
                          : 'border-gray-200 bg-white/80 text-gray-600 hover:border-purple-200 hover:text-purple-600 hover:shadow-sm'
                      )}
                    >
                      <span
                        className="h-4 w-4 sm:h-5 sm:w-5 flex-none rounded-full border border-white/50 shadow-sm"
                        style={{ background: themeValue.gradient }}
                      />
                      <span className="flex-1 text-left font-medium truncate">{themeValue.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">{theme.description}</p>
      </div>

      {/* Off-screen full resolution canvases */}
      <div className="pointer-events-none fixed left-[-9999px] top-0 -z-50 flex gap-8 opacity-0 invisible">
        <div
          ref={storyRef}
          style={{
            width: formatConfig.story.width,
            height: formatConfig.story.height,
          }}
        >
          {renderVisualContent('story', selectedTheme, false)}
        </div>
        <div
          ref={landscapeRef}
          style={{
            width: formatConfig.landscape.width,
            height: formatConfig.landscape.height,
          }}
        >
          {renderVisualContent('landscape', selectedTheme, false)}
        </div>
        <div
          ref={squareRef}
          style={{
            width: formatConfig.square.width,
            height: formatConfig.square.height,
          }}
        >
          {renderVisualContent('square', selectedTheme, false)}
        </div>
      </div>
    </div>
  );
}

function extractPrimaryAudience(audience?: string | string[] | null): string {
  if (!audience) return 'default';
  if (Array.isArray(audience)) {
    return audience[0]?.toLowerCase() || 'default';
  }
  return audience.toLowerCase();
}

function audienceToTheme(audience?: string): VisualTheme {
  switch (audience) {
    case 'romantic':
    case 'love':
      return 'rose-poetry';
    case 'engagement':
    case 'proposal':
    case 'ring':
      return 'ring-lux';
    case 'anniversary':
    case 'wedding':
      return 'heart-beat';
    case 'family':
    case 'friendship':
      return 'aurora-bloom';
    case 'floral':
    case 'flowers':
    case 'bouquet':
      return 'floral-daydream';
    case 'boho':
    case 'sunset':
      return 'bear-hug';
    case 'elegant':
    case 'classic':
      return 'line-art-love';
    case 'minimal':
    case 'minimalist':
    case 'simple':
      return 'minimal-frost';
    case 'calm':
    case 'relax':
      return 'calm-horizon';
    case 'vintage':
      return 'rose-poetry';
    case 'zen':
    case 'meditation':
    case 'nature':
      return 'zen-garden';
    case 'professional':
    case 'corporate':
    case 'business':
      return 'corporate-vision';
    case 'luxury':
    case 'premium':
      return 'lux-gilded';
    case 'gratitude':
    case 'appreciation':
      return 'ember-noir';
    case 'birthday':
    case 'celebration':
      return 'lunar-dream';
    case 'fun':
    case 'teen':
    case 'emoji':
      return 'emoji-splash';
    case 'gaming':
    case 'stream':
    case 'esports':
      return 'gaming-neon';
    case 'party':
    case 'festival':
    case 'balloon':
    case 'celebrate':
      return 'balloon-fest';
    case 'colorful':
    case 'energetic':
      return 'prism-pop';
    case 'comic':
    case 'funny':
    case 'meme':
      return 'bubble-smiles';
    case 'retro':
    case 'nostalgia':
      return 'retro-wave';
    case 'tropical':
    case 'summer':
      return 'balloon-fest';
    case 'bear':
    case 'cute':
    case 'kids':
      return 'bear-hug';
    case 'daisy':
    case 'flower':
      return 'daisy-meadow';
    default:
      return 'aurora-bloom';
  }
}

function increaseOpacity(rgba: string, multiplier: number): string {
  // Extract rgba values from string like "rgba(255,255,255,0.12)"
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return rgba;

  const [, r, g, b, a] = match;
  const alpha = parseFloat(a || '1');
  const newAlpha = Math.min(alpha * multiplier, 1); // Cap at 1.0

  return `rgba(${r}, ${g}, ${b}, ${newAlpha})`;
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const cleanHex =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;

  const parsed = Number.parseInt(cleanHex, 16);
  const r = (parsed >> 16) & 255;
  const g = (parsed >> 8) & 255;
  const b = parsed & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
