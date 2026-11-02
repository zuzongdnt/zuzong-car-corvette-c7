# Local integration

- Source: `@google/model-viewer-effects` 1.5.0, Apache 2.0.
- Three.js imports point to the single local Three.js 0.183.0 instance shared with `@google/model-viewer` 4.4.0 (module build).
- The legacy `LuminanceFormat` import is mapped to `RedFormat`, the supported single-channel texture format in this Three.js release. The enabled selective bloom path uses HDR render targets.
- Local vendor copies are served without a CDN or runtime network dependency.
