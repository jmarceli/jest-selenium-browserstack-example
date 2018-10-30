var JestSeleniumBrowserStackExample = (function (exports) {
  'use strict';

  //      
  var write = function write(elementId) {
    var el = document.getElementById(elementId);
    el.value = 'Something';
  };

  exports.write = write;

  return exports;

}({}));
//# sourceMappingURL=jest-selenium-browserstack-example.js.map
