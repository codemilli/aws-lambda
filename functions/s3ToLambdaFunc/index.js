const async = require('async')
const AWS = require('aws-sdk')
const gm = require('gm').subClass({imageMagick: true})
const transformFunc = process.env.TRANSFORM_FUNC

exports.handler = function(event, context, callback) {
  console.log('event options : ', util.inspect(event, {
    depth: 5
  })

  const srcBucket = event.Records[0].s3.bucket.name
  const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "))
  const dstBucket = srcBucket + '-output'
  const dstKey = 'output-' + srcKey

  async.waterfall([
    function download(next) {
      s3.getObject({
        Bucket: srcBucket,
        Key: srcKey
      }, next)
    },
    function transform(response, next) {
      switch(transformFunc) {
        case 'negative':
          gm(response.Body).negative()
            .toBuffer(imageType, function(err, buffer) {
              if (err) { next(err) }
              else {next(null, response.ContentType, buffer}
            })
        break;
      }
    }
  ])
}
