function loggingInterceptor(options, nextCall) {
  return new nextCall.constructor({
    start: function(metadata, listener, next) {
      const method = options.method_definition && options.method_definition.path;
      console.log(`[gRPC] Call: ${method} Metadata:`, metadata.getMap());
      const newListener = {
        onReceiveMessage: (message, next) => {
          next(message);
        },
        onReceiveStatus: (status, next) => {
          if (status.code !== 0) {
            console.error(`[gRPC] Error: ${method} - ${status.details}`);
          }
          next(status);
        }
      };
      next(metadata, newListener);
    }
  });
}

module.exports = loggingInterceptor;