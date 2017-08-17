import reduce from 'lodash/reduce';

class UrlGenerator {
    constructor(routes) {
        this.routes = routes;
    }

    route(key, options) {
        const { withHost, ...params } = options || {};
        const route = this.routes[key] || key;
        const url = reduce(params || {}, (str, v, k) => str.replace(`_-${k}-_`, v), route);

        if (typeof withHost !== 'undefined' && withHost === true) {
            return url;
        }

        const host = typeof window !== 'undefined' ? `^${window.location.protocol}//${window.location.host}` : '^$';
        const urlWithoutHost = url.replace(new RegExp(host, 'i'), '');
        return urlWithoutHost === '' ? '/' : urlWithoutHost;
    }
}

export default UrlGenerator;
