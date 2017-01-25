import reduce from 'lodash/reduce';

class URL {

    constructor(routes) {
        this.routes = routes;
    }

    route(key, opts) {
        const prefix = typeof window !== 'undefined' ? `http://${window.location.host}` : '';

        let url = (this.routes[key] || key).replace(prefix, '');
        if (typeof opts !== 'undefined') {
            url = reduce(opts, (str, v, k) => str.replace(`:${k}`, v), url);
        }

        return url;
    }
}

export default URL;
