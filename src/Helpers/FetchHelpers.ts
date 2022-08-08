import { PELM_API_URL, PELM_CLIENT_ID, PELM_SECRET, USER_ID, ENVIRONMENT } from '../constants'


export function requestHeaders(isExample: boolean, accessToken?: string) {
    // let accessToken: string;
    // let clientId: string;
    // let secret: string;

    let obj: any;

    if (isExample) {
        obj = {
            'Authorization': 'Bearer <YOUR_ACCESS_TOKEN>',
            'Pelm-Client-Id': '<YOUR_CLIENT_ID>',
            'Pelm-Secret': '<YOUR_SECRET>'
        };
    } else {
        obj = {
            'Authorization': 'Bearer ' + accessToken,
            'Pelm-Client-Id': PELM_CLIENT_ID,
            'Pelm-Secret': PELM_SECRET
        };
    }

    return new Headers(obj);

     
}