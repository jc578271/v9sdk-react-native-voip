/*
 * @Author: hoangdx (Hoang Do) 
 * @Date: 2022-10-29 10:51:58 
 * @Last Modified by: hoangdx (Hoang Do)
 * @Last Modified time: 2022-10-31 10:52:29
 */
const V9AccountRegistration = require('./V9AccountRegistration');
/**
 * Thông tin tài khoản khi đăng ký thành công
 */
 module.exports = class V9Account {

    constructor(data) {
        this._data = data;
        this._registration = new V9AccountRegistration(data['registration']);
    }

    /**
     * Account Id.
     * @returns {int}
     */
    getId() {
        return this._data.id;
    }

    /**
     * Đây là URL sẽ được đưa vào URI yêu cầu cho việc đăng ký và sẽ có dạng giống như : "sip:domain.com".
     * @returns {String}
     */
    getURI() {
        return this._data.uri;
    }

    /**
     * Tên đầy đủ được chỉ định trong Endpoint.createAccount().
     * @returns {String}
     */
    getName() {
        return this._data.name;
    }

    /**
     * Tên người dùng được chỉ định trong Endpoint.createAccount().
     * @returns {String}
     */
    getUsername() {
        return this._data.username;
    }

    /**
     * Miền được chỉ định trong Endpoint.createAccount().
     * @returns {String|null}
     */
    getDomain() {
        return this._data.domain;
    }

    /**
     * Mật khẩu được chỉ định trong Endpoint.createAccount().
     * @returns {String}
     */
    getPassword() {
        return this._data.password;
    }

    /**
     * Proxy được chỉ định trong Endpoint.createAccount().
     * @returns {String}
     */
    getProxy() {
        return this._data.proxy;
    }

    /**
     * Transport được chỉ định trong Endpoint.createAccount().
     * @returns {String}
     */
    getTransport() {
        return this._data.transport;
    }

    /**
     * Các thông số bổ sung sẽ được thêm vào Contact header
     * cho tài khoản.
     * @returns {String}
     */
    getContactParams() {
        return this._data.contactParams;
    }

    /**
     * Các tham số URI bổ sung sẽ được thêm vào Contact URI
     * cho tài khoản.
     * @returns {String}
     */
    getContactUriParams() {
        return this._data.contactUriParams;
    }

    /**
     * Port được chỉ định trong Endpoint.createAccount().
     * @returns {String}
     */
    getRegServer() {
        return this._data.regServer || "";
    }

    /**
     * Port được chỉ định trong Endpoint.createAccount().
     * @returns {String}
     */
    getRegTimeout() {
        return this._data.regTimeout;
    }

    /**
     * @returns {String}
     */
    getRegContactParams() {
        return this._data.regContactParams;
    }

    /**
     * @returns {Object}
     */
    getRegHeaders() {
        return this._data.regHeaders;
    }

    /**
     * Trạng thái đăng ký tài khoản.
     * @returns {AccountRegistration}
     */
    getRegistration() {
        return this._registration;
    }
}