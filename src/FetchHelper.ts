import {PELM_API_URL, PELM_CLIENT_ID, PELM_SECRET, USER_ID, ENVIRONMENT} from 'src/constants'
import fetchToCurl from 'fetch-to-curl';

export class FetchHelper {
    shouldUseExampleCurls: boolean;
    clientId: string;
    secret: string;
    connectToken?: string;
    accessToken?: string;

    constructor() {
        this.shouldUseExampleCurls = true;
        this.clientId = PELM_CLIENT_ID
        this.secret = PELM_SECRET
    }

    setClientCredentials(clientId: string, secret: string) {
        this.shouldUseExampleCurls = false;
        this.clientId = clientId
        this.secret = secret
    }

    // We must clone this object whenever we need to update any fields so that we trigger a re-render.
    clone(): FetchHelper {
        const clone = Object.create(
            Object.getPrototypeOf(this), 
            Object.getOwnPropertyDescriptors(this) 
        );
        return clone;
    }

    baseHeaders(isExample?: boolean): Headers {
        const headers = new Headers();
        // headers.set('Pelm-Client-Id', PELM_CLIENT_ID);
        // headers.set('Pelm-Secret', PELM_SECRET);
        // headers.set('Pelm-Client-Id', this.props.clientId);
        // headers.set('Pelm-Secret', this.props.secret);
        // headers.set('Pelm-Client-Id', this.props.fetchHelper.clientId);
        // headers.set('Pelm-Secret', this.props.fetchHelper.secret);


        // headers.set('Pelm-Client-Id', this.clientId);
        // headers.set('Pelm-Secret', this.secret);

        if (isExample) {
            headers.set('Pelm-Client-Id', '<YOUR_CLIENT_ID>');
            headers.set('Pelm-Secret', '<YOUR_SECRET>');
        } else {
            headers.set('Pelm-Client-Id', this.clientId);
            headers.set('Pelm-Secret', this.secret);
        }

        // headers.set('Content-Type', 'application/x-www-form-urlencoded');
        return headers;
    }

    createConnectTokenRequestUrl() {
        return PELM_API_URL + '/auth/connect-token';
    }

    createConnectTokenRequestOptions(userId: string, isExample?: boolean) {
        const headers = this.baseHeaders(isExample);
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        const data = new URLSearchParams({
            user_id: userId
        }).toString();
        const requestOptions = {
            method: 'POST',
            headers,
            body: data,
        };
        return requestOptions;
    }

    createConnectTokenCurl(userId: string) {
        const curl = fetchToCurl(this.createConnectTokenRequestUrl(), this.createConnectTokenRequestOptions(userId, this.shouldUseExampleCurls));
        console.log("curl: " + curl)

        return curl
    }

    async createConnectToken(userId: string): Promise<any> {
        const url = this.createConnectTokenRequestUrl()
        const requestOptions = this.createConnectTokenRequestOptions(userId)
        // fetch(this.createConnectTokenRequestUrl(), this.createConnectTokenRequestOptions())
        return fetch(url, requestOptions)
            .then(response => {
                return response.json()
                if (response.ok) {
                    return response.json();
                } else {
                    return response.text().then(text => { throw new Error(text) })
                }
            })
            // .then((data) => {
            //     this.setState({
            //         isLoading: false,
            //         // connectToken: data['connect_token']
            //     })
            //     this.props.setConnectToken(data['connect_token'])
            // })
            // .catch((error: Error) => {
            //     try {
            //         this.setState({
            //             isLoading: false,
            //             error: error.message
            //         })
            //         const errorObject = JSON.parse(error.message);
            //         console.log(errorObject)
            //     } catch(e) {
            //         console.log("an error occurred")
            //     }

        // return {}

    }

}