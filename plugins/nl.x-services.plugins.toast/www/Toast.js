function Toast() {
}

Toast.prototype.optionsBuilder = function () {

  // defaults
  var message = null;
  var duration = "short";
  var position = "center";

  return {
    withMessage: function(m) {
      message = m;
      return this;
    },

    withDuration: function(d) {
      duration = d;
      return this;
    },

    withPosition: function(p) {
      position = p;
      return this;
    },

    build: function() {
      return {
        message: message,
        duration: duration,
        position: position
      }
    }
  }
};


Toast.prototype.showWithOptions = function (options, successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "Toast", "show", [options]);
};

Toast.prototype.show = function (message, duration, position, successCallback, errorCallback) {
  this.showWithOptions(
      this.optionsBuilder()
          .withMessage(message)
          .withDuration(duration)
          .withPosition(position)
          .build(),
      successCallback,
      errorCallback);
};

Toast.prototype.showShortTop = function (message, successCallback, errorCallback) {
  this.show(message, "short", "top", successCallback, errorCallback);
};

Toast.prototype.showShortCenter = function (message, successCallback, errorCallback) {
  this.show(message, "short", "center", successCallback, errorCallback);
};

Toast.prototype.showShortBottom = function (message, successCallback, errorCallback) {
  this.show(message, "short", "bottom", successCallback, errorCallback);
};

Toast.prototype.showLongTop = function (message, successCallback, errorCallback) {
  this.show(message, "long", "top", successCallback, errorCallback);
};

Toast.prototype.showLongCenter = function (message, successCallback, errorCallback) {
  this.show(message, "long", "center", successCallback, errorCallback);
};

Toast.prototype.showLongBottom = function (message, successCallback, errorCallback) {
  this.show(message, "long", "bottom", successCallback, errorCallback);
};

Toast.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.toast = new Toast();
  return window.plugins.toast;
};

cordova.addConstructor(Toast.install);