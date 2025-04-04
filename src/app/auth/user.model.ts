export class User {
    constructor(
        public email: string, 
        public id: string, 
        private _token: string,
        private _tokenExpirationDate: Date

    ) {}

    get token() {
        console.log('Token expiration:', this._tokenExpirationDate);
        console.log('Current date:', new Date());
        console.log('Is token expired:', !this._tokenExpirationDate || new Date() > this._tokenExpirationDate);
        // token expiration date doesn't exist OR
        // token expired
       if (!this._tokenExpirationDate || new Date > this._tokenExpirationDate) {
            return null;
       }
       return this._token;
    }
}