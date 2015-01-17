breadcrumbs.provider('breadcrumbs', function BreadcrumbsProvider() {
  'use strict';
  var compile;

  function defaultCompiler(currentState) {
    if(!currentState.breadcrumb) { return null; }

    if(typeof currentState.breadcrumb === 'string') {
      return {
        text: currentState.breadcrumb,
        stateName: currentState.name
      };
    } else {
      return currentState.breadcrumb;
    }
  }

  compile = defaultCompiler;

  function refresh($state, breadcrumbs) {
    var currentState = $state.$current, breadcrumb;

    breadcrumbs.length = 0;

    while(currentState.parent) {
      breadcrumb = compile(currentState.self);
      if(breadcrumb) { 
        if(breadcrumb.constructor === Array) {
          for(var i = breadcrumb.length; i > 0; i--) {
            if(breadcrumb[i -1]) {
              breadcrumbs.unshift(breadcrumb[i - 1]);
            }
          }
        } else {
          breadcrumbs.unshift(breadcrumb);
        }
      }
      currentState = currentState.parent;
    }
    return breadcrumbs;
  }

  // Public Interface

  this.compileWith = function(customCompiler) {
    return compile = customCompiler || defaultCompiler;
  };

  this.$get = [
    '$rootScope',
    '$state',
    function($rootScope, $state) {
      var breadcrumbs = [];
      refresh($state, breadcrumbs);
      $rootScope.$on('$stateChangeSuccess', function() { refresh($state, breadcrumbs); });
      return breadcrumbs;
    }
  ];
});
