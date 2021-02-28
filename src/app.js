const Configure = require('./config/configure');
const route = require('./route/index');
const bodyParser = require('body-parser');
const dir = require('express');
const privateProps = new WeakMap();

class App extends Configure {
    constructor(app, port) {
        super();
        this.app = app;
        this.port = port;
        privateProps.set(this.connection());
    }

    run = () => {
        const app = this.app;
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(route);
        app.use(dir.static(__dirname +'/public'));

        return app.listen(this.port, () => {
            try {
                console.log(`Running on port ${this.port} ✌`);
            } catch (error) {
                throw new Error(error);
            }
        });
    }
}

module.exports = App;