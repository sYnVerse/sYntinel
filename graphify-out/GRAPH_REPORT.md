# Graph Report - lucent  (2026-06-26)

## Corpus Check
- 25 files · ~98,430 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 283 nodes · 385 edges · 26 communities (15 shown, 11 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c66c0f42`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Globe Rendering & Visualization|Globe Rendering & Visualization]]
- [[_COMMUNITY_Main Application Shell & State|Main Application Shell & State]]
- [[_COMMUNITY_Outage Sidebar & Data Models|Outage Sidebar & Data Models]]
- [[_COMMUNITY_Angular Build & Configurations|Angular Build & Configurations]]
- [[_COMMUNITY_Geolocation & Workers|Geolocation & Workers]]
- [[_COMMUNITY_Map Environments & Settings|Map Environments & Settings]]
- [[_COMMUNITY_Package Scripts|Package Scripts]]
- [[_COMMUNITY_External Library Dependencies|External Library Dependencies]]
- [[_COMMUNITY_Tooling & Dev Dependencies|Tooling & Dev Dependencies]]
- [[_COMMUNITY_Angular Workspace Configurations|Angular Workspace Configurations]]
- [[_COMMUNITY_Angular Build Options|Angular Build Options]]
- [[_COMMUNITY_Focus Mode Design & Assets|Focus Mode Design & Assets]]
- [[_COMMUNITY_Globe Surface Texture Assets|Globe Surface Texture Assets]]
- [[_COMMUNITY_Earth Night Light Assets|Earth Night Light Assets]]
- [[_COMMUNITY_Disaster Simulation Engine|Disaster Simulation Engine]]
- [[_COMMUNITY_Production Environment Configs|Production Environment Configs]]
- [[_COMMUNITY_Application Favicons & Logos|Application Favicons & Logos]]
- [[_COMMUNITY_Application Favicons & Logos|Application Favicons & Logos]]
- [[_COMMUNITY_Application Favicons & Logos|Application Favicons & Logos]]
- [[_COMMUNITY_Application Favicons & Logos|Application Favicons & Logos]]
- [[_COMMUNITY_Application Favicons & Logos|Application Favicons & Logos]]
- [[_COMMUNITY_Dependabot Configuration|Dependabot Configuration]]
- [[_COMMUNITY_Cloudflare Workers Concept|Cloudflare Workers Concept]]
- [[_COMMUNITY_Globe.gl Integration|Globe.gl Integration]]
- [[_COMMUNITY_Three.js 3D Library|Three.js 3D Library]]

## God Nodes (most connected - your core abstractions)
1. `GlobeViewComponent` - 49 edges
2. `AppComponent` - 30 edges
3. `OutageSidebarComponent` - 30 edges
4. `GlobeOutagePoint` - 17 edges
5. `options` - 10 edges
6. `scripts` - 10 edges
7. `production` - 9 edges
8. `sYntinel` - 9 edges
9. `applyJitter()` - 8 edges
10. `syntinel-angular` - 7 edges

## Surprising Connections (you probably didn't know these)
- `AppComponent` --references--> `AppComponent HTML Template`  [INFERRED]
  src/app/app.component.ts → src/app/app.component.html
- `index.html entry point` --references--> `AppComponent`  [EXTRACTED]
  src/index.html → src/app/app.component.ts
- `OutageSidebarComponent` --references--> `OutageSidebarComponent HTML Template`  [INFERRED]
  src/app/outage-sidebar/outage-sidebar.component.ts → src/app/outage-sidebar/outage-sidebar.component.html
- `sYntinel` --conceptually_related_to--> `index.html entry point`  [INFERRED]
  README.md → src/index.html
- `AppComponent HTML Template` --references--> `GlobeViewComponent`  [EXTRACTED]
  src/app/app.component.html → src/app/globe-view/globe-view.component.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Disaster Simulation Flow** — readme_disaster_simulator, outage_sidebar_outage_sidebar_component_disaster_simulator_panel, app_app_component_appcomponent, outage_sidebar_outage_sidebar_component_outagesidebarcomponent [INFERRED 0.85]
- **Focus Mode Presentation** — readme_focus_mode, app_app_component_focus_dashboard, app_app_component_appcomponent [INFERRED 0.85]

## Communities (26 total, 11 thin omitted)

### Community 0 - "Globe Rendering & Visualization"
Cohesion: 0.08
Nodes (3): GlobeMapPoint, geojsonToBorderPaths(), GlobeViewComponent

### Community 2 - "Outage Sidebar & Data Models"
Cohesion: 0.11
Nodes (3): AppComponent HTML Template, OutageSidebarComponent, OutageSidebarComponent HTML Template

### Community 3 - "Angular Build & Configurations"
Cohesion: 0.09
Nodes (23): build, serve, builder, configurations, defaultConfiguration, development, production, buildTarget (+15 more)

### Community 4 - "Geolocation & Workers"
Cohesion: 0.19
Nodes (21): applyJitter(), CityCoordinates, CountryCoordinates, EmojiFlagToCountry, escapeRe(), extractLocationHint(), geolocateFromText(), GeoLocation (+13 more)

### Community 5 - "Map Environments & Settings"
Cohesion: 0.10
Nodes (15): FOCUS_FALLBACK_OUTAGE_KEYS, parseFocusQueryParam(), appConfig, mapPointMarkerId(), GlobeOutagePoint, OutageDto, toGlobeOutagePoint(), environment (+7 more)

### Community 6 - "Package Scripts"
Cohesion: 0.07
Nodes (27): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/platform-browser-dynamic, @angular/router (+19 more)

### Community 7 - "External Library Dependencies"
Cohesion: 0.14
Nodes (13): API Configuration, Credits, Development, Features, Getting Started, Install, License, Prerequisites (+5 more)

### Community 8 - "Tooling & Dev Dependencies"
Cohesion: 0.14
Nodes (14): devDependencies, @angular/cli, @angular/compiler-cli, @angular-devkit/build-angular, jasmine-core, karma, karma-chrome-launcher, karma-coverage (+6 more)

### Community 9 - "Angular Workspace Configurations"
Cohesion: 0.12
Nodes (15): extract-i18n, test, builder, newProjectRoot, projects, syntinel-angular, $schema, architect (+7 more)

### Community 10 - "Angular Build Options"
Cohesion: 0.25
Nodes (11): options, allowedCommonJsDependencies, assets, browser, index, outputPath, polyfills, scripts (+3 more)

### Community 11 - "Focus Mode Design & Assets"
Cohesion: 0.67
Nodes (3): Focus Mode Dashboard Layout, System Monitor Widget Layout, Focus Mode Concept

### Community 12 - "Globe Surface Texture Assets"
Cohesion: 0.67
Nodes (3): NASA Blue Marble Texture Map, Earth Surface Texture Asset, Equirectangular Projection Map

### Community 13 - "Earth Night Light Assets"
Cohesion: 0.67
Nodes (3): Global City Lights, Globe Visualization Asset, NASA Earth at Night Map

### Community 14 - "Disaster Simulation Engine"
Cohesion: 0.67
Nodes (3): Disaster Simulator Panel Layout, Outage Disaster Simulator Concept, Simulation Engine Concept

## Knowledge Gaps
- **109 isolated node(s):** `$schema`, `version`, `newProjectRoot`, `projectType`, `schematics` (+104 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `GlobeViewComponent` connect `Globe Rendering & Visualization` to `Outage Sidebar & Data Models`, `Map Environments & Settings`?**
  _High betweenness centrality (0.194) - this node is a cross-community bridge._
- **Why does `AppComponent` connect `Main Application Shell & State` to `Outage Sidebar & Data Models`, `Map Environments & Settings`, `External Library Dependencies`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **Why does `OutageSidebarComponent` connect `Outage Sidebar & Data Models` to `Main Application Shell & State`, `Map Environments & Settings`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **What connects `$schema`, `version`, `newProjectRoot` to the rest of the system?**
  _112 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Globe Rendering & Visualization` be split into smaller, more focused modules?**
  _Cohesion score 0.07632850241545894 - nodes in this community are weakly interconnected._
- **Should `Main Application Shell & State` be split into smaller, more focused modules?**
  _Cohesion score 0.1067193675889328 - nodes in this community are weakly interconnected._
- **Should `Outage Sidebar & Data Models` be split into smaller, more focused modules?**
  _Cohesion score 0.10869565217391304 - nodes in this community are weakly interconnected._