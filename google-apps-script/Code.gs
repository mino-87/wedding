const IDS = {
  spreadsheet: '1TKl5kShW27Zuo2ypXuK7UJ5rbV4xJRRfE11HVYB701o',
  photos: '1Fq7b1hES7uqhq3I3BAlHiBM8NWHpRkMe',
  videos: '1Xv-izxg29hxG3dIGIottNfYFLSq4aQJo',
  voices: '1ubuxLa1psH6jSTN8YL6MdnVsUTg3xPGY',
  missions: '1AOVMxm5WQOQHtDQj4GwwiGzMUOOhhIiP',
  camera: '1R-8Repqu7_s7C_mF9RpdPRzpwuOuIcDn'
};

const UPLOAD_LIMITS = {
  image: 25 * 1024 * 1024,
  voice: 25 * 1024 * 1024,
  video: 500 * 1024 * 1024,
  camera: 25 * 1024 * 1024,
  mission: 500 * 1024 * 1024
};

function doGet() {
  return output_({ok:true, service:'David & Diana Wedding backend', version:'1.4'});
}

function authorizeWeddingBackend() {
  SpreadsheetApp.openById(IDS.spreadsheet).getName();
  DriveApp.getFolderById(IDS.videos).getName();
  var token = ScriptApp.getOAuthToken();
  var response = UrlFetchApp.fetch('https://www.googleapis.com/drive/v3/about?fields=user', {
    method: 'get',
    headers: { Authorization: 'Bearer ' + token },
    muteHttpExceptions: true
  });
  if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) {
    throw new Error('AUTH_CHECK_FAILED_' + response.getResponseCode() + ': ' + response.getContentText().slice(0, 300));
  }
  Logger.log('Wedding backend authorized successfully.');
  return 'OK';
}

function doPost(e) {
  try {
    var payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (payload.action === 'rsvp') return saveRsvp_(payload);
    if (payload.action === 'upload') return saveUpload_(payload);
    if (payload.action === 'startResumableUpload') return startResumableUpload_(payload);
    if (payload.action === 'uploadResumableChunk') return uploadResumableChunk_(payload);
    return output_({ok:false, error:'UNKNOWN_ACTION'});
  } catch (err) {
    return output_({ok:false, error:String(err && err.message || err)});
  }
}

function saveRsvp_(p) {
  var ss = SpreadsheetApp.openById(IDS.spreadsheet);
  var sheet = ss.getSheetByName('RSVP');
  if (!sheet) throw new Error('RSVP_SHEET_NOT_FOUND');
  var name = clean_(p.name, 100);
  var attending = p.attending === 'yes' ? 'yes' : p.attending === 'no' ? 'no' : '';
  if (!name || !attending) throw new Error('INVALID_RSVP');
  var companions = attending === 'yes' ? Math.max(0, Math.min(10, Number(p.companions) || 0)) : 0;
  var totalGuests = attending === 'yes' ? 1 + companions : 0;
  var now = new Date();
  var responseId = Utilities.getUuid();
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var lastRow = sheet.getLastRow();
    var targetRow = 0;
    var key = normalize_(name);
    if (lastRow >= 2) {
      var names = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues();
      for (var i = 0; i < names.length; i++) {
        if (normalize_(names[i][0]) === key) { targetRow = i + 2; break; }
      }
    }
    if (targetRow) {
      var old = sheet.getRange(targetRow, 1, 1, 8).getValues()[0];
      responseId = old[6] || responseId;
      sheet.getRange(targetRow, 1, 1, 8).setValues([[name, attending, companions, totalGuests, old[4] || now, now, responseId, 'website']]);
      return output_({ok:true, action:'rsvp', updated:true, responseId:responseId});
    }
    sheet.appendRow([name, attending, companions, totalGuests, now, now, responseId, 'website']);
    return output_({ok:true, action:'rsvp', updated:false, responseId:responseId});
  } finally {
    lock.releaseLock();
  }
}

function folderForKind_(kind) {
  if (kind === 'video') return IDS.videos;
  if (kind === 'voice') return IDS.voices;
  if (kind === 'weddingCamera' || kind === 'camera') return IDS.camera;
  if (kind === 'mission') return IDS.missions;
  return IDS.photos;
}

function uploadLimitFor_(kind, mime) {
  if (kind === 'video' || /^video\//i.test(mime)) return UPLOAD_LIMITS.video;
  if (kind === 'voice' || /^audio\//i.test(mime)) return UPLOAD_LIMITS.voice;
  if (kind === 'weddingCamera' || kind === 'camera') return UPLOAD_LIMITS.camera;
  if (kind === 'mission') return UPLOAD_LIMITS.mission;
  return UPLOAD_LIMITS.image;
}

function saveUpload_(p) {
  var data = String(p.data || '');
  if (!data || data.length > 34000000) throw new Error('FILE_TOO_LARGE');
  var kind = String(p.kind || 'media');
  var filename = clean_(p.name, 120) || ('wedding-' + Date.now());
  var mime = clean_(p.mimeType, 100) || 'application/octet-stream';
  var bytes = Utilities.base64Decode(data);
  var limit = uploadLimitFor_(kind, mime);
  if (bytes.length > limit) throw new Error('FILE_TOO_LARGE');
  var stamp = Utilities.formatDate(new Date(), 'Africa/Cairo', 'yyyyMMdd-HHmmss');
  var file = DriveApp.getFolderById(folderForKind_(kind)).createFile(Utilities.newBlob(bytes, mime, stamp + '-' + filename));
  file.setDescription('David & Diana Wedding upload | ' + kind);
  return output_({ok:true, action:'upload', kind:kind, fileId:file.getId(), name:file.getName(), size:bytes.length});
}

function startResumableUpload_(p) {
  var kind = String(p.kind || 'media');
  var filename = clean_(p.name, 120) || ('wedding-' + Date.now());
  var mime = clean_(p.mimeType, 100) || 'application/octet-stream';
  var size = Math.max(0, Number(p.size) || 0);
  var limit = uploadLimitFor_(kind, mime);
  if (!size) throw new Error('INVALID_FILE_SIZE');
  if (size > limit) throw new Error('FILE_TOO_LARGE');
  var stamp = Utilities.formatDate(new Date(), 'Africa/Cairo', 'yyyyMMdd-HHmmss');
  var metadata = { name: stamp + '-' + filename, mimeType: mime, parents: [folderForKind_(kind)], description: 'David & Diana Wedding upload | ' + kind };
  var response = UrlFetchApp.fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,name,size,mimeType', {
    method: 'post',
    contentType: 'application/json; charset=UTF-8',
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken(),
      'X-Upload-Content-Type': mime,
      'X-Upload-Content-Length': String(size)
    },
    payload: JSON.stringify(metadata),
    muteHttpExceptions: true,
    followRedirects: false
  });
  var code = response.getResponseCode();
  if (code < 200 || code >= 300) throw new Error('RESUMABLE_INIT_FAILED_' + code + ': ' + response.getContentText().slice(0, 400));
  var headers = response.getAllHeaders();
  var sessionUrl = headers.Location || headers.location;
  if (!sessionUrl) throw new Error('RESUMABLE_SESSION_MISSING');
  return output_({ok:true, action:'startResumableUpload', kind:kind, sessionUrl:String(sessionUrl), maxBytes:limit});
}

function uploadResumableChunk_(p) {
  var sessionUrl = String(p.sessionUrl || '');
  var data = String(p.data || '');
  var mime = clean_(p.mimeType, 100) || 'application/octet-stream';
  var start = Math.max(0, Number(p.start) || 0);
  var endExclusive = Math.max(start, Number(p.endExclusive) || 0);
  var total = Math.max(endExclusive, Number(p.total) || 0);
  if (!/^https:\/\/www\.googleapis\.com\/upload\/drive\/v3\/files\?/i.test(sessionUrl)) throw new Error('INVALID_RESUMABLE_SESSION');
  if (!data) throw new Error('EMPTY_CHUNK');
  if (!total || endExclusive <= start || endExclusive > total) throw new Error('INVALID_CHUNK_RANGE');
  var bytes = Utilities.base64Decode(data);
  var expected = endExclusive - start;
  if (bytes.length !== expected) throw new Error('CHUNK_SIZE_MISMATCH');
  if (bytes.length > 10 * 1024 * 1024) throw new Error('CHUNK_TOO_LARGE');
  var response = UrlFetchApp.fetch(sessionUrl, {
    method: 'put',
    contentType: mime,
    headers: {
      'Content-Range': 'bytes ' + start + '-' + (endExclusive - 1) + '/' + total,
      'Content-Length': String(bytes.length)
    },
    payload: bytes,
    muteHttpExceptions: true,
    followRedirects: false
  });
  var code = response.getResponseCode();
  var headers = response.getAllHeaders();
  if (code === 308) return output_({ok:true, action:'uploadResumableChunk', complete:false, receivedRange:String(headers.Range || headers.range || '')});
  if (code >= 200 && code < 300) {
    var body = response.getContentText();
    var result = {};
    try { result = body ? JSON.parse(body) : {}; } catch (_) {}
    return output_({ok:true, action:'uploadResumableChunk', complete:true, result:result});
  }
  throw new Error('RESUMABLE_CHUNK_FAILED_' + code + ': ' + response.getContentText().slice(0, 400));
}

function clean_(value, max) {
  return String(value == null ? '' : value).replace(/[<>]/g, '').trim().slice(0, max);
}

function normalize_(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function output_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
