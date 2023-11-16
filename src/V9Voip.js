/*
 * @Author: hoangdx (Hoang Do) 
 * @Date: 2022-10-29 10:55:01 
 * @Last Modified by: hoangdx (Hoang Do)
 * @Last Modified time: 2022-11-04 17:12:52
 */

const {React, DeviceEventEmitter, NativeModules} = require('react-native');
const EventEmitter = require('events');
const Call = require('./V9Call');
const Message = require('./V9Message');
const Account = require('./V9Account');

module.exports = class V9Voip extends EventEmitter { 

    constructor() {
        super();

        // Subscribe to Accounts events
        DeviceEventEmitter.addListener('RegistrationChanged', this._onRegistrationChanged.bind(this));

        // Subscribe to Calls events
        DeviceEventEmitter.addListener('CallReceived', this._onCallReceived.bind(this));
        DeviceEventEmitter.addListener('CallChanged', this._onCallChanged.bind(this));
        DeviceEventEmitter.addListener('CallTerminated', this._onCallTerminated.bind(this));
        DeviceEventEmitter.addListener('CallScreenLocked', this._onCallScreenLocked.bind(this));
        DeviceEventEmitter.addListener('MessageReceived', this._onMessageReceived.bind(this));
        DeviceEventEmitter.addListener('ConnectivityChanged', this._onConnectivityChanged.bind(this));
    }

    /**
     * @returns {Promise}
     */
     start(configuration) {
        return new Promise(function(resolve, reject) {
            NativeModules.V9SipModule.start(configuration, (successful, data) => {
                if (successful) {
                    let accounts = [];
                    let calls = [];

                    if (data.hasOwnProperty('accounts')) {
                        for (let d of data['accounts']) {
                            accounts.push(new Account(d));
                        }
                    }

                    if (data.hasOwnProperty('calls')) {
                        for (let d of data['calls']) {
                            calls.push(new Call(d));
                        }
                    }

                    let extra = {};

                    for (let key in data) {
                        if (data.hasOwnProperty(key) && key != "accounts" && key != "calls") {
                            extra[key] = data[key];
                        }
                    }

                    resolve({
                        accounts,
                        calls,
                        ...extra
                    });
                } else {
                    reject(data);
                }
            });
        });
    }

    /**
     * @param configuration
     * @returns {Promise}
     */
    changeNetworkConfiguration(configuration) {
        return new Promise(function(resolve, reject) {
            NativeModules.V9SipModule.changeNetworkConfiguration(configuration, (successful, data) => {
                if (successful) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    /**
     * @param configuration
     * @returns {Promise}
     */
    changeServiceConfiguration(configuration) {
        return new Promise(function(resolve, reject) {
            NativeModules.V9SipModule.changeServiceConfiguration(configuration, (successful, data) => {
                if (successful) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    /**
     * Thêm một tài khoản mới.
     * Nếu đăng ký được cấu hình cho tài khoản này, chức năng này cũng sẽ bắt đầu phiên đăng ký SIP với máy chủ đăng ký SIP.
     * Phiên đăng ký SIP này sẽ được thư viện duy trì nội bộ và ứng dụng không cần phải làm bất cứ điều gì để duy trì phiên đăng ký.
     *
     * Example configuration:
     * {
     *   name: "Hoang Do",
     *   username: "100",
     *   domain: "v9.com.vn",
     *   password: "XXXXXX",
     *
     *   proxy: "192.168.100.1:5060", // default disabled.
     *   transport: "UDP", // default UDP
     *   regServer: "v9.com.vn", // default taken from domain
     *   regTimeout: 1000, // default 1000
     * }
     *
     * @param {Object} configuration
     * @returns {Promise}
     */
     addAccount(configuration) {
        return new Promise(function(resolve, reject) {
            NativeModules.V9SipModule.createAccount(configuration, (successful, data) => {
                if (successful) {
                    resolve(new Account(data));
                } else {
                    reject(data);
                }
            });
        });
    }

    replaceAccount(account, configuration) {
        throw new Error("Not implemented");
    }

    /**
     * Cập nhật đăng ký hoặc thực hiện hủy đăng ký.
     * Nếu đăng ký được cấu hình cho tài khoản này, thì ĐĂNG KÝ SIP ban đầu sẽ được gửi khi tài khoản được thêm.
     * Ứng dụng thông thường chỉ cần gọi chức năng này nếu nó muốn cập nhật thủ công đăng ký hoặc hủy đăng ký khỏi máy chủ.
     *
     * @param {Account} account
     * @param bool renew Nếu đối số renew bằng false => hủy đăng ký.
     * @returns {Promise}
     */
     registerAccount(account, renew = true) {
        return new Promise(function(resolve, reject) {
            NativeModules.V9SipModule.registerAccount(account.getId(), renew, (successful, data) => {
                if (successful) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    /**
     * Xóa tài khoản. Thao tác này sẽ hủy đăng ký tài khoản khỏi máy chủ SIP, nếu cần và chấm dứt các đăng ký hiện diện phía máy chủ được liên kết với tài khoản này.
     *
     * @param {Account} account
     * @returns {Promise}
     */
    deleteAccount(account) {
        return new Promise(function(resolve, reject) {
            NativeModules.V9SipModule.deleteAccount(account.getId(), (successful, data) => {
                if (successful) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }


    /**
     * Thực hiện cuộc gọi đi đến URI được chỉ định.
     * Cài đặt cuộc gọi có sẵn:
     * - audioCount - Số luồng âm thanh hoạt động đồng thời cho cuộc gọi này. Đặt giá trị này thành 0 sẽ tắt âm thanh trong cuộc gọi này.
     * - videoCount - Số luồng video hoạt động đồng thời cho cuộc gọi này. Đặt giá trị này thành 0 sẽ tắt video trong cuộc gọi này.
     * -
     *
     * @param account {Account}
     * @param destination {String} Số điện thoại được chỉ định gọi.
     * @param callSettings {V9SipCallSetttings} Cài đặt cuộc gọi đi.
     * @param msgSettings {V9SipMsgData} Cuộc gọi đi thông tin bổ sung sẽ được gửi cùng với tin nhắn SIP đi.
     */
     makeCall(account, destination, callSettings, msgData) {
        destination = this._normalize(account, destination);

        return new Promise(function(resolve, reject) {
            NativeModules.V9SipModule.makeCall(account.getId(), destination, callSettings, msgData, (successful, data) => {
                if (successful) {
                    resolve(new Call(data));
                } else {
                    reject(data);
                }
            });
        });
    }

    /**
     * Gửi phản hồi cho yêu cầu INVITE đến.
     *
     * @param call {Call} Call instance
     * @returns {Promise}
     */
    answerCall(call) {
        return new Promise((resolve, reject) => {
            NativeModules.V9SipModule.answerCall(call.getId(), (successful, data) => {
                if (successful) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    /**
     * Kết thúc cuộc gọi bằng cách sử dụng phương pháp thích hợp theo trạng thái cuộc gọi.
     *
     * @param call {Call} Call instance
     * @returns {Promise}
     */
     hangupCall(call) {
        return new Promise((resolve, reject) => {
            NativeModules.V9SipModule.hangupCall(call.getId(), (successful, data) => {
                if (successful) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    /**
     * Kết thúc cuộc gọi bằng cách sử dụng phương pháp Decline Code (603).
     *
     * @param call {Call} Call instance
     * @returns {Promise}
     */
     declineCall(call) {
        return new Promise((resolve, reject) => {
            NativeModules.V9SipModule.declineCall(call.getId(), (successful, data) => {
                if (successful) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    /**
     * Đặt cuộc gọi được chỉ định ở trạng thái chờ. Thao tác này sẽ gửi lại MỜI với SDP thích hợp để thông báo từ xa rằng cuộc gọi đang được tạm dừng.
     *
     * @param call {Call} Call instance
     * @returns {Promise}
     */
     holdCall(call) {
        return new Promise((resolve, reject) => {
            NativeModules.V9SipModule.holdCall(call.getId(), (successful, data) => {
                if (successful) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    /**
     * Giải phóng cuộc gọi được chỉ định khỏi bị giữ. Thao tác này sẽ gửi lại MỜI với SDP thích hợp để thông báo từ xa rằng cuộc gọi được tiếp tục.
     *
     * @param call {Call} Call instance
     * @returns {Promise}
     */
    unholdCall(call) {
        return new Promise((resolve, reject) => {
            NativeModules.V9SipModule.unholdCall(call.getId(), (successful, data) => {
                if (successful) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    /**
     * @param call {Call} Call instance
     * @returns {Promise}
     */
     muteCall(call) {
        return new Promise((resolve, reject) => {
            NativeModules.V9SipModule.muteCall(call.getId(), (successful, data) => {
                if (successful) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    /**
     * @param call {Call} Call instance
     * @returns {Promise}
     */
    unMuteCall(call) {
        return new Promise((resolve, reject) => {
            NativeModules.V9SipModule.unMuteCall(call.getId(), (successful, data) => {
                if (successful) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    /**
     * @param call {Call} Call instance
     * @returns {Promise}
     */
     useSpeaker(call) {
        return new Promise((resolve, reject) => {
            NativeModules.V9SipModule.useSpeaker(call.getId(), (successful, data) => {
                if (successful) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    /**
     * @param call {Call} Call instance
     * @returns {Promise}
     */
    useEarpiece(call) {
        return new Promise((resolve, reject) => {
            NativeModules.V9SipModule.useEarpiece(call.getId(), (successful, data) => {
                if (successful) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    /**
     * Bắt đầu chuyển cuộc gọi đến địa chỉ đã chỉ định.
     * Chức năng này sẽ gửi yêu cầu REFER để hướng dẫn bên gọi từ xa bắt đầu một phiên INVITE mới đến đích / đích được chỉ định.
     *
     * @param account {Account} Tài khoản được liên kết với cuộc gọi.
     * @param call {Call} Cuộc gọi được chuyển.
     * @param destination URI của mục tiêu mới sẽ được liên hệ. URI có thể ở dạng địa chỉ tên hoặc định dạng addr-spec.
     * @returns {Promise}
     */
     transferCall(account, call, destination) {
        destination = this._normalize(account, destination);

        return new Promise((resolve, reject) => {
            NativeModules.V9SipModule.xferCall(call.getId(), destination, (successful, data) => {
                if (successful) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    /**
     * Bắt đầu chuyển cuộc gọi đã tham dự.
     * Hàm này sẽ gửi yêu cầu REFER để hướng dẫn bên gọi từ xa bắt đầu phiên INVITE mới tới URL của đích.
     * Sau đó, bên tại destCall nên "replace" cuộc gọi với chúng tôi bằng cuộc gọi mới từ người nhận.
     *
     * @param call {Call} Cuộc gọi được chuyển.
     * @param destCall {Call} Cuộc gọi được chuyển.
     * @returns {Promise}
     */
     transferReplacesCall(call, destCall) {
        return new Promise((resolve, reject) => {
            NativeModules.V9SipModule.xferReplacesCall(call.getId(), destCall.getId(), (successful, data) => {
                if (successful) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    /**
     * Chuyển hướng (forward) cuộc gọi được chỉ định đến đích.
     * Chức năng này sẽ gửi phản hồi đến INVITE để hướng dẫn bên gọi từ xa chuyển hướng cuộc gọi đến đến đích / đích được chỉ định.
     *
     * @param account {Account} Tài khoản được liên kết với cuộc gọi.
     * @param call {Call} Cuộc gọi được chuyển.
     * @param destination URI của mục tiêu mới sẽ được liên hệ. URI có thể ở dạng địa chỉ tên hoặc định dạng addr-spec.
     * @returns {Promise}
     */
     redirectCall(account, call, destination) {
        destination = this._normalize(account, destination);

        return new Promise((resolve, reject) => {
            NativeModules.V9SipModule.redirectCall(call.getId(), destination, (successful, data) => {
                if (successful) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }


    /**
     * Gửi các chữ số DTMF tới điều khiển từ xa bằng định dạng tải trọng RFC 2833.
     *
     * @param call {Call} Phiên cuộc gọi
     * @param digits {String} Các chữ số chuỗi DTMF sẽ được gửi như được mô tả trên RFC 2833 section 3.10.
     * @returns {Promise}
     */
     dtmfCall(call, digits) {
        return new Promise((resolve, reject) => {
            NativeModules.V9SipModule.dtmfCall(call.getId(), digits, (successful, data) => {
                if (successful) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    activateAudioSession() {
        return new Promise((resolve, reject) => {
            NativeModules.V9SipModule.activateAudioSession((successful, data) => {
                if (successful) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    deactivateAudioSession() {
        return new Promise((resolve, reject) => {
            NativeModules.V9SipModule.deactivateAudioSession((successful, data) => {
                if (successful) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    changeOrientation(orientation) {
      const orientations = [
        'PJMEDIA_ORIENT_UNKNOWN',
        'PJMEDIA_ORIENT_ROTATE_90DEG',
        'PJMEDIA_ORIENT_ROTATE_270DEG',
        'PJMEDIA_ORIENT_ROTATE_180DEG',
        'PJMEDIA_ORIENT_NATURAL'
      ]

      if (orientations.indexOf(orientation) === -1) {
        throw new Error(`Invalid ${JSON.stringify(orientation)} device orientation, but expected ${orientations.join(", ")} values`)
      }

      NativeModules.V9SipModule.changeOrientation(orientation)
    }

    changeCodecSettings(codecSettings) {
        return new Promise(function(resolve, reject) {
        NativeModules.V9SipModule.changeCodecSettings(codecSettings, (successful, data) => {
                if (successful) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    /**
     * @fires Endpoint#connectivity_changed
     * @private
     * @param data {Object}
     */
    _onConnectivityChanged(data) {
        /**
         * Bắn khi trạng thái đăng ký đã thay đổi.
         *
         * @event Endpoint#connectivity_changed
         * @property {Account} account
         */
        this.emit("connectivity_changed", new Account(data));
    }

    /**
     * @fires Endpoint#registration_changed
     * @private
     * @param data {Object}
     */
    _onRegistrationChanged(data) {
        /**
         * Bắn khi trạng thái đăng ký đã thay đổi.
         *
         * @event Endpoint#registration_changed
         * @property {Account} account
         */
        this.emit("registration_changed", new Account(data));
    }

    /**
     * @fires Endpoint#call_received
     * @private
     * @param data {Object}
     */
    _onCallReceived(data) {
        /**
         * TODO
         *
         * @event Endpoint#call_received
         * @property {Call} call
         */
        this.emit("call_received", new Call(data));
    }

    /**
     * @fires Endpoint#call_changed
     * @private
     * @param data {Object}
     */
    _onCallChanged(data) {
        /**
         * TODO
         *
         * @event Endpoint#call_changed
         * @property {Call} call
         */
        this.emit("call_changed", new Call(data));
    }

    /**
     * @fires Endpoint#call_terminated
     * @private
     * @param data {Object}
     */
    _onCallTerminated(data) {
        /**
         * TODO
         *
         * @event Endpoint#call_terminated
         * @property {Call} call
         */
        this.emit("call_terminated", new Call(data));
    }

    /**
     * @fires Endpoint#call_screen_locked
     * @private
     * @param lock bool
     */
    _onCallScreenLocked(lock) {
        /**
         * TODO
         *
         * @event Endpoint#call_screen_locked
         * @property bool lock
         */
        this.emit("call_screen_locked", lock);
    }

    /**
     * @fires Endpoint#message_received
     * @private
     * @param data {Object}
     */
    _onMessageReceived(data) {
        /**
         * TODO
         *
         * @event Endpoint#message_received
         * @property {Message} message
         */
        this.emit("message_received", new Message(data));
    }

    /**
     * @fires Endpoint#connectivity_changed
     * @private
     * @param available bool
     */
    _onConnectivityChanged(available) {
        /**
         * @event Endpoint#connectivity_changed
         * @property bool available TRUE nếu kết nối khớp với cài đặt mạng hiện tại, nếu không thì FALSE.
         */
        this.emit("connectivity_changed", available);
    }

    /**
     * Chuẩn hóa URI Đích
     *
     * @param account
     * @param destination {string}
     * @returns {string}
     * @private
     */
    _normalize(account, destination) {
        if (!destination.startsWith("sip:")) {
            let realm = account.getDomain();
            destination = "sip:" + destination + "@" + realm;
        }
        return destination;
    }
}