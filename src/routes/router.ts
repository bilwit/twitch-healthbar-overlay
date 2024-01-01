const glob = require('glob');
import { Router } from 'express';

module.exports = () => {
  const files = glob.sync('**/*.js', { cwd: `${__dirname}/` });

  const routerFiles = [];
  for (const file of files) {
    if (Object.getPrototypeOf(require(`./${file}`)) == Router) {
      routerFiles.push(require(`./${file}`));
    }
  }
  return routerFiles.reduce((rootRouter: any, router: any) => rootRouter.use(router), Router({ mergeParams: true }));
}
