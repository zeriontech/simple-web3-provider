// https://mathiasbynens.be/notes/globalthis

(function () {
  if (typeof globalThis === 'object') return;
  Object.defineProperty(Object.prototype, '__magic__', {
    get: function () {
      return this;
    },
    configurable: true,
  });
  // eslint-disable-next-line no-undef
  __magic__.globalThis = __magic__;
  delete Object.prototype.__magic__;
})();
