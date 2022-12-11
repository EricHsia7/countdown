function getFontsList() {
  var key = '{secret_key}'
  var api = 'https://www.googleapis.com/webfonts/v1/webfonts?key=' + key
  var request = UrlFetchApp.fetch(api)
  var response = request.getContentText()
  var json = JSON.parse(response)
  var p = json.items
  var p_len = p.length
  var fonts_list = []
  for (var t = 0; t < p_len; t++) {
    var ital = false
    var this_p = p[t]
    var f = this_p.family
    var v = this_p.variants
    var this_wght = []
    var this_k = ''
    if (v.indexOf('italic') > -1) {
      this_k = 'ital,wght@'
      ital = true
    }
    else {
      this_k = 'wght@'
    }
    for (var d = 0; d < v.length; d++) {
      var u = 0
      var uv = String(v[d])
      if (uv === 'regular') {
        uv = '400'
      }
      if (uv === 'italic') {
        uv = 'italic400'
      }
      if (uv.indexOf('italic') > -1) {
        u = 1
      }
      var w = parseInt(String(uv).replace('italic', ''))
      if (ital) {
        if (u === 1) {
          this_wght.push('1,' + w)
        }
        else {
          this_wght.push('0,' + w)
        }
      }
      else {
        this_wght.push(w)
      }
    }
    if (ital) {
      this_wght = this_wght.sort(function (a, b) {
        var c = a.split(',')
        var d = b.split(',')
        var e = parseInt(c[0]) * parseInt(c[1])
        var f = parseInt(d[0]) * parseInt(d[1])
        return e - f
      })
    }
    else {
      this_wght = this_wght.sort(function (a, b) {
        var c = parseInt(a)
        var d = parseInt(b)
        return c - d
      })
    }
    var url_query = this_k + '' + this_wght.join(';')
    fonts_list.push([f, url_query])
  }
  return fonts_list
}

function updateFonts() {
  var spreadsheet = SpreadsheetApp.getActive();
  var arr = getFontsList()
  var arr_len = arr.length
  spreadsheet.getRange('A1:' + 'B' + arr_len).setValues(arr)
};
