const async = require('async')

module.exports = fileSelect
module.exports.handler = fileSelectHandler


// hide a file input in the header
var input = document.createElement('input')
input.type = 'file'
document.head.appendChild(input)

// trigger file select dialog, return files on cb
function fileSelect(cb) {
  input.click()
  input.addEventListener('change', getFiles)
  
  function getFiles() {
    input.removeEventListener('change', getFiles)
    var files = [].slice.call(input.files)
    input.files = null
    async.map(files, convertFileToBuffer, function(err, result){
      cb(result)
    })
  }
}

// use this to set a cb w/o invoking immediately
function fileSelectHandler(cb) {
  return fileSelect.bind(null, cb)
}

// util

function convertFileToBuffer(file, cb) {
  // convert the file to a Buffer that we can use!
  var reader = new FileReader()
  reader.addEventListener('load', function (e) {
    // e.target.result is an ArrayBuffer
    var arr = new Uint8Array(e.target.result)
    var buffer = new Buffer(arr)
    cb(null, buffer)
  })
  reader.addEventListener('error', function (err) {
    console.error('FileReader error' + err)
  })
  reader.readAsArrayBuffer(file)
}