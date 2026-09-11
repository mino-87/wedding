window.WEDDING_CONFIG = Object.freeze({
  eventIso: "2026-09-24T17:00:00+03:00",
  rsvpDeadlineIso: "2026-09-17T23:59:59+03:00",
  maxUploadBytes: 40 * 1024 * 1024,
  maxFilesPerBatch: 10,
  maxCentralUploadBytes: 12 * 1024 * 1024,
  backendEndpoint: "https://script.google.com/macros/s/AKfycbwh-seQeKQoO96gIlnDrjogFjR3mdTB4XyXH3NK96CvyBnnnnSXJbBAHaHQzCdhNDkI8A/exec",
  rsvpEndpoint: "https://script.google.com/macros/s/AKfycbwh-seQeKQoO96gIlnDrjogFjR3mdTB4XyXH3NK96CvyBnnnnSXJbBAHaHQzCdhNDkI8A/exec",
  uploadEndpoint: "https://script.google.com/macros/s/AKfycbwh-seQeKQoO96gIlnDrjogFjR3mdTB4XyXH3NK96CvyBnnnnSXJbBAHaHQzCdhNDkI8A/exec",
  google: Object.freeze({
    rsvpSpreadsheetId: "1TKl5kShW27Zuo2ypXuK7UJ5rbV4xJRRfE11HVYB701o",
    rootFolderId: "1OSBFtah86wqU4uIC8LHg47Lh133U5ZR3",
    guestPhotosFolderId: "1Fq7b1hES7uqhq3I3BAlHiBM8NWHpRkMe",
    guestVideosFolderId: "1Xv-izxg29hxG3dIGIottNfYFLSq4aQJo",
    voiceMessagesFolderId: "1ubuxLa1psH6jSTN8YL6MdnVsUTg3xPGY",
    weddingCameraFolderId: "1R-8Repqu7_s7C_mF9RpdPRzpwuOuIcDn",
    missionUploadsFolderId: "1AOVMxm5WQOQHtDQj4GwwiGzMUOOhhIiP"
  }),
  musicUrl: "",
  smileThreshold: 0.46,
  smileHoldMs: 2000,
  faceLandmarkerModelUrl: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
  faceTasksVisionBaseUrl: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm",
  faceTasksVisionModuleUrl: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/+esm"
});
