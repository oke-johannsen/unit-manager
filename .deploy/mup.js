module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: "HOST",
      username: "USR",
      password: "PWD",
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
      ROOT_URL: "URL",
      MONGO_URL: "mongodb+srv://USR:PWD@MONGODB/",
    },

    docker: {
      image: "zodern/meteor:root",
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true,
  },
};
