module.exports = {
  apps: [
    {
      name: "record-h5",
      script: "server.js",
    },
  ],
  deploy: {
    production: {
      user: "root",
      host: "119.91.110.227",
      ref: "origin/master",
      repo: "git@github.com:taokexia/record-react.git",
      path: "/workspace/record-react",
      "post-deploy":
        "git reset --hard && git checkout master && git pull && yarn install && yarn run build && pm2 startOrReload ecosystem.config.js", // -production=false 下载全量包
      env: {
        NODE_ENV: "production",
      },
    },
  },
};
