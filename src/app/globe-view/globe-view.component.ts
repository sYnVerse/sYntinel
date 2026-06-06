import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, firstValueFrom, of } from 'rxjs';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  OnDestroy,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import Globe from 'globe.gl';
import type { GlobeInstance } from 'globe.gl';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { environment } from '../../environments/environment';
import {
  mapPointMarkerId,
  type GlobeMapPoint,
} from '../globe-map.models';
import {
  type GlobeOutagePoint,
  type OutageDto,
  toGlobeOutagePoint,
} from '../outage.models';
import {
  createDayNightGlobeMaterial,
  sunSubSolarPoint,
} from './day-night-globe';

interface GeoFeature {
  properties: { ISO_A2?: string };
  geometry: {
    type: string;
    coordinates: unknown;
  };
}

interface BorderPath {
  pnts: [number, number][];
  style: 'base' | 'glow1' | 'glow2';
}

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

function easeOutQuint(t: number): number {
  return 1 - Math.pow(1 - t, 5);
}

interface GlobeAssetPreload {
  dayTex: THREE.Texture;
  nightTex: THREE.Texture;
  countryFeatures: GeoFeature[];
  borderPaths: BorderPath[];
  disposeTextures(): void;
}

@Component({
  selector: 'app-globe-view',
  standalone: true,
  template: `
    <div class="globe-shell">
      @if (globeLoading) {
        <div class="globe-loading" role="status" aria-live="polite">
          <div class="globe-loading-inner">
            <div class="globe-loading-spinner" aria-hidden="true"></div>
            <span class="globe-loading-label">Loading globe…</span>
          </div>
        </div>
      }
      <div #globeHost class="globe-host"></div>
    </div>
  `,
  styleUrl: './globe-view.component.css',
})
export class GlobeViewComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('globeHost', { static: true })
  globeHost!: ElementRef<HTMLElement>;

  @Output() outageSelected = new EventEmitter<GlobeOutagePoint>();
  @Output() outagesCatalogChange = new EventEmitter<{
    outages: GlobeOutagePoint[];
    mode: 'live' | 'simulated';
    provider: string;
  }>();

  @Input() sidebarOpen = false;
  @Input() @HostBinding('class.globe-inset-snap') sidebarInsetSnap = false;
  @Input() @HostBinding('class.globe-view--focus') focusMode = false;
  @Input() selectedOutage: GlobeOutagePoint | null = null;
  @Input() currentSimulation = 'none';
  @Input() initialOutageQuery: string | null = null;

  globeLoading = true;

  private globe: GlobeInstance | null = null;
  private alive = false;

  private countryFeatures: GeoFeature[] | null = null;
  private borderPaths: BorderPath[] | null = null;

  private readonly minCameraAltitude = 0.006;
  private readonly initialGlobeAltitude = 2.65;
  private readonly orbitAutoRotateSpeedDefault = 0.04;
  private readonly orbitAutoRotateSpeedFocus = 0.15;
  private readonly focusModeInitialViewTransitionMs = 700;
  private readonly selectedFocusAltitude = 0.42;
  private readonly selectedFocusTransitionMs = 900;
  private readonly markerRadiusMax = 0.28;
  private readonly markerRadiusMin = 0.0022;
  private readonly markerHoverScale = 1.45;
  private markerHitTargetRadiusFactor = 2.85;
  private markerHitTargetHeightFactor = 1.12;
  private readonly markerHitTargetRadiusFactorFinePointer = 2.85;
  private readonly markerHitTargetHeightFactorFinePointer = 1.12;
  private readonly markerHitTargetRadiusFactorCoarsePointer = 5;
  private readonly markerHitTargetHeightFactorCoarsePointer = 1.5;
  private readonly streamMarkerVisibleName = 'outageMarkerVisible';
  private readonly streamMarkerHitName = 'outageMarkerHit';
  private readonly markerAltitudeMin = 0.003;
  private readonly markerAltitudeMax = 0.5;
  private readonly markerAltitudeFocusClearance = 0.045;
  private readonly streamMarkerEmissiveIntensity = 1.05;
  private readonly streamMarkerHoverEmissiveIntensity = 0.68;
  private readonly initialGlobeLat = 28;
  private readonly initialGlobeLng = -92;
  private readonly rotateDelayMs = 1250;
  private readonly introScaleDurationMs = 600;
  private readonly introRotationDurationMs = 1200;
  private introAnimationActive = false;
  private introAnimationStartTime = 0;
  private introScene: THREE.Scene | null = null;
  private readonly introRotAxis = new THREE.Vector3(0, 1, 0);

  private rotateTimer: ReturnType<typeof setTimeout> | null = null;
  private autoRotateEnabled = false;
  private hoveredMarkerId: string | null = null;

  private bloomConfigured = false;
  private globeBloomPass: InstanceType<typeof UnrealBloomPass> | null = null;
  private readonly globeDayTextureBloomCap = 0.28;
  private readonly globeBloomStrength = 0.32;
  private readonly globeBloomRadius = 0.55;
  private readonly globeBloomThreshold = 0.34;
  private readonly globeAtmosphereColor = 'rgba(255, 255, 255, 0.42)';
  private readonly globeAtmosphereAltitude = 0.04;
  private readonly focusGlobeDayTextureCap = 0.98;
  private readonly focusGlobeLuminanceGain = 1.72;

  private readonly geoJsonUrl =
    'https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson';
  private readonly globeDayTextureUrl = '/globe/nasa-blue-marble.jpg';
  private readonly globeNightTextureUrl = '/globe/nasa-earth-at-night.jpg';

  private outagePoints: GlobeOutagePoint[] = [];
  private outagesRefreshIntervalMs = 30_000;
  private outagesRefreshIntervalId: ReturnType<typeof setInterval> | null = null;
  private dayNightMaterial: THREE.ShaderMaterial | null = null;
  private dayNightRaf = 0;
  private currentAltitude = this.initialGlobeAltitude;
  private lastFocusedMarkerId: string | null = null;
  private initialOutageHandled = false;
  private outagesInitialFetchCompleted = false;

  private layoutObserver: ResizeObserver | null = null;
  private layoutSyncRaf = 0;
  private readonly windowResizeHandler = (): void => this.scheduleGlobeLayoutSync();
  private streamCylinderSharedGeometry: THREE.BufferGeometry | null = null;
  private streamMarkerHitMaterial: THREE.MeshBasicMaterial | null = null;
  private readonly tmpGlobeCenter = new THREE.Vector3();

  private scheduleGlobeLayoutSync(): void {
    if (!this.alive) return;
    if (this.layoutSyncRaf) return;
    this.layoutSyncRaf = requestAnimationFrame(() => {
      this.layoutSyncRaf = 0;
      this.syncGlobeLayout();
    });
  }

  constructor(
    private readonly ngZone: NgZone,
    private readonly http: HttpClient,
  ) {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => this.initGlobe());
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.applyOrbitPolicies();
    this.syncSelectedMapFocus();
    if (changes['selectedOutage']) {
      queueMicrotask(() => this.refreshMapMarkersOnGlobe());
    }
    if (changes['sidebarOpen'] || changes['focusMode']) {
      queueMicrotask(() => this.scheduleGlobeLayoutSync());
    }
    if (changes['focusMode']) {
      const enteringFocus =
        changes['focusMode'].currentValue === true &&
        changes['focusMode'].previousValue !== true;
      queueMicrotask(() => {
        this.applyFocusModeRendering();
        if (enteringFocus) {
          this.resetGlobeToInitialViewForFocus();
        }
      });
    }
    if (changes['currentSimulation'] && !changes['currentSimulation'].firstChange) {
      void this.fetchAndApplyOutages(false);
    }
  }

  ngOnDestroy(): void {
    this.alive = false;
    this.stopOutagesRefreshTimer();
    if (this.dayNightRaf) cancelAnimationFrame(this.dayNightRaf);
    this.dayNightRaf = 0;
    this.dayNightMaterial = null;
    if (this.rotateTimer !== null) clearTimeout(this.rotateTimer);
    if (this.layoutSyncRaf) cancelAnimationFrame(this.layoutSyncRaf);
    if (this.layoutObserver) {
      this.layoutObserver.disconnect();
      this.layoutObserver = null;
    }
    window.removeEventListener('resize', this.windowResizeHandler);

    if (this.globe) {
      try {
        this.globe._destructor();
      } catch {
        /* ignore */
      }
      this.globe = null;
      delete (globalThis as unknown as { globe?: GlobeInstance }).globe;
    }
    this.globeHost.nativeElement.replaceChildren();
  }

  private initGlobe(): void {
    this.alive = true;
    this.configureMarkerHitTargets();
    const el = this.globeHost.nativeElement;

    this.layoutObserver = new ResizeObserver(() => this.scheduleGlobeLayoutSync());
    this.layoutObserver.observe(el);
    window.addEventListener('resize', this.windowResizeHandler);

    void this.preloadGlobeAssets().then((preload) => {
      if (!this.alive) {
        preload?.disposeTextures();
        this.ngZone.run(() => {
          this.globeLoading = false;
        });
        return;
      }
      if (!preload) {
        console.error('Globe preload failed; skipping globe init.');
        this.ngZone.run(() => {
          this.globeLoading = false;
        });
        return;
      }
      this.countryFeatures = preload.countryFeatures;
      this.borderPaths = preload.borderPaths;
      this.instantiateGlobe(el, preload);
      this.syncSelectedMapFocus();
      void this.fetchAndApplyOutages(true);
      this.startOutagesRefreshTimer();
    });
  }

  private async preloadGlobeAssets(): Promise<GlobeAssetPreload | null> {
    const loader = new THREE.TextureLoader();
    const geoJsonPromise = fetch(this.geoJsonUrl)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<{ features: GeoFeature[] }>;
      })
      .catch((err) => {
        console.error('GeoJSON fetch failed:', err);
        return { features: [] as GeoFeature[] };
      });

    let dayTex: THREE.Texture;
    let nightTex: THREE.Texture;
    let geoData: { features: GeoFeature[] };
    try {
      [dayTex, nightTex, geoData] = await Promise.all([
        loader.loadAsync(this.globeDayTextureUrl),
        loader.loadAsync(this.globeNightTextureUrl),
        geoJsonPromise,
      ]);
    } catch (err) {
      console.error('Globe day/night textures / GeoJSON preload failed:', err);
      return null;
    }

    const countryFeatures = geoData.features.filter((f) => f.properties.ISO_A2 !== 'AQ');
    const borderPaths = geojsonToBorderPaths(countryFeatures);

    return {
      dayTex,
      nightTex,
      countryFeatures,
      borderPaths,
      disposeTextures: () => {
        dayTex.dispose();
        nightTex.dispose();
      },
    };
  }

  private async fetchAndApplyOutages(isInitial: boolean): Promise<void> {
    if (!this.alive) return;
    const url = `${environment.outagesUrl}?simulate=${encodeURIComponent(this.currentSimulation)}`;
    const response = await firstValueFrom(
      this.http.get<OutageDto[]>(url, { observe: 'response' }).pipe(
        catchError((err) => {
          console.error('Outages API failed:', err);
          return of(null);
        }),
      ),
    );
    if (!this.alive) return;
    const rows = response?.body || [];
    const mode = (response?.headers.get('X-sYntinel-Mode') as 'live' | 'simulated') || 'simulated';
    const provider = response?.headers.get('X-sYntinel-Provider') || 'simulated';

    this.outagePoints = this.outageDtosToPoints(rows);
    if (isInitial) this.outagesInitialFetchCompleted = true;
    this.ngZone.run(() => this.outagesCatalogChange.emit({
      outages: this.outagePoints.slice(),
      mode,
      provider
    }));
    if (this.globe) {
      this.refreshMapMarkersOnGlobe();
      this.syncSelectedMapFocus();
    }
    this.tryEmitInitialOutageQuery();
  }

  private outageDtosToPoints(rows: OutageDto[]): GlobeOutagePoint[] {
    return rows
      .map((r) => toGlobeOutagePoint(r))
      .filter((p): p is GlobeOutagePoint => p !== null);
  }

  private startOutagesRefreshTimer(): void {
    this.stopOutagesRefreshTimer();
    this.outagesRefreshIntervalId = setInterval(() => {
      if (!this.alive || !this.globe) return;
      void this.refreshOutagesFromApi();
    }, this.outagesRefreshIntervalMs);
  }

  private stopOutagesRefreshTimer(): void {
    if (this.outagesRefreshIntervalId !== null) {
      clearInterval(this.outagesRefreshIntervalId);
      this.outagesRefreshIntervalId = null;
    }
  }

  private async refreshOutagesFromApi(): Promise<void> {
    await this.fetchAndApplyOutages(false);
  }

  private instantiateGlobe(el: HTMLElement, preload: GlobeAssetPreload): void {
    this.globe = new Globe(el, {
      waitForGlobeReady: true,
      animateIn: false,
      rendererConfig: {
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      },
    });

    queueMicrotask(() => this.syncGlobeLayout());

    const globe = this.globe;
    (globalThis as unknown as { globe?: GlobeInstance }).globe = globe;

    globe.backgroundColor('rgba(0,0,0,0)');
    globe.showGraticules(false);
    globe.showGlobe(true);
    globe.globeImageUrl(null as unknown as string);

    globe
      .pointsData([])
      .customThreeObject((d: object) =>
        this.createMapMarkerGroup(d as GlobeMapPoint),
      )
      .customThreeObjectUpdate((obj, d) =>
        this.updateMapMarkerGroup(
          obj as THREE.Group,
          d as GlobeMapPoint,
          globe.getGlobeRadius(),
        ),
      );

    globe.onZoom((pov) => {
      const { altitude, lat, lng } = pov as {
        altitude: number;
        lat: number;
        lng: number;
      };
      if (this.dayNightMaterial) {
        this.dayNightMaterial.uniforms['globeRotation'].value.set(lng, lat);
      }
      this.onGlobeAltitudeChanged(globe, altitude);
    });

    globe.onCustomLayerClick((point) => {
      const p = point as GlobeMapPoint | null;
      if (!p) return;
      void this.onMapMarkerClicked(p);
    });

    globe.onCustomLayerHover((point) => {
      const id = point ? mapPointMarkerId(point as GlobeMapPoint) : null;
      if (id === this.hoveredMarkerId) return;
      this.hoveredMarkerId = id;
      this.refreshMapMarkersOnGlobe();
    });

    globe.onGlobeReady(() => {
      this.applyRendererPerformance(globe);
      this.configureBloom(globe);

      {
        const controlsEarly = globe.controls?.();
        if (controlsEarly) {
          const globeR = globe.getGlobeRadius();
          controlsEarly.minDistance = globeR * (1 + this.minCameraAltitude);
        }
      }

      const mat = createDayNightGlobeMaterial(
        preload.dayTex,
        preload.nightTex,
        this.globeDayTextureBloomCap,
      );
      this.dayNightMaterial = mat;
      const [sx, sy] = sunSubSolarPoint(Date.now());
      mat.uniforms['sunPosition'].value.set(sx, sy);
      const pov = globe.pointOfView();
      mat.uniforms['globeRotation'].value.set(pov.lng, pov.lat);
      globe.globeMaterial(mat);

      queueMicrotask(() => {
        if (!this.alive || !this.globe) return;
        this.applyFocusModeRendering();
      });

      this.rotateTimer = setTimeout(() => {
        this.autoRotateEnabled = true;
        const c = globe.controls?.();
        if (c) {
          c.enableDamping = true;
          c.dampingFactor = 0.06;
          c.autoRotateSpeed = this.orbitAutoRotateSpeedDefault;
        }
        this.applyOrbitPolicies();
      }, this.rotateDelayMs);

      this.syncGlobeLayout();
      this.refreshMapMarkersOnGlobe();

      const scene = globe.scene();
      scene.scale.setScalar(1e-6);
      scene.setRotationFromAxisAngle(this.introRotAxis, Math.PI * 2);
      this.introScene = scene;
      this.introAnimationActive = false;

      this.dayNightTick();
      this.onGlobeAltitudeChanged(globe, globe.pointOfView().altitude);
      this.scheduleRevealGlobeAndStartIntro(globe);
    });

    globe.pointOfView(
      {
        lat: this.initialGlobeLat,
        lng: this.initialGlobeLng,
        altitude: this.initialGlobeAltitude,
      },
      0,
    );
  }

  private scheduleRevealGlobeAndStartIntro(globe: GlobeInstance): void {
    requestAnimationFrame(() => {
      if (!this.alive) return;
      requestAnimationFrame(() => {
        if (!this.alive) return;
        try {
          globe.renderer().render(globe.scene(), globe.camera());
        } catch {
          /* ignore */
        }
        if (this.alive && this.globe) {
          this.applyFocusModeRendering();
        }
        this.introAnimationActive = true;
        this.introAnimationStartTime = performance.now();
        this.ngZone.run(() => {
          this.globeLoading = false;
        });
      });
    });
  }

  private applyRendererPerformance(globe: GlobeInstance): void {
    const r = globe.renderer();
    const dpr =
      typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    r.setPixelRatio(Math.min(dpr, 1.5));
  }

  private resetGlobeToInitialViewForFocus(): void {
    if (!this.globe || !this.focusMode) return;
    this.globe.pointOfView(
      {
        lat: this.initialGlobeLat,
        lng: this.initialGlobeLng,
        altitude: this.initialGlobeAltitude,
      },
      this.focusModeInitialViewTransitionMs,
    );
  }

  private applyFocusModeRendering(): void {
    this.applyGlobeBackdropMode();
    if (!this.globe) return;
    this.applyAtmosphereForFocus(this.globe);
    this.applyGeoLayers(this.globe);
    this.applyBloomForFocus();
    this.applyFocusGlobeBrightness();
  }

  private applyFocusGlobeBrightness(): void {
    if (!this.globe) return;
    const mat = this.globe.globeMaterial() as THREE.ShaderMaterial;
    if (!(mat instanceof THREE.ShaderMaterial) || !mat.uniforms) return;

    const gain = mat.uniforms['luminanceGain'];
    const cap = mat.uniforms['globeDayTextureCap'];
    if (gain) {
      gain.value = this.focusMode ? this.focusGlobeLuminanceGain : 1.0;
    }
    if (cap) {
      cap.value = this.focusMode
        ? this.focusGlobeDayTextureCap
        : this.globeDayTextureBloomCap;
    }
    this.dayNightMaterial = mat;
  }

  private applyGlobeBackdropMode(): void {
    if (!this.globe) return;
    if (this.focusMode) {
      this.globe.backgroundColor('rgba(0,0,0,0)');
    } else {
      this.globe.backgroundColor('#000000');
    }
    const canvas = this.globe.renderer()?.domElement as HTMLCanvasElement | undefined;
    if (canvas) {
      canvas.style.background = this.focusMode ? 'transparent' : '';
    }
  }

  private applyAtmosphereForFocus(globe: GlobeInstance): void {
    if (this.focusMode) {
      globe.showAtmosphere(false);
    } else {
      globe
        .showAtmosphere(true)
        .atmosphereColor(this.globeAtmosphereColor)
        .atmosphereAltitude(this.globeAtmosphereAltitude);
    }
  }

  private applyGeoLayers(globe: GlobeInstance): void {
    const feats = this.focusMode ? [] : (this.countryFeatures ?? []);
    const paths = this.focusMode ? [] : (this.borderPaths ?? []);
    globe
      .polygonsData(feats)
      .polygonAltitude(() => 0.0015)
      .polygonCapColor(() => 'rgba(0,0,0,0)')
      .polygonSideColor(() => 'rgba(0,0,0,0)')
      .polygonStrokeColor(() => null)
      .polygonsTransitionDuration(0)
      .pathsData(paths)
      .pathPoints('pnts')
      .pathPointLat((p: [number, number]) => p[0])
      .pathPointLng((p: [number, number]) => p[1])
      .pathPointAlt((path: object) => {
        const style = (path as BorderPath).style;
        if (style === 'glow1') return 0.0104;
        if (style === 'glow2') return 0.0108;
        return 0.01;
      })
      .pathStroke((path: object) => {
        const style = (path as BorderPath).style;
        if (style === 'glow1') return 0.6;
        if (style === 'glow2') return 0.85;
        return null;
      })
      .pathColor((path: object) => {
        const style = (path as BorderPath).style;
        if (style === 'glow1') return 'rgba(150,225,255,0.22)';
        if (style === 'glow2') return 'rgba(130,210,240,0.14)';
        return 'rgba(240,245,250,0.42)';
      })
      .pathResolution(1)
      .pathTransitionDuration(0);
  }

  private applyBloomForFocus(): void {
    if (!this.globeBloomPass) return;
    this.globeBloomPass.enabled = !this.focusMode;
  }

  private onGlobeAltitudeChanged(globe: GlobeInstance, altitude: number): void {
    const prevAlt = this.currentAltitude;
    this.currentAltitude = altitude;
    if (Math.abs(altitude - prevAlt) > 1e-5) {
      this.refreshMapMarkersOnGlobe();
    }
    this.applyOrbitPolicies();
  }

  private dayNightTick = (): void => {
    if (!this.alive) return;
    this.dayNightRaf = requestAnimationFrame(this.dayNightTick);

    this.stepGlobeIntroAnimation();

    if (this.dayNightMaterial) {
      const [sx, sy] = sunSubSolarPoint(Date.now());
      this.dayNightMaterial.uniforms['sunPosition'].value.set(sx, sy);
    }
  };

  private stepGlobeIntroAnimation(): void {
    if (!this.introAnimationActive || !this.introScene) return;
    const elapsed = performance.now() - this.introAnimationStartTime;
    const ps = Math.min(1, elapsed / this.introScaleDurationMs);
    const pr = Math.min(1, elapsed / this.introRotationDurationMs);
    const k = THREE.MathUtils.lerp(1e-6, 1, easeOutQuad(ps));
    this.introScene.scale.setScalar(k);
    const angle = THREE.MathUtils.lerp(Math.PI * 2, 0, easeOutQuint(pr));
    this.introScene.setRotationFromAxisAngle(this.introRotAxis, angle);
    if (elapsed >= this.introRotationDurationMs) {
      this.introScene.scale.setScalar(1);
      this.introScene.rotation.set(0, 0, 0);
      this.introAnimationActive = false;
      this.introScene = null;
    }
  }

  private configureBloom(globe: GlobeInstance): void {
    if (this.bloomConfigured) return;
    const composer = globe.postProcessingComposer?.();
    if (!composer) return;

    const size = new THREE.Vector2();
    globe.renderer().getSize(size);
    size.multiplyScalar(0.36);

    const bloomPass = new UnrealBloomPass(
      size,
      this.globeBloomStrength,
      this.globeBloomRadius,
      this.globeBloomThreshold,
    );
    this.globeBloomPass = bloomPass;
    composer.addPass(bloomPass);
    this.bloomConfigured = true;
  }

  private getStreamCylinderGeometry(): THREE.BufferGeometry {
    if (!this.streamCylinderSharedGeometry) {
      const g = new THREE.CylinderGeometry(1, 1, 1, 12);
      g.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
      g.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.5));
      this.streamCylinderSharedGeometry = g;
    }
    return this.streamCylinderSharedGeometry;
  }

  private streamPolarToPosition(
    lat: number,
    lng: number,
    relAltitude: number,
    globeRadius: number,
    target: THREE.Vector3,
  ): void {
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(90 - lng);
    const r = globeRadius * (1 + relAltitude);
    const sinPhi = Math.sin(phi);
    target.set(
      r * sinPhi * Math.cos(theta),
      r * Math.cos(phi),
      r * sinPhi * Math.sin(theta),
    );
  }

  private getStreamMarkerHitMaterial(): THREE.MeshBasicMaterial {
    if (!this.streamMarkerHitMaterial) {
      this.streamMarkerHitMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
    }
    return this.streamMarkerHitMaterial;
  }

  private configureMarkerHitTargets(): void {
    this.markerHitTargetRadiusFactor = this.markerHitTargetRadiusFactorFinePointer;
    this.markerHitTargetHeightFactor = this.markerHitTargetHeightFactorFinePointer;
    if (typeof matchMedia === 'undefined') return;
    if (matchMedia('(any-pointer: coarse)').matches) {
      this.markerHitTargetRadiusFactor = this.markerHitTargetRadiusFactorCoarsePointer;
      this.markerHitTargetHeightFactor = this.markerHitTargetHeightFactorCoarsePointer;
    }
  }

  private createMapMarkerGroup(d: GlobeMapPoint): THREE.Group {
    const group = new THREE.Group();
    const geom = this.getStreamCylinderGeometry();
    const hit = new THREE.Mesh(geom, this.getStreamMarkerHitMaterial());
    hit.name = this.streamMarkerHitName;
    const visMat = new THREE.MeshLambertMaterial({ transparent: false });
    this.applyOutageMarkerAppearance(visMat, d);
    const vis = new THREE.Mesh(geom, visMat);
    vis.name = this.streamMarkerVisibleName;
    group.add(hit);
    group.add(vis);
    return group;
  }

  private outageMarkerHighlighted(d: GlobeOutagePoint): boolean {
    return (
      d.markerId === this.hoveredMarkerId ||
      (this.selectedOutage !== null &&
        d.markerId === this.selectedOutage.markerId)
    );
  }

  private applyOutageMarkerAppearance(
    mat: THREE.MeshLambertMaterial,
    d: GlobeOutagePoint,
  ): void {
    const highlighted = this.outageMarkerHighlighted(d);
    
    // Status colors
    const colorDown = 'rgba(239, 68, 68, 1)';      // Vibrant red
    const colorDegraded = 'rgba(245, 158, 11, 1)';  // Vibrant orange
    const colorUp = 'rgba(16, 185, 129, 1)';        // Clean green
    
    const hoverDown = 'rgba(255, 100, 100, 0.99)';
    const hoverDegraded = 'rgba(255, 200, 80, 0.99)';
    const hoverUp = 'rgba(120, 255, 180, 0.99)';

    let base = colorUp;
    let hi = hoverUp;
    
    if (d.status === 'down') {
      base = colorDown;
      hi = hoverDown;
    } else if (d.status === 'degraded') {
      base = colorDegraded;
      hi = hoverDegraded;
    }

    mat.color.set(highlighted ? hi : base);
    mat.emissive.copy(mat.color);
    mat.emissiveIntensity = highlighted
      ? this.streamMarkerHoverEmissiveIntensity
      : (d.status === 'down' ? 1.5 : this.streamMarkerEmissiveIntensity);
  }

  private updateMapMarkerGroup(
    group: THREE.Group,
    d: GlobeMapPoint,
    globeRadius: number,
  ): void {
    const vis = group.getObjectByName(
      this.streamMarkerVisibleName,
    ) as THREE.Mesh | undefined;
    const hit = group.getObjectByName(
      this.streamMarkerHitName,
    ) as THREE.Mesh | undefined;
    if (!vis || !hit) return;

    const mat = vis.material as THREE.MeshLambertMaterial;
    this.applyOutageMarkerAppearance(mat, d);

    const baseR = this.currentMarkerBaseRadius();
    const hoverR = Math.min(
      this.markerRadiusMax * 1.1,
      baseR * this.markerHoverScale,
    );
    const pxPerDeg = (2 * Math.PI * globeRadius) / 360;

    this.streamPolarToPosition(d.latitude, d.longitude, 0, globeRadius, group.position);

    this.tmpGlobeCenter.set(0, 0, 0);
    if (group.parent) {
      group.parent.localToWorld(this.tmpGlobeCenter);
    }
    group.lookAt(this.tmpGlobeCenter);

    const alt = this.latencyToPointAltitude(d.latencyMs);
    const rDeg = this.outageMarkerHighlighted(d) ? hoverR : baseR;
    const rs = Math.min(30, rDeg) * pxPerDeg;
    const h = Math.max(alt * globeRadius, 0.1);
    
    vis.scale.set(rs, rs, h);
    hit.scale.set(
      rs * this.markerHitTargetRadiusFactor,
      rs * this.markerHitTargetRadiusFactor,
      h * this.markerHitTargetHeightFactor,
    );
  }

  private refreshMapMarkersOnGlobe(): void {
    if (!this.alive || !this.globe) return;
    this.globe.customLayerData(this.outagePoints);
  }

  private applyOrbitPolicies(): void {
    const c = this.globe?.controls?.() as
      | {
          enableZoom?: boolean;
          enableRotate?: boolean;
          enablePan?: boolean;
          autoRotate?: boolean;
          autoRotateSpeed?: number;
        }
      | undefined;
    if (!c) return;
    if (this.focusMode) {
      c.enableZoom = false;
      c.enableRotate = true;
      c.enablePan = false;
      c.autoRotate = true;
      c.autoRotateSpeed = this.orbitAutoRotateSpeedFocus;
      return;
    }
    c.autoRotateSpeed = this.orbitAutoRotateSpeedDefault;
    c.enableZoom = true;
    c.enableRotate = true;
    c.enablePan = true;
    if (this.autoRotateEnabled) {
      c.autoRotate = !this.sidebarOpen;
    }
  }

  private tryEmitInitialOutageQuery(): void {
    if (this.initialOutageHandled || !this.initialOutageQuery?.trim()) return;
    const q = this.initialOutageQuery.trim().toLowerCase();
    const match = this.outagePoints.find(
      (o) => o.markerId.toLowerCase() === q,
    );
    if (match) {
      this.initialOutageHandled = true;
      this.ngZone.run(() => this.outageSelected.emit(match));
      return;
    }
    if (!this.outagesInitialFetchCompleted) return;
    this.initialOutageHandled = true;
  }

  private onMapMarkerClicked(p: GlobeMapPoint): void {
    this.ngZone.run(() => this.outageSelected.emit(p));
  }

  private syncGlobeLayout(): void {
    if (!this.alive || !this.globe) return;
    const box = this.globeHost.nativeElement;
    const w = Math.max(1, Math.floor(box.clientWidth));
    const h = Math.max(1, Math.floor(box.clientHeight));
    this.globe.width(w).height(h);
  }

  private syncSelectedMapFocus(): void {
    if (this.focusMode) {
      return;
    }

    const outageId = this.selectedOutage?.markerId ?? null;
    const idx =
      outageId === null || !this.outagePoints.length
        ? -1
        : this.outagePoints.findIndex((p) => p.markerId === outageId);

    if (outageId && idx >= 0) {
      if (!this.globe) return;
      if (this.lastFocusedMarkerId === outageId) return;
      const target = this.outagePoints[idx]!;
      this.globe.pointOfView(
        {
          lat: target.latitude,
          lng: target.longitude,
          altitude: this.focusStreamCameraAltitude(),
        },
        this.selectedFocusTransitionMs,
      );
      this.lastFocusedMarkerId = outageId;
      return;
    }

    this.lastFocusedMarkerId = null;
  }

  private currentMarkerBaseRadius(): number {
    const altMin = this.minCameraAltitude;
    const altMax = this.initialGlobeAltitude;
    const t = THREE.MathUtils.clamp(
      (this.currentAltitude - altMin) / Math.max(altMax - altMin, 1e-6),
      0,
      1,
    );
    return this.markerRadiusMin + (this.markerRadiusMax - this.markerRadiusMin) * t;
  }

  private focusStreamCameraAltitude(): number {
    return Math.max(this.minCameraAltitude + 0.06, this.selectedFocusAltitude);
  }

  private maxPointAltitudeForFocusZoom(): number {
    const focusAlt = this.focusStreamCameraAltitude();
    return Math.max(
      this.markerAltitudeMin + 1e-4,
      focusAlt - this.markerAltitudeFocusClearance,
    );
  }

  private latencyToPointAltitude(latencyMs: number): number {
    const l0 = Number.isFinite(latencyMs) ? Math.max(0, latencyMs) : 0;
    const minLatency = 30;
    const maxLatency = 5000;
    
    const l = Math.min(Math.max(l0, minLatency), maxLatency);
    
    const h0 = this.markerAltitudeMin;
    const h1 = Math.min(this.markerAltitudeMax, this.maxPointAltitudeForFocusZoom());
    
    const lThreshold = 300;
    const span = h1 - h0;
    const hLinearTop = h0 + 0.35 * span; // 35% height for latency up to 300ms
    
    if (l <= lThreshold) {
      const t = (l - minLatency) / (lThreshold - minLatency);
      return h0 + Math.max(0, t) * (hLinearTop - h0);
    }
    
    const logLo = Math.log10(lThreshold);
    const logHi = Math.log10(maxLatency);
    const denom = logHi - logLo;
    const tLog = denom > 0 ? (Math.log10(l) - logLo) / denom : 1;
    
    return hLinearTop + THREE.MathUtils.clamp(tLog, 0, 1) * (h1 - hLinearTop);
  }
}

function geojsonToBorderPaths(features: GeoFeature[]): BorderPath[] {
  const paths: BorderPath[] = [];

  function addRing(coords: [number, number][]): void {
    if (!coords || coords.length < 2) return;
    const pnts = coords.map(([lng, lat]) => [lat, lng] as [number, number]);
    paths.push({ pnts, style: 'base' });
    paths.push({ pnts, style: 'glow1' });
    paths.push({ pnts, style: 'glow2' });
  }

  for (const f of features) {
    const g = f.geometry;
    if (!g) continue;
    if (g.type === 'Polygon') {
      const rings = g.coordinates as [number, number][][];
      rings.forEach(addRing);
    } else if (g.type === 'MultiPolygon') {
      const polys = g.coordinates as [number, number][][][];
      polys.forEach((poly) => poly.forEach(addRing));
    }
  }
  return paths;
}
