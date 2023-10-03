module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: "5.181.51.205",
      username: "root",
      password: "7yU3vc6MHfFW7Jr",
      // pem: './path/to/pem'
      // or neither for authenticate from ssh-agent
    },
  },

  app: {
    // TODO: change app name and path
    name: "unit-manager",
    path: "../",
    deployCheckPort: 3000,

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: "https://v2202309206749239350.megasrv.de",
      MONGO_URL:
        "mongodb://eden-app:LdCcq6CdtbZRmsfuX@SG-eugalaxycluster-38731.servers.mongodirector.com:27017,SG-eugalaxycluster-38732.servers.mongodirector.com:27017/tf11-eu-meteorapp-com?replicaSet=RS-eugalaxycluster-0&tls=true&tlsAllowInvalidCertificates=true",
    },

    docker: {
      image: "zodern/meteor:root",
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true,
  },

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  // proxy: {
  //   domains: 'mywebsite.com,www.mywebsite.com',

  //   ssl: {
  //     // Enable Let's Encrypt
  //     letsEncryptEmail: 'email@domain.com'
  //   }
  // }
};
