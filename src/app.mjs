import Configure from './config/configure.mjs';
import bodyParser from 'body-parser';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import route from './route/index.mjs';
import dir from 'express';
const privateProps = new WeakMap();

export default class App extends Configure {
    constructor(app, port) {
        super();
        this.app = app;
        this.port = port;
        privateProps.set(this.connection());
    }

    run = () => {
        const app = this.app;
        const port = this.port;
        const __dirname = dirname(fileURLToPath(import.meta.url));

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(route);
        app.use(dir.static(__dirname +'/public'));

        return app.listen(port, () => {
            try {
                console.log(`Running on port ${this.port} ✌`);
            } catch (error) {
                throw new Error(error);
            }
        });
    }
}