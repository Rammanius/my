var SPREADSHEET_ID = 'ВСТАВЬТЕ_ID_ТАБЛИЦЫ_СЮДА';
var SHEET_NAME = 'Заявки';

function doGet() {
  var sheet = getSheet();

  return jsonResponse({
    ok: true,
    message: 'Скрипт работает',
    spreadsheetId: sheet.getParent().getId(),
    sheetName: sheet.getName(),
    lastRow: sheet.getLastRow()
  });
}

function doPost(e) {
  var sheet = getSheet();
  var data = e.parameter;

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.email || '',
    data.phone || '',
    data.request_type || '',
    data.message || '',
    data.source || '',
    data.page_url || '',
    data.user_agent || ''
  ]);

  return jsonResponse({
    ok: true,
    spreadsheetId: sheet.getParent().getId(),
    sheetName: sheet.getName(),
    row: sheet.getLastRow()
  });
}

function getSheet() {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Дата',
      'Имя',
      'Email',
      'Телефон',
      'Тема заявки',
      'Сообщение',
      'Источник',
      'Страница',
      'User Agent'
    ]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
