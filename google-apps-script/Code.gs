const IDS = {
  spreadsheet: '1TKl5kShW27Zuo2ypXuK7UJ5rbV4xJRRfE11HVYB701o',
  photos: '1Fq7b1hES7uqhq3I3BAlHiBM8NWHpRkMe',
  videos: '1Xv-izxg29hxG3dIGIottNfYFLSq4aQJo',
  voices: '1ubuxLa1psH6jSTN8YL6MdnVsUTg3xPGY',
  missions: '1AOVMxm5WQOQHtDQj4GwwiGzMUOOhhIiP',
  camera: '1R-8Repqu7_s7C_mF9RpdPRzpwuOuIcDn'
};

function doGet() {
  return output_({ok:true, service:'David & Diana Wedding backend'});
}

function doPost(e) {
  try {
    var payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (payload.action === 'rsvp') return saveRsvp_(payload);
    if (payload.action === 'upload') return saveUpload_(payload);
    return output_({ok:false, error:'UNKNOWN_ACTION'});
  } catch (err) {
    return output_({ok:false, error:String(err && err.message || err)});
  }
}

function saveRsvp_(p) {
  var sheet = SpreadsheetApp.openById(IDS.spreadsheet).getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp','Name','Attending','Companions','Event']);
  }
  var name = clean_(p.name, 100);
  var attending = p.attending === 'yes' ? 'yes' : p.attending === 'no' ? 'no' : '';
  if (!name || !attending) throw new Error('INVALID_RSVP');
  var companions = attending === 'yes' ? Math.max(0, Math.min(10, Number(p.companions) || 0)) : 0;
  sheet.appendRow([new Date(), name, attending, companions, clean_(p.event, 120) || 'David & Diana 24.09.2026']);
  return output_({ok:true, action:'rsvp'});
}

function saveUpload_(p) {
  var data = String(p.data || '');
  if (!data || data.length > 16000000) throw new Error('FILE_TOO_LARGE');
  var kind = String(p.kind || 'media');
  var folderId = kind === 'video' ? IDS.videos : kind === 'voice' ? IDS.voices : kind === 'camera' ? IDS.camera : kind === 'mission' ? IDS.missions : IDS.photos;
  var filename = clean_(p.name, 120) || ('wedding-' + Date.now());
  var mime = clean_(p.mimeType, 100) || 'application/octet-stream';
  var bytes = Utilities.base64Decode(data);
  if (bytes.length > 12000000) throw new Error('FILE_TOO_LARGE');
  var file = DriveApp.getFolderById(folderId).createFile(Utilities.newBlob(bytes, mime, filename));
  file.setDescription('David & Diana Wedding upload | ' + kind);
  return output_({ok:true, action:'upload', fileId:file.getId(), name:file.getName()});
}

function clean_(value, max) {
  return String(value == null ? '' : value).replace(/[<>]/g, '').trim().slice(0, max);
}

function output_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
