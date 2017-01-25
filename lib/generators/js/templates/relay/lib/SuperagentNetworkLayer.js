import { DefaultNetworkLayer } from 'react-relay';
import superagent from 'superagent';
import superagentRetry from 'superagent-retry';
import superagentPromise from 'superagent-promise';
import each from 'lodash/each';

// Add plugins to superagent
superagentRetry(superagent);
superagentPromise(superagent, Promise);

class SuperagentNetworkLayer extends DefaultNetworkLayer {

    buildRequest(request) {
        const superagentRequest = superagent.post(this._uri)
            .send({
                query: request.getQueryString(),
                variables: request.getVariables(),
            })
            .set('Accept', 'application/json,*/*')
            .set('Content-Type', 'application/json');

        const headers = this._init.headers || {};
        each(headers, (value, key) => {
            superagentRequest.set(key, value);
        });

        return superagentRequest;
    }

    /**
    * Sends a POST request with optional files.
    */
    _sendMutation(request) {
        const superagentRequest = this.buildRequest(request);

        const files = request.getFiles();
        if (files) {
            each(files, (file, filename) => {
                superagentRequest.attach(filename, file);
            });
        }

        return superagentRequest.then(response => ({
            json: () => response.body,
        }));
    }

    /**
    * Sends a POST request and retries if the request fails or times out.
    */
    _sendQuery(request) {
        const superagentRequest = this.buildRequest(request);

        return superagentRequest.then(response => ({
            json: () => response.body,
        }));
    }

}

export default SuperagentNetworkLayer;
