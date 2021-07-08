// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"background.js":[function(require,module,exports) {
(function () {
  var state = new State();
  chrome.browserAction.onClicked.addListener(function () {
    state.toggle();
    return true;
  });
  chrome.tabs.onActivated.addListener(function (_ref) {
    var tabId = _ref.tabId;

    if (tabId in state.get()) {
      state.activeCurrent(tabId);
    } else {
      state.reset();
    }

    return true;
  });
  chrome.tabs.onRemoved.addListener(function (tabId, _ref2) {
    var windowId = _ref2.windowId,
        isClosing = _ref2.isClosing;

    if (isClosing) {
      state.flushall();
    } else {
      state.flush(tabId);
    }
  });

  function State() {
    var activeState = {
      icon: "icons/active.png",
      active: true
    };
    var inactiveState = {
      icon: "icons/inactive.png",
      active: false
    };
    var state = {
      current: inactiveState
    };

    var setState = function setState(iconPath, active) {
      iconConfig = {
        path: iconPath
      };
      chrome.browserAction.setIcon(iconConfig);
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function (tabs) {
        var tabId = tabs[0].id;
        state[tabId] = state.current;
        chrome.tabs.sendMessage(tabId, {
          active: active
        });
      });
    };

    this.activeCurrent = function (tabId) {
      state.current = state[tabId];
      setState(state.current.icon, state.current.active);
    };

    this.active = function () {
      state.current = activeState;
      setState(state.current.icon, state.current.active);
    };

    this.inactive = function () {
      state.current = inactiveState;
      setState(state.current.icon, state.current.active);
    };

    this.toggle = function () {
      state.current = state.current.active ? inactiveState : activeState;
      setState(state.current.icon, state.current.active);
    };

    this.flushall = function () {
      state = {
        current: inactiveState
      };
    };

    this.flush = function (tabId) {
      delete state[tabId];
    };

    this.reset = function () {
      this.inactive();
    };

    this.get = function () {
      return state;
    };
  }
})();
},{}]},{},["background.js"], "moduleName")