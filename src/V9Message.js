/*
 * @Author: hoangdx (Hoang Do) 
 * @Date: 2022-10-29 11:09:42 
 * @Last Modified by: hoangdx (Hoang Do)
 * @Last Modified time: 2022-10-29 16:46:30
 */

module.exports = class V9Message {

    constructor({
            accountId,
            contactUri,
            fromUri,
            toUri,
            body,
            contentType
        }) {
        let fromNumber = null;
        let fromName = null;

        if (fromUri) {
            let match = fromUri.match(/"([^"]+)" <sip:([^@]+)@/);

            if (match) {
                fromName = match[1];
                fromNumber = match[2];
            } else {
                match = fromUri.match(/sip:([^@]+)@/);

                if (match) {
                    fromNumber = match[1];
                }
            }
        }

        this._accountId = accountId;
        this._contactUri = contactUri;
        this._fromUri = fromUri;
        this._fromName = fromName;
        this._fromNumber = fromNumber;
        this._toUri = toUri;
        this._body = body;
        this._contentType = contentType;
    }

    /**
     * ID tài khoản chứa tin nhắn này.
     * @returns {int}
     */
    getAccountId() {
        return this._accountId;
    }

    /**
     * URI liên hệ của người gửi, nếu có.
     * @returns {String}
     */
    getContactUri() {
        return this._contactUri;
    }

    /**
     * URI của người gửi.
     * @returns {String}
     */
    getFromUri() {
        return this._fromUri;
    }

    /**
     * Tên người gửi hoặc NULL nếu không có tên nào được chỉ định trong URI.
     * @returns {String}
     */
    getFromName() {
        return this._fromName;
    }

    /**
     * Số người gửi
     * @returns {String}
     */
    getFromNumber() {
        return this._fromNumber;
    }

    /**
     * URI của tin nhắn đích.
     * @returns {String}
     */
    getToUri() {
        return this._toUri;
    }

    /**
     * Nội dung tin nhắn hoặc NULL nếu không có nội dung tin nhắn nào được đính kèm vào tin nhắn này.
     * @returns {String}
     */
    getBody() {
        return this._body;
    }

    /**
     * Loại MIME của tin nhắn.
     * @returns {String}
     */
    getContentType() {
        return this._contentType;
    }

}