const glob = require('glob');
import { Router } from 'express';

module.exports = () => {
    const files = glob.sync('**/*.js', { cwd: `${__dirname}/` });

    const routerFiles = [];
    for (const file of files) {
        if (Object.getPrototypeOf(require(`./${file}`)) == Router) {
            console.log(file)
            routerFiles.push(require(`./${file}`));
        }
    }
    return routerFiles.reduce((rootRouter: any, router: any) => rootRouter.use(router), Router({ mergeParams: true }));
    
    // return glob.sync('**/*.js', { cwd: `${__dirname}/` })
    //     .map((filename: string) => require(`./${filename}`))
    //     .filter((router: any) => Object.getPrototypeOf(router) == Router)
    //     .reduce((rootRouter: any, router: any) => rootRouter.use(router), Router({ mergeParams: true }))
}
