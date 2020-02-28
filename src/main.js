/*
This is boilerplate code for Aurelia. It's responsible for starting the Aurelia site and bootstrapping it onto the page.
Nothing in here is particular for the Etrieve Document Viewer except initializing the Api's.
While we do set up the Api's here, nothing demands it be done. We are simply initializing here so we can use them later easily.
*/

import environment from './environment';

export function configure(aurelia) {
    aurelia.use
        .feature('resources')
        .standardConfiguration();

    aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

    if (environment.testing) {
        aurelia.use.plugin('aurelia-testing');
    }

    return aurelia.start().then(() => {
        aurelia.setRoot()
    });


}
