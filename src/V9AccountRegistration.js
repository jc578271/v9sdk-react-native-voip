/*
 * @Author: hoangdx (Hoang Do) 
 * @Date: 2022-10-29 10:51:51 
 * @Last Modified by: hoangdx (Hoang Do)
 * @Last Modified time: 2022-10-31 10:41:46
 */

/**
 * Thông tin đăng ký tài khoản. Ứng dụng có thể truy vấn thông tin đăng ký
 * gọi account.getRegistration().
 */
 module.exports = class V9AccountRegistration {
    
    constructor({status, statusText, active, reason}) {
        this._status = status;
        this._statusText = statusText;
        this._active = active;
        this._reason = reason;
    }

    /**
     * Mã trạng thái đăng ký lần cuối (mã trạng thái SIP theo RFC 3261).
     * Nếu mã trạng thái trống, tài khoản hiện chưa được đăng ký. Bất kỳ giá trị nào khác cho biết SIP
     * mã trạng thái của đăng ký.
     *
     * @returns {string|null}
     */
    getStatus() {
        return this._status;
    }

    /**
     * Trạng thái đăng ký trả về text.
     *
     * @returns {string|null}
     */
    getStatusText() {
        return this._statusText;
    }

    /**
     * Kiểm tra tài khoản hiện đã được đăng ký
     *
     * @returns boolean
     */
    isActive() {
        return this._active;
    }

    /**
     * Get Reason.
     *
     * @returns {String|null}
     */
    getReason() {
        return this._reason;
    }

    toJson() {
        return  {
            status: this._status,
            statusText: this._statusText,
            active: this._active,
            reason: this._reason
        }
    }
}