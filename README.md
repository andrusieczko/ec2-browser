# ec2-browser

## Status: unfinished!

This is an app I was trying to play with React.js, Electron and gulp.

If you want to make it working, you should add the `aws-config.json` in the main folder:

```
{
  "accessKeyId": "<your_access_key_id>",
  "secretAccessKey": "<your_secret_access_key>"
}
```

Starting the app:

```
$ gulp
```

and in the other terminal:

```
$ electron .
```

When you save the changes, `electron-reload` will take care about reloading the app.

Uses Electron, React, AWS SDK, Photon
Tools: gulp, babelify, watchify and reactify

#### License [MIT](LICENSE.md)
