import gulp from 'gulp';
import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback/lib';
import {CLIOptions} from 'aurelia-cli';
import project from '../aurelia.json';
import build from './build';
import watch from './watch';

import packageJson from '../../package.json';
let packageVersion = packageJson.version;

// const VERSION = `v-${packageVersion.substr(0, 1)}`; //We're only concerned about breaking changes right now
const VERSION = packageVersion.replace(/\./g, '-');
let routes = {};
routes[`/cdn/initializer/${VERSION}`] = "../component-initializer/widget";
routes[`/cdn/etrieve-widgets/${VERSION}`] = "../etrieve-widgets";
routes[`/cdn/api/v-1`] = "../../Etrieve-Api"; //When api gets updated use the below route
//routes[`/cdn/api/${VERSION}`] = "../../Etrieve-Api";


let serve = gulp.series(
  build,
  done => {
    browserSync({
      online: false,
      open: CLIOptions.hasFlag('open'),
      port: project.platform.port,
      https: true,
      logLevel: 'silent',
      server: {
        baseDir: [project.platform.baseDir],
        middleware: [historyApiFallback(), function(req, res, next) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          next();
        }],
        routes: routes
      }
    }, function (err, bs) {
      if (err) return done(err);
      let urls = bs.options.get('urls').toJS();
      log(`Application Available At: ${urls.local}`);
      log(`BrowserSync Available At: ${urls.ui}`);
      done();
    });
  }
);

function log(message) {
  console.log(message); //eslint-disable-line no-console
}

function reload() {
  log('Refreshing the browser');
  browserSync.reload();
}

let run = gulp.series(
  serve,
  done => { watch(reload); done(); }
);

export default run;
