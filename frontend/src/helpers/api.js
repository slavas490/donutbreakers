class Api {
    constructor () {
        this.apiLocation = document.location.hostname + ':8080';

        let eventCallbacks = [];

        this.on = (name, callback) => {
            if(!eventCallbacks.filter(item => item.name === name).length) {
                eventCallbacks.push({
                    name,
                    callback
                });
            }
        }

        this.event = (name, data) => {
            eventCallbacks.forEach(item => {
                if(item.name === name && item.callback instanceof Function) {
                    item.callback(data);
                }
            });
        }
    }

    sendRequest = (method, action = '', data = null) => {
        let option = {
            method,
            // credentials: 'include'
        };
        
        if(data instanceof FormData) {
            option.body = data;
        }
        else if((method === 'POST' || method === 'PUT') && data) {
            option.body = JSON.stringify(data);
            option.headers = { 'Content-Type': 'application/json; charset=utf-8' };
        }

        let requestUrl = new URL(action, 'http://' + this.apiLocation);

        return fetch(requestUrl, option)
        .then(out => out.json())
        .then(data => {            
            if(data){
                if(data.status === 0) {
                    return data;
                }
                else {
                    this.event('error', data.error);

                    throw data.error;
                }
            }
            else {
                throw new Error('empty response on ' + requestUrl);
            }
        });
    }

    get = (action) => {
        return this.sendRequest('GET', action);
    }

    post = (action, data) => {
        return this.sendRequest('POST', action, data);
    }

    put = (action, data) => {
        return this.sendRequest('PUT', action, data);
    }

    delete = (action, data) => {
        return this.sendRequest('DELETE', action, data);
    }

    getAPIUrl = () => {
        return this.apiLocation;
    }
}

export default new Api();