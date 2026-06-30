/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  __karthikHudClock?: number;
  __karthikHudScroll?: () => void;
  __karthikHudMouse?: (event: MouseEvent) => void;
  __karthikHeroClock?: number;
  __karthikUfoScroll?: () => void;
  __karthikUfoResize?: () => void;
  __alienRagdollInitialized?: boolean;
  __alienRagdollStartScheduled?: boolean;
  __alienRagdollEngine?: {
    start: () => void;
    destroy: () => void;
  };
  __alienAbductionIntroInitialized?: boolean;
  __alienAbductionScroll?: () => void;
  __alienAbductionResize?: () => void;
  __portfolioIntroCompleteDispatched?: boolean;
}
