const Configure = require('./config/Configure');
const route = require('./route/index');
const bodyParser = require('body-parser');
const privateProps = new WeakMap();

class App extends Configure {
    constructor(app, port) {
        super();
        this.app = app;
        this.port = port;
        privateProps.set(this.connection());
    }

    run() {
        
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(route);
        return this.app.listen(this.port, () => {
            try {
                console.log(`Running on port ${this.port} ✌`);
            } catch (error) {
                throw new Error(error);
            }
        });
    }
}

module.exports = App;