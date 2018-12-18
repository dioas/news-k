# News-K
API for Kumparan News Feed

[![Code Style](https://img.shields.io/badge/code%20style-standard-green.svg)](https://github.com/feross/standard)


[Installation](#installation) |
[Production Environment](#production-environment) |
[License](#license)

<p>
  <img src="https://assets-a2.kompasiana.com/items/album/2017/02/10/active-1822476-960-720-589d1bbd9a9373a5048b4569.jpg?t=o&v=760" width="600">
  <blockquote>
  Why News-K?
  </blockquote>
</p>


## Installation

### Prerequisites
- Node.js - Download and Install [Node.js](https://nodejs.org/en/) with [NVM](https://github.com/creationix/nvm) (Node Version Manager) - Simple bash script to manage multiple active node.js versions.
- MySQL - Download and Install [MySQL](https://www.mysql.com/downloads/) - Make sure it's running on the default port.

```
  $ git@github.com/gratcy/news-k.git
  $ cd news-k
  $ cp .env.sample .env
  $ npm install
  $ npm start
```

### Production Environment

To setup on production you just config all access to your service on [ecosystem.json](https://github.com/urbanhire/jarvis/blob/dev/ecosystem.json). We use [PM2](https://pm2.io/doc/en/runtime/overview) to deploy our apps to production from you local machine and we use `PM2 Runtime` to running process manager on production

**Start application for firstime on production server**

```
$ npm run start:production

```


**Deployment to production server**

Currently our deployment process still manually from your local machine. We use **PM2** `ecosystem.json` as configuration for deployment spesific server.
On our production we use 2 server for blaze to make high availability our web if one server is down/restart.

To start release/deploy your code to production, we need to merge all released code to branch `prod`. The first need to do before merging code to prod branch is to created [pull request](https://github.com/urbanhire/blaze/pulls) on github from your featured branch to branch `dev` (after that make PR from dev to prod branch), or direct to branch `prod` if its an hotfix.

After all the code has been merge to branch prod, now you can run deploy script from your local machine/laptop by running script below:

```
$ npm run deploy-production

```

### License
----

[Beerware](https://en.wikipedia.org/wiki/Beerware "Beerware") © [Gratcy Palma P Hutapea]