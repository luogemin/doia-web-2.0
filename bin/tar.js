#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var shell = require('shelljs')
var moment = require('moment');
var fse = require('fs-extra')

var targz = require('targz');

var root = process.cwd();

const [, , fileTitle = 'build', jekensNumber = '0'] = process.argv;

function getLog () {
  let _cmd = `git log -1 \
  --date=iso --pretty=format:'{"commit": "%h","author": "%aN <%aE>","date": "%ad","message": "%s"},' \
  $@ | \
  perl -pe 'BEGIN{print "["}; END{print "]\n"}' | \
  perl -pe 's/},]/}]/'`
  return new Promise((resolve, reject) => {
    shell.exec(_cmd, (code, stdout, stderr) => {
      if (code) {
        reject(stderr)
      } else {
        resolve(JSON.parse(stdout)[0])
      }
    })
  })
}
async function commit () {
  let _gitLog = await getLog()
  const fileName = fileTitle + '.' + jekensNumber + '-' + moment(new Date(_gitLog.date)).format('YYYYMMDDHHmmss') + '-' + _gitLog.commit

  fse.pathExists(path.join(root, `publish/${fileName}`), (err, exists) => {
    console.log(err) // => null
    if(exists) {
      fse.remove('/tmp/myfile', err => {
        if (err) return console.error(err)
        copyAndZip(fileName)
      })
    } else {
      copyAndZip(fileName)
    }
  })
}

function copyAndZip(fileName) {
  fse.copy(path.join(root, 'dist'), path.join(root, `publish/${fileName}/${fileName}`), err => {
    if (err) return console.error(err)
    console.log('success!')
    targz.compress({
      src: path.join(root, `publish/${fileName}`),
      dest: path.join(root, `publish/${fileName}.tar.gz`),
    }, function(err){
      if(err) {
          console.log(err);
      } else {
          console.log("Done!");
          // 清除生成的临时文件夹
          fse.remove(path.join(root, `publish/${fileName}`))
      }
    });
  })
}

commit()


