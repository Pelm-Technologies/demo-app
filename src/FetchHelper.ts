import {PELM_API_URL, PELM_CLIENT_ID, PELM_SECRET, USER_ID, ENVIRONMENT} from 'src/constants'
import fetchToCurl from 'fetch-to-curl';

export class FetchHelper {
    shouldUsePlaceholderValues: boolean;
    clientId: string;
    secret: string;
    connectToken?: string;
    authorizationCode?: string;
    accessToken?: string;

    constructor() {
        this.shouldUsePlaceholderValues = true;
        this.clientId = PELM_CLIENT_ID
        this.secret = PELM_SECRET

        // Keep this commented. Only uncomment for development purposes (to skip through part of the flow).
        // this.accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJhdXRoLXNlcnZlciIsImNyZWF0ZWRfYXQiOjE2NTkzODE0NTguMDE5NzY5MiwidXNlciI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImNsaWVudF9pZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCJ9.mYv4h4e6CNNz8YeDinO6IgmVXwgQ1KIssa5Y3yWq7M2nMAJ_-ZbRS6QCvFV8glhDYJ_zhlSM54QC9LWgMeRKAqebcj-McyYAxjsZZI6DlWjv-CxIkPnG0lODwOZW_8-IMDZMULyJkBmHDi3UoaCB-qYv0PIR94KbCGOA6ej3Srgy5vRV__S0D-oRYdysYZszuiCf276VGYnIjFyYEYaLptBAYfPYXRfmf3EszBilL7yRGoqil0yUpiEg64tFo8QlSwfDNi7MSpUkgQy6YXxJRSdQIJszqvZjEqMfROBe3ncalOjIX8n8-THGpvIol914Uo9nJxJnYw7FL3syzhXUZQ'
    }

    // We must clone this object whenever we need to update any fields so that we trigger a re-render.
    clone(): FetchHelper {
        const clone = Object.create(
            Object.getPrototypeOf(this), 
            Object.getOwnPropertyDescriptors(this) 
        );
        return clone;
    }

    setClientCredentials(clientId: string, secret: string) {
        this.shouldUsePlaceholderValues = false;
        this.clientId = clientId
        this.secret = secret
    }

    setAccessToken(accessToken: string) {
        this.accessToken = accessToken
    }

    baseHeaders(isExample?: boolean): Headers {
        const headers = new Headers();
        if (isExample) {
            headers.set('Pelm-Client-Id', '<YOUR_CLIENT_ID>');
            headers.set('Pelm-Secret', '<YOUR_SECRET>');
        } else {
            headers.set('Pelm-Client-Id', this.clientId);
            headers.set('Pelm-Secret', this.secret);
        }
        return headers;
    }

    headersWithAuthorization(isExample?: boolean): Headers {
        const headers = this.baseHeaders(isExample)
        const authorizationHeader = isExample
            ? 'Bearer <YOUR_ACCESS_TOKEN>'
            : `Bearer ${this.accessToken!}`
        headers.set('Authorization', authorizationHeader)
        return headers
    }

    // POST /auth/connect-token
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
        const curl = fetchToCurl(this.createConnectTokenRequestUrl(), this.createConnectTokenRequestOptions(userId, this.shouldUsePlaceholderValues));
        console.log("curl: " + curl)

        return curl
    }

    async createConnectToken(userId: string): Promise<any> {
        const url = this.createConnectTokenRequestUrl()
        const requestOptions = this.createConnectTokenRequestOptions(userId)
        return fetch(url, requestOptions)
            .then(response => {
                return response.json()
            })
    }

    // POST /auth/token
    createAccessTokenRequestUrl() {
        return PELM_API_URL + '/auth/token';
    }

    createAccessTokenRequestOptions(authorizationCode: string, isExample?: boolean) {
        const headers = this.baseHeaders(isExample);
        headers.set('Content-Type', 'application/x-www-form-urlencoded');

        const data = new URLSearchParams({
            grant_type: 'code',
            code: authorizationCode
        }).toString();
        const requestOptions = {
            method: 'POST',
            headers,
            body: data,
        };
        return requestOptions;
    }

    createAccessTokenCurl(authorizationCode?: string) {
        const code = authorizationCode
            ? authorizationCode
            : 'AUTHORIZATION_CODE'

        return fetchToCurl(this.createAccessTokenRequestUrl(), this.createAccessTokenRequestOptions(code, this.shouldUsePlaceholderValues));
    }

    async createAccessToken(authorizationCode: string): Promise<any> {
        const url = this.createAccessTokenRequestUrl()
        const requestOptions = this.createAccessTokenRequestOptions(authorizationCode)
        // fetch(this.createConnectTokenRequestUrl(), this.createConnectTokenRequestOptions())
        return fetch(url, requestOptions)
            .then(response => {
                return response.json()
            })
    }

    // GET /accounts
    getAccountsRequestUrl() {
        return  PELM_API_URL + '/accounts'
    }

    getAccountsRequestOptions(isExample?: boolean) {
        const headers = this.headersWithAuthorization(isExample)
        return {
            method: 'GET',
            headers
        };
    }

    getAccountsCurl() {
        return fetchToCurl(this.getAccountsRequestUrl(), this.getAccountsRequestOptions(this.shouldUsePlaceholderValues));
    }

    async getAccounts(): Promise<any> {
        const url = this.getAccountsRequestUrl()
        const requestOptions = this.getAccountsRequestOptions()
        return fetch(url, requestOptions)
            .then(response => {
                return response.json()
            })
    }

    // GET /intervals
    getIntervalsRequestUrl(accountId: string, type: string, startDate?: string, endDate?: string) {
        const params = {
            account_id: accountId,
            type: type,
            ...(startDate && { start_date: startDate }),
            ...(endDate && { end_date: endDate })
        }
        return `${PELM_API_URL}/intervals?` + new URLSearchParams(params);
    }

    getIntervalsRequestOptions(isExample?: boolean) {
        const headers = this.headersWithAuthorization(isExample)
        return {
            method: 'GET',
            headers
        };
    }

    getIntervalsCurl(accountId: string, type: string, startDate?: string, endDate?: string) {
        return fetchToCurl(this.getIntervalsRequestUrl(accountId, type, startDate, endDate), this.getIntervalsRequestOptions(this.shouldUsePlaceholderValues));
    }

    async getIntervals(accountId: string, type: string, startDate?: string, endDate?: string): Promise<any> {
        const url = this.getIntervalsRequestUrl(accountId, type, startDate, endDate)
        const requestOptions = this.getIntervalsRequestOptions()
        return fetch(url, requestOptions)
            .then(response => {
                return response.json()
            })
    }

    // GET /bills
    getBillsRequestUrl(accountId?: string) {
        const params = {
            ...(accountId && { account_id: accountId })
        }

        return `${PELM_API_URL}/bills?` + new URLSearchParams(params);
    }

    getBillsRequestOptions(isExample?: boolean) {
        const headers = this.headersWithAuthorization(isExample)
        return {
            method: 'GET',
            headers
        };
    }

    getBillsCurl(accountId?: string) {
        return fetchToCurl(this.getBillsRequestUrl(accountId), this.getBillsRequestOptions(this.shouldUsePlaceholderValues));
    }

    async getBills(accountId?: string): Promise<any> {
        const url = this.getBillsRequestUrl(accountId)
        const requestOptions = this.getBillsRequestOptions()
        return fetch(url, requestOptions)
            .then(response => {
                return response.json()
            })
    }

}