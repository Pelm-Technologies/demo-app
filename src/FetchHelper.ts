import {PELM_API_URL, PELM_CLIENT_ID, PELM_SECRET, USER_ID, ENVIRONMENT} from 'src/constants'


export class FetchHelper {
    clientId: string;
    secret: string;
    connectToken?: string;
    accessToken?: string;

    constructor() {
        this.clientId = PELM_CLIENT_ID
        this.secret = PELM_SECRET
    }

    setClientCredentials(clientId: string, secret: string) {
        this.clientId = clientId
        this.secret = secret
    }

    clone(): FetchHelper {
        console.log("cloning")
        console.log(this)
        const clone = Object.create(
            Object.getPrototypeOf(this), 
            Object.getOwnPropertyDescriptors(this) 
        );
        console.log("cloned")
        console.log(clone)
        return clone;
    }

}