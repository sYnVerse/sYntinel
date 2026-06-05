import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import type { GlobeOutagePoint } from '../outage.models';

@Component({
  selector: 'app-outage-sidebar',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './outage-sidebar.component.html',
  styleUrl: './outage-sidebar.component.css',
})
export class OutageSidebarComponent implements AfterViewInit, OnChanges, OnDestroy {
  private static readonly slideMs = 380;
  private static readonly mobileSidebarMaxCssPx = 768;

  private readonly ngZone = inject(NgZone);

  @Input() outage: GlobeOutagePoint | null = null;
  @Input() allOutages: GlobeOutagePoint[] = [];
  @Input() currentSimulation = 'none';
  @Input() dataLoaded = false;
  @Input() apiMode: 'live' | 'simulated' | 'loading' = 'loading';
  @Input() apiProvider = 'loading';

  get appMode(): 'live' | 'simulated' | 'loading' {
    return this.apiMode;
  }

  get modeLabel(): string {
    if (this.appMode === 'loading') return 'Loading';
    if (this.appMode === 'simulated') return 'Simulation Mode';
    return `Live: ${this.apiProvider.toUpperCase()}`;
  }

  get modeExplanation(): string {
    if (this.appMode === 'loading') return 'Loading status data…';
    if (this.appMode === 'simulated') {
      if (this.currentSimulation !== 'none') {
        return 'Disaster preset override active';
      }
      return 'Running in simulated sandbox mode';
    }
    return `Connected to live ${this.modeLabel} feed`;
  }
  
  @Output() closing = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() outagePick = new EventEmitter<GlobeOutagePoint>();
  @Output() simulationChange = new EventEmitter<string>();
  @Output() resizeActiveChange = new EventEmitter<boolean>();
  @Output() layoutWidthPxChange = new EventEmitter<number>();

  @ViewChild('panelRef', { read: ElementRef })
  panelRef?: ElementRef<HTMLElement>;

  panelWidthPx: number | null = 640;
  isMobileSidebarLayout = false;
  panelWidthDragActive = false;
  panelOpen = false;

  private resizeStartX = 0;
  private resizeStartWidth = 0;
  private layoutEmitRaf = 0;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  outageSearchSectionExpanded = true;
  simulatorSectionExpanded = false;

  get outageSearchDockSummary(): string {
    const active = this.allOutages.filter(o => o.status !== 'up').length;
    if (!this.dataLoaded) return 'Loading…';
    return active === 0 ? 'All systems operational' : (active === 1 ? '1 active incident' : `${active} active incidents`);
  }

  get sortedBrowseOutages(): GlobeOutagePoint[] {
    return this.allOutages.slice().sort((a, b) => {
      const statusWeight = { down: 3, degraded: 2, up: 1 };
      const weightA = statusWeight[a.status] || 0;
      const weightB = statusWeight[b.status] || 0;
      if (weightA !== weightB) {
        return weightB - weightA;
      }
      return b.latencyMs - a.latencyMs;
    });
  }

  pickOutageFromBrowse(s: GlobeOutagePoint): void {
    this.outagePick.emit(s);
  }

  isActiveBrowseCard(s: GlobeOutagePoint): boolean {
    return this.outage?.markerId === s.markerId;
  }

  triggerSimulation(disasterType: string): void {
    this.simulationChange.emit(disasterType);
  }

  private mobileLayoutMql: MediaQueryList | null = null;

  private readonly onMobileLayoutMqlChange = (): void => {
    this.applyMobileSidebarLayoutFromMql();
  };

  private readonly onWindowResizeForMobileWidth = (): void => {
    if (!this.isMobileSidebarLayout) return;
    this.ngZone.run(() => {
      this.panelWidthPx = window.innerWidth;
      this.scheduleLayoutWidthEmit();
    });
  };

  ngAfterViewInit(): void {
    this.setupMobileSidebarLayoutListener();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.panelOpen = true;
      });
    });
    queueMicrotask(() => this.emitLayoutWidth());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['outage']) {
      queueMicrotask(() => this.emitLayoutWidth());
    }
  }

  toggleOutageSearchSection(): void {
    this.outageSearchSectionExpanded = !this.outageSearchSectionExpanded;
  }

  toggleSimulatorSection(): void {
    this.simulatorSectionExpanded = !this.simulatorSectionExpanded;
  }

  onCloseClick(): void {
    if (this.closeTimer !== null) return;
    this.closing.emit();
    this.panelOpen = false;
    this.closeTimer = setTimeout(() => {
      this.closeTimer = null;
      this.closed.emit();
    }, OutageSidebarComponent.slideMs);
  }

  onResizeMouseDown(ev: MouseEvent): void {
    if (this.isMobileSidebarLayout) return;
    ev.preventDefault();
    this.panelWidthDragActive = true;
    this.resizeActiveChange.emit(true);
    this.resizeStartX = ev.clientX;
    this.resizeStartWidth =
      this.panelWidthPx ??
      (ev.currentTarget as HTMLElement).closest('.panel')?.getBoundingClientRect().width ??
      640;

    window.addEventListener('mousemove', this.onResizeMouseMove);
    window.addEventListener('mouseup', this.onResizeMouseUp);
  }

  ngOnDestroy(): void {
    this.teardownMobileSidebarLayoutListener();
    window.removeEventListener('mousemove', this.onResizeMouseMove);
    window.removeEventListener('mouseup', this.onResizeMouseUp);
    if (this.layoutEmitRaf) cancelAnimationFrame(this.layoutEmitRaf);
    if (this.closeTimer !== null) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    if (this.panelWidthDragActive) this.resizeActiveChange.emit(false);
  }

  private readonly onResizeMouseMove = (ev: MouseEvent): void => {
    if (!this.panelWidthDragActive) return;

    const delta = this.resizeStartX - ev.clientX;
    const next = this.resizeStartWidth + delta;
    const gutter = 12;
    const max = Math.max(gutter + 160, window.innerWidth - gutter);
    const minCandidate = Math.min(520, window.innerWidth);
    const min = Math.min(minCandidate, max);
    this.panelWidthPx = Math.max(min, Math.min(max, next));
    this.scheduleLayoutWidthEmit();
  };

  private readonly onResizeMouseUp = (): void => {
    if (!this.panelWidthDragActive) return;
    this.panelWidthDragActive = false;
    this.resizeActiveChange.emit(false);
    window.removeEventListener('mousemove', this.onResizeMouseMove);
    window.removeEventListener('mouseup', this.onResizeMouseUp);
    if (this.layoutEmitRaf) {
      cancelAnimationFrame(this.layoutEmitRaf);
      this.layoutEmitRaf = 0;
    }
    this.emitLayoutWidth();
  };

  private scheduleLayoutWidthEmit(): void {
    if (this.layoutEmitRaf) return;
    this.layoutEmitRaf = requestAnimationFrame(() => {
      this.layoutEmitRaf = 0;
      this.emitLayoutWidth();
    });
  }

  private emitLayoutWidth(): void {
    const el = this.panelRef?.nativeElement;
    if (!el) return;
    const w = Math.round(el.getBoundingClientRect().width);
    if (w > 0) this.layoutWidthPxChange.emit(w);
  }

  private setupMobileSidebarLayoutListener(): void {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const q = `(max-width: ${OutageSidebarComponent.mobileSidebarMaxCssPx}px)`;
    this.mobileLayoutMql = window.matchMedia(q);
    this.applyMobileSidebarLayoutFromMql();
    this.mobileLayoutMql.addEventListener('change', this.onMobileLayoutMqlChange);
    window.addEventListener('resize', this.onWindowResizeForMobileWidth);
  }

  private teardownMobileSidebarLayoutListener(): void {
    this.mobileLayoutMql?.removeEventListener('change', this.onMobileLayoutMqlChange);
    this.mobileLayoutMql = null;
    window.removeEventListener('resize', this.onWindowResizeForMobileWidth);
  }

  private applyMobileSidebarLayoutFromMql(): void {
    const next = this.mobileLayoutMql?.matches ?? false;
    this.ngZone.run(() => {
      this.isMobileSidebarLayout = next;
      if (next) {
        this.panelWidthPx = window.innerWidth;
      } else if (this.panelWidthPx === null || this.panelWidthPx >= window.innerWidth) {
        this.panelWidthPx = 640;
      }
      this.scheduleLayoutWidthEmit();
    });
  }
}
