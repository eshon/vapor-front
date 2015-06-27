var pushserve = require('pushserve')

var server = pushserve({
  port: 9000,
  indexPath: './index.html',
  noCors: true,
})