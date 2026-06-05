import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GlobeViewComponent } from './globe-view/globe-view.component';
import type { GlobeOutagePoint } from './outage.models';
import { FocusPomodoroComponent } from './focus-pomodoro/focus-pomodoro.component';
import { OutageSidebarComponent } from './outage-sidebar/outage-sidebar.component';

/**
 * When Focus mode is on but no outage is selected, the first key in this list that
 * exists in the active catalog is auto-selected.
 */
const FOCUS_FALLBACK_OUTAGE_KEYS: readonly string[] = ['simulated-github'];

/** Lo-fi ambient streams (YouTube embeds, bottom-left dock in Focus mode). */
const FOCUS_LOFI_OPTIONS: readonly {
  id: string;
  label: string;
  videoId: string | null;
}[] = [
  { id: 'off', label: 'Off', videoId: null },
  {
    id: 'lofi-jfk',
    label: 'lofi hip hop radio 📚 beats to relax/study to',
    videoId: 'jfKfPfyJRdk',
  },
  {
    id: 'lofi-classical',
    label: 'classical music radio 🎻 relaxing songs to read/study to',
    videoId: 'jXAEIWcGXwE',
  },
  {
    id: 'lofi-jazz',
    label: 'relaxing jazz music 🌹 cozy radio to study/chill to',
    videoId: 'A8jDx9TLMQc',
  },
  {
    id: 'lofi-fireplace',
    label: 'fireplace ambience 🔥 cozy sound to chill to',
    videoId: 'q_4KI-ChIIs',
  },
  {
    id: 'lofi-guitar',
    label: 'chill guitar radio 🎸 music to study/relax to',
    videoId: 'E_XmwjgRLz8',
  },
  {
    id: 'lofi-sleep-ambient',
    label: 'sleep ambient music 💤 relaxing radio to fall asleep to',
    videoId: 'xORCbIptqcc',
  },
];

/** Covers layout + WebGL churn while entering/leaving Focus mode */
const FOCUS_MODE_TRANSITION_MS = 1100;
const FOCUS_MODE_TRANSITION_MS_REDUCED = 280;

const PORTABLE_UI_MEDIA_QUERY =
  '(max-width: 640px), (orientation: landscape) and (max-height: 520px)';

@Component({
  selector: 'app-root',
  imports: [DecimalPipe, FocusPomodoroComponent, GlobeViewComponent, OutageSidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(OutageSidebarComponent) private outageSidebar?: OutageSidebarComponent;

  private focusTransitionClearId: ReturnType<typeof setTimeout> | null = null;
  private portableUiMql: MediaQueryList | null = null;

  private readonly onPortableUiChange = (): void => {
    if (!this.portableUiMql) {
      return;
    }
    this.portableUiActive = this.portableUiMql.matches;
    this.cdr.markForCheck();
  };

  portableUiActive =
    typeof globalThis !== 'undefined' &&
    typeof matchMedia !== 'undefined' &&
    matchMedia(PORTABLE_UI_MEDIA_QUERY).matches;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly sanitizer: DomSanitizer,
  ) {}

  /** Active simulation event: 'none' | 'solar-flare' | 'global-dns' | 'aws-collapse' */
  currentSimulation = 'none';

  dataLoaded = false;
  apiMode: 'live' | 'simulated' | 'loading' = 'loading';
  apiProvider = 'loading';

  get appMode(): 'live' | 'simulated' | 'loading' {
    return this.apiMode;
  }

  get modeLabel(): string {
    if (this.appMode === 'loading') return 'Loading';
    if (this.appMode === 'simulated') return 'Simulation Mode';
    return `Live: ${this.apiProvider.toUpperCase()}`;
  }

  get modeTooltip(): string {
    if (this.appMode === 'loading') return 'Fetching system outage data…';
    if (this.appMode === 'simulated') {
      if (this.currentSimulation !== 'none') {
        return 'Override active: Showing simulated disaster scenario (click Normal Simulation below to reset).';
      }
      return 'Connected to Simulated Sandbox (no StatusGator/Pingdom API keys configured in the backend environment).';
    }
    return `Connected to live ${this.modeLabel} API. Displaying real-time outages.`;
  }

  readonly focusLofiOptions = FOCUS_LOFI_OPTIONS;
  focusLofiSelectionId = 'off';
  focusLofiEmbedUrl: SafeResourceUrl | null = null;
  focusLofiSoundGateVisible = false;
  focusSoundMenuVisible = false;

  ngOnDestroy(): void {
    if (this.focusTransitionClearId !== null) {
      clearTimeout(this.focusTransitionClearId);
      this.focusTransitionClearId = null;
    }
    this.portableUiMql?.removeEventListener('change', this.onPortableUiChange);
    this.portableUiMql = null;
  }

  focusModeTransitionOverlay = false;
  focusMode = false;

  selectedOutage: GlobeOutagePoint | null = null;
  allOutages: GlobeOutagePoint[] = [];
  
  private sidebarExplicitOpen = false;
  private panelCloseAnimationStarted = false;
  sidebarPanelResizing = false;

  @HostBinding('style.--sidebar-inset.px')
  sidebarInsetPx = 0;

  @HostBinding('class.app-root--focus-mode')
  get focusModeHostClass(): boolean {
    return this.focusMode;
  }

  initialOutageQuery: string | null = null;

  get sidebarOpen(): boolean {
    return (
      this.selectedOutage !== null || this.sidebarExplicitOpen
    );
  }

  get focusModeLaunchVisible(): boolean {
    return !this.focusMode && (!this.sidebarOpen || !this.portableUiActive);
  }

  get searchLaunchShowsClose(): boolean {
    return this.sidebarOpen && !this.panelCloseAnimationStarted;
  }

  openOutageSearchSidebar(): void {
    this.sidebarExplicitOpen = true;
    this.panelCloseAnimationStarted = false;
    this.sidebarInsetPx = 640;
  }

  toggleFocusMode(): void {
    if (this.focusModeTransitionOverlay) {
      return;
    }

    this.focusModeTransitionOverlay = true;
    this.cdr.detectChanges();

    const runToggle = (): void => {
      this.focusMode = !this.focusMode;
      if (!this.focusMode) {
        this.focusLofiEmbedUrl = null;
        this.focusLofiSoundGateVisible = false;
        this.focusSoundMenuVisible = false;
      }
      if (this.focusMode) {
        this.panelCloseAnimationStarted = false;
        if (this.selectedOutage) {
          this.sidebarInsetPx = 0;
        }
        this.maybeDefaultLofi();
        this.reapplyFocusLofiEmbedIfNeeded();
      } else if (this.sidebarOpen) {
        this.sidebarInsetPx = 640;
      }
      this.syncUrlQueryParams();
      this.cdr.detectChanges();

      const ms = this.focusTransitionDurationMs();
      if (this.focusTransitionClearId !== null) {
        clearTimeout(this.focusTransitionClearId);
      }
      this.focusTransitionClearId = setTimeout(() => {
        this.focusModeTransitionOverlay = false;
        this.focusTransitionClearId = null;
        this.cdr.detectChanges();
      }, ms);
    };

    queueMicrotask(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          runToggle();
        });
      });
    });
  }

  private focusTransitionDurationMs(): number {
    if (typeof matchMedia === 'undefined') {
      return FOCUS_MODE_TRANSITION_MS;
    }
    return matchMedia('(prefers-reduced-motion: reduce)').matches
      ? FOCUS_MODE_TRANSITION_MS_REDUCED
      : FOCUS_MODE_TRANSITION_MS;
  }

  onSearchToggleClick(): void {
    if (this.sidebarOpen) {
      this.panelCloseAnimationStarted = true;
      this.cdr.detectChanges();
      this.outageSidebar?.onCloseClick();
    } else {
      this.openOutageSearchSidebar();
    }
  }

  onOutagesCatalog(event: { outages: GlobeOutagePoint[]; mode: 'live' | 'simulated'; provider: string }): void {
    this.allOutages = event.outages;
    this.apiMode = event.mode;
    this.apiProvider = event.provider;
    this.dataLoaded = true;
    
    // Maintain selection reference if outages list refreshes
    if (this.selectedOutage) {
      const match = event.outages.find(o => o.markerId === this.selectedOutage?.markerId);
      if (match) {
        this.selectedOutage = match;
      }
    } else if (this.focusMode) {
      this.applyFocusFallbackOutageIfNeeded();
    }
  }

  ngOnInit(): void {
    if (typeof window === 'undefined') return;
    if (typeof matchMedia !== 'undefined') {
      this.portableUiMql = matchMedia(PORTABLE_UI_MEDIA_QUERY);
      this.portableUiActive = this.portableUiMql.matches;
      this.portableUiMql.addEventListener('change', this.onPortableUiChange);
    }
    const u = new URL(window.location.href);
    const rawOutage = u.searchParams.get('outage');
    this.initialOutageQuery = rawOutage?.trim() ? rawOutage.trim() : null;
    this.focusMode = parseFocusQueryParam(u.searchParams.get('focus'));
    if (this.focusMode) {
      this.panelCloseAnimationStarted = false;
      if (this.selectedOutage) {
        this.sidebarInsetPx = 0;
      }
    }
    queueMicrotask(() => {
      if (this.focusMode) {
        this.maybeDefaultLofi();
        this.reapplyFocusLofiEmbedIfNeeded();
      }
    });
  }

  toggleFocusSoundMenu(): void {
    this.focusSoundMenuVisible = !this.focusSoundMenuVisible;
  }

  onSoundMenuCloseFromPomodoro(): void {
    this.focusSoundMenuVisible = false;
  }

  private maybeDefaultLofi(): void {
    if (this.focusLofiSelectionId === 'off') {
      this.focusLofiSelectionId = 'lofi-jfk';
    }
  }

  onOutageSelected(outage: GlobeOutagePoint): void {
    this.selectedOutage = outage;
    this.panelCloseAnimationStarted = false;
    this.sidebarInsetPx =
      this.focusMode && this.selectedOutage ? 0 : 640;
    this.syncUrlQueryParams();
  }

  onSimulationChange(disasterType: string): void {
    this.currentSimulation = disasterType;
  }

  onSidebarClosing(): void {
    this.panelCloseAnimationStarted = true;
    this.sidebarInsetPx = 0;
  }

  onSidebarClosed(): void {
    this.selectedOutage = null;
    this.sidebarExplicitOpen = false;
    this.panelCloseAnimationStarted = false;
    this.syncUrlQueryParams();
  }

  onSidebarLayoutWidth(px: number): void {
    this.sidebarInsetPx = Math.max(0, Math.round(px));
  }

  onFocusLofiChange(ev: Event): void {
    const id = (ev.target as HTMLSelectElement).value;
    this.focusLofiSelectionId = id;
    this.reapplyFocusLofiEmbedIfNeeded();
  }

  private reapplyFocusLofiEmbedIfNeeded(): void {
    if (!this.focusMode) {
      this.focusLofiEmbedUrl = null;
      this.focusLofiSoundGateVisible = false;
      return;
    }
    const opt = FOCUS_LOFI_OPTIONS.find((o) => o.id === this.focusLofiSelectionId);
    const vid = opt?.videoId;
    if (!vid) {
      this.focusLofiEmbedUrl = null;
      this.focusLofiSoundGateVisible = false;
      return;
    }
    const raw = `https://www.youtube.com/embed/${encodeURIComponent(vid)}?autoplay=1&playsinline=1&mute=1&lucent_ap=${Date.now()}`;
    this.focusLofiEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(raw);
    this.focusLofiSoundGateVisible = true;
  }

  unlockFocusLofiSound(iframe: HTMLIFrameElement): void {
    const opt = FOCUS_LOFI_OPTIONS.find((o) => o.id === this.focusLofiSelectionId);
    const vid = opt?.videoId;
    if (!vid) {
      return;
    }
    const raw = `https://www.youtube.com/embed/${encodeURIComponent(vid)}?autoplay=1&playsinline=1&mute=0&lucent_ap=${Date.now()}`;
    iframe.src = raw;
    this.focusLofiEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(raw);
    this.focusLofiSoundGateVisible = false;
  }

  private applyFocusFallbackOutageIfNeeded(): void {
    if (this.selectedOutage || this.allOutages.length === 0) {
      return;
    }
    for (const key of FOCUS_FALLBACK_OUTAGE_KEYS) {
      const want = key.toLowerCase();
      const hit = this.allOutages.find(
        (o) => o.markerId.toLowerCase() === want,
      );
      if (hit) {
        this.onOutageSelected(hit);
        return;
      }
    }
  }

  private syncUrlQueryParams(): void {
    if (typeof window === 'undefined') return;
    const u = new URL(window.location.href);
    if (this.selectedOutage?.markerId) {
      u.searchParams.set('outage', this.selectedOutage.markerId);
    } else {
      u.searchParams.delete('outage');
    }
    if (this.focusMode) {
      u.searchParams.set('focus', '1');
    } else {
      u.searchParams.delete('focus');
    }
    window.history.replaceState(window.history.state, '', u.toString());
  }
}

function parseFocusQueryParam(raw: string | null): boolean {
  if (raw === null) return false;
  const v = raw.trim().toLowerCase();
  if (v === '' || v === '1' || v === 'true' || v === 'yes' || v === 'on') {
    return true;
  }
  return false;
}
