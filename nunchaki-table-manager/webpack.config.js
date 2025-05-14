const path = require('path');

module.exports = {
  // ... existing code ...
  resolve: {
    // ... existing code ...
    fallback: {
      "fs": false,
      "net": false,
      "https": require.resolve("https-browserify"),
      "http": require.resolve("stream-http"),
      "stream": require.resolve("stream-browserify"),
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "crypto": require.resolve("crypto-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "querystring": require.resolve("querystring-es3"),
      "tty": require.resolve("tty-browserify"),
      "worker_threads": false,
      "child_process": false,
      "tls": false
    }
  }
  // ... existing code ...
} 