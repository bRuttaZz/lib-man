export const URL_PREFIX = document.querySelector(".config-elem")?.dataset?.urlPrefix || "";

/**
 * Yet an another implementation of ajax call :) 
 * Noo! Actually I dont hate jquery
 * @param {String} url - url to be called
 * @param {String} method - method
 * @param {Object} data - data to be passed along side (will be jsonified) 
 * @param {Object} headers - additional headers 
 * @returns 
 */
export function ajax(url, method = "GET", data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest()
        request.open(method, url)
        for (let key in headers)
            request.setRequestHeader(key, headers[key])
        if (data && Object.keys(data).length > 0)
            request.setRequestHeader("Content-Type", "application/json")
        request.onerror = () => {
            let json = {}
            try {
                json = JSON.parse(request.response)
            }
            catch {
                json = undefined
            }
            return reject({
                status: request.status,
                response: request.response, json: json
            })
        }
        request.onload = () => {
            let json = {}
            try {
                json = JSON.parse(request.response)
            }
            catch {
                json = undefined
            }
            return resolve({ status: request.status, response: request.response, json: json })
        }
        request.send(JSON.stringify(data))
    })
}

export function deleteAllCookies() {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    }
}

/**
 * Field validators
 */
export class FieldValidators {
    static emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    static indianMobileRegex = /^[6789]\d{9}$/;

    static emailValidator(string) {
        return this.emailRegex.test(string);
    }

    static phoneValidator(string) {
        return this.indianMobileRegex.test(string);
    }

    static lengthChecker(string, min, max) {
        return min < string.length && max > string.length ? true : false
    }
}