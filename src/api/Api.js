const baseUrl = process.env.REACT_APP_API_URL;
const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

export class Api {

    static get(suffix) {
        async function fetchGet() {
            try {
                let response = await fetch(baseUrl + suffix, {
                    headers: headers
                });

                if (response.status === 200) {
                    return await response.json();
                } else {
                    return Promise.reject(await response.json());
                }

            } catch (error) {
                console.error(error);
            }
        }

        return fetchGet();
    }

    static post(suffix, body) {
        async function fetchPost() {
            try {
                let response = await fetch(baseUrl + suffix, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(body)
                });

                if (response.status === 200) {
                    return await response.json();
                } else {
                    return Promise.reject(await response.json());
                }

            } catch (error) {
                console.error(error);
            }
        }

        return fetchPost();
    }

    static patch(suffix, body) {
        async function fetchPatch() {
            try {
                let response = await fetch(baseUrl + suffix, {
                        method: 'PATCH',
                        headers: headers,
                        body: JSON.stringify(body)
                    }
                );

                if (response.status === 200) {
                    return await response.json();
                } else {
                    return Promise.reject(await response.json());
                }

            } catch (error) {
                console.error(error);
            }
        }

        return fetchPatch();
    }

    static delete(suffix) {
        async function fetchDelete() {
            try {
                let response = await fetch(baseUrl + suffix, {
                        method: 'DELETE',
                        headers: headers,
                    }
                );

                if (response.status === 200) {
                    return await response._bodyText && response.json();
                } else {
                    return Promise.reject(await response.json());
                }

            } catch (error) {
                console.error(error);
            }
        }

        return fetchDelete();
    }

    static getErrorNotification(response) {
        let notification = null;

        if (response && response.code !== 200 && response.errors) {
            let message = '';

            response.errors.forEach((error) => {
                message = message + " " + error;
            });

            if (message) {
                return {
                    message: message,
                    options: {
                        type: 'error'
                    }
                }
            }
        }

        return notification;
    }
}

export default Api;