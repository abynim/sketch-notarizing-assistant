var go = function(context) {
  try { Notarize.go(context); }
  catch(e) {
      if(Mocha.sharedRuntime().loadFrameworkWithName_inDirectory('Notarize', NSBundle.bundleWithURL(context.plugin.url()).resourceURL().path())) {
          Notarize.go(context);
      }
  }
}