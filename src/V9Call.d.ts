/*
 * @Author: hoangdx (Hoang Do) 
 * @Date: 2022-10-29 11:09:39 
 * @Last Modified by: hoangdx (Hoang Do)
 * @Last Modified time: 2022-10-29 16:46:21
 */

/**
 * Lớp này mô tả thông tin và trạng thái hiện tại của một cuộc gọi.
 */
 export default class V9Call {

    _id: any;
    _callId: any;
    _accountId: any;
    _localContact: any;
    _localUri: any;
    _remoteContact: any;
    _remoteUri: any;
    _state: any;
    _stateText: any;
    _held: any;
    _muted: any;
    _speaker: any;
    _connectDuration: any;
    _totalDuration: any;
    _remoteOfferer: any;
    _remoteAudioCount: any;
    _remoteVideoCount: any;
    _remoteNumber: any;
    _remoteName: any;
    _audioCount: any;
    _videoCount: any;
    _lastStatusCode: any;
    _lastReason: any;

    _media: any;
    _provisionalMedia: any;

    _constructionTime = Math.round(new Date().getTime() / 1000);
    
    constructor({
            id, callId, accountId,
            localContact, localUri, remoteContact, remoteUri,
            state, stateText, held, muted, speaker,
            connectDuration, totalDuration,
            remoteOfferer, remoteAudioCount, remoteVideoCount, audioCount, videoCount,
            lastStatusCode, lastReason, media, provisionalMedia
        }) {
        let remoteNumber = null;
        let remoteName = null;

        if (remoteUri) {
            let match = remoteUri.match(/"([^"]+)" <sip:([^@]+)@/);

            if (match) {
                remoteName = match[1];
                remoteNumber = match[2];
            } else {
                match = remoteUri.match(/sip:([^@]+)@/);

                if (match) {
                    remoteNumber = match[1];
                }
            }
        }

        this._id = id;
        this._callId = callId;
        this._accountId = accountId;
        this._localContact = localContact;
        this._localUri = localUri;
        this._remoteContact = remoteContact;
        this._remoteUri = remoteUri;
        this._state = state;
        this._stateText = stateText;
        this._held = held;
        this._muted = muted;
        this._speaker = speaker;
        this._connectDuration = connectDuration;
        this._totalDuration = totalDuration;
        this._remoteOfferer = remoteOfferer;
        this._remoteAudioCount = remoteAudioCount;
        this._remoteVideoCount = remoteVideoCount;
        this._remoteNumber = remoteNumber;
        this._remoteName = remoteName;
        this._audioCount = audioCount;
        this._videoCount = videoCount;
        this._lastStatusCode = lastStatusCode;
        this._lastReason = lastReason;

        this._media = media;
        this._provisionalMedia = provisionalMedia;

        this._constructionTime = Math.round(new Date().getTime() / 1000);
    }

    /**
     * Mã cuộc gọi.
     * @returns {int}
     */
    getId() {
        return this._id;
    }

    /**
     * ID tài khoản cuộc gọi.
     * @returns {int}
     */
    getAccountId() {
        return this._accountId;
    }

    /**
     * Chuỗi ID cuộc gọi.
     *
     * @returns {String}
     */
    getCallId() {
        return this._callId;
    }


    /**
     * Thời lượng cuộc gọi cập nhật tính bằng giây.
     * Sử dụng local time để tính thời lượng cuộc gọi thực tế.
     *
     * @public
     * @returns {int}
     */
    getTotalDuration() {
        let time = Math.round(new Date().getTime() / 1000);
        let offset = time - this._constructionTime;

        return this._totalDuration + offset;
    };

    /**
     * Thời lượng kết nối cuộc gọi cập nhật (bằng 0 khi cuộc gọi không được thiết lập)
     *
     * @returns {int}
     */
    getConnectDuration() {
        if (this._connectDuration < 0 || this._state == "PJSIP_INV_STATE_DISCONNECTED") {
            return this._connectDuration;
        }

        let time = Math.round(new Date().getTime() / 1000);
        let offset = time - this._constructionTime;

        return this._connectDuration + offset;
    }

    /**
     * Thời lượng cuộc gọi ở định dạng "MM:SS".
     *
     * @public
     * @returns {string}
     */
    getFormattedTotalDuration() {
        return this._formatTime(this.getDuration());
    };

    /**
     * Thời lượng cuộc gọi ở định dạng "MM:SS".
     *
     * @public
     * @returns {string}
     */
    getFormattedConnectDuration() {
        return this._formatTime(this.getConnectDuration());
    };

    /**
     * Local Contact.
     * @returns {String}
     */
    getLocalContact() {
        return this._localContact;
    }

    /**
     * Local URI.
     * @returns {String}
     */
    getLocalUri() {
        return this._localUri;
    }

    /**
     * Remote contact.
     * @returns {String}
     */
    getRemoteContact() {
        return this._remoteContact;
    }

    /**
     * Remote URI.
     * @returns {String}
     */
    getRemoteUri() {
        return this._remoteUri;
    }

    /**
     * Callee name. Có thể là rỗng nếu không có tên nào được chỉ định trong URI.
     * @returns {String}
     */
    getRemoteName() {
        return this._remoteName;
    }

    /**
     * Callee number
     * @returns {String}
     */
    getRemoteNumber() {
        return this._remoteNumber;
    }

    /**
     * @returns {String}
     */
    getRemoteFormattedNumber() {
        if (this._remoteName && this._remoteNumber) {
            return `${this._remoteName} <${this._remoteNumber}>`;
        } else if (this._remoteNumber) {
            return this._remoteNumber;
        } else {
            return this._remoteUri
        }
    }

    /**
     * Trạng thái phiên mời.
     *
     * @returns {String}
     */
    getState() {
        return this._state;
    }

    /**
     * Miêu tả trạng thái.
     *
     * @returns {String}
     */
    getStateText() {
        return this._stateText;
    }

    isHeld() {
        return this._held;
    }

    isMuted() {
        return this._muted;
    }

    isSpeaker() {
        return this._speaker;
    }

    isTerminated() {
        return this._state === 'PJSIP_INV_STATE_DISCONNECTED';
    }

    /**
     * Gắn cờ nếu điều khiển từ xa là người cung cấp SDP
     * @returns {boolean}
     */
    getRemoteOfferer() {
        return this._remoteOfferer;
    }

    /**
     * Số luồng âm thanh do điều khiển từ xa cung cấp.
     * @returns {int}
     */
    getRemoteAudioCount() {
        return this._remoteAudioCount;
    }

    /**
     * Số luồng video được cung cấp bởi điều khiển từ xa.
     * @returns {int}
     */
    getRemoteVideoCount() {
        return this._remoteVideoCount;
    }

    /**
     * Số luồng âm thanh hoạt động đồng thời cho cuộc gọi này. Nếu không - âm thanh bị tắt trong cuộc gọi này.
     * @returns {int}
     */
    getAudioCount() {
        return this._audioCount;
    }

    /**
     * Số luồng video hoạt động đồng thời cho cuộc gọi này. Nếu không - video bị tắt trong cuộc gọi này.
     * @returns {*}
     */
    getVideoCount() {
        return this._videoCount;
    }

    /**
     * Mã trạng thái cuối cùng được nghe, có thể được sử dụng làm mã nguyên nhân.
     * Possible values:
     * - TRYING / 100
     * - RINGING / 180
     * - CALL_BEING_FORWARDED / 181
     * - QUEUED / 182
     * - PROGRESS / 183
     * - OK / 200
     * - ACCEPTED / 202
     * - BAD_REQUEST / 400
     * - UNAUTHORIZED / 401
     * - FORBIDDEN / 403
     * - NOT_FOUND / 404
     * - METHOD_NOT_ALLOWED / 405
     * - NOT_ACCEPTABLE / 406
     * - REQUEST_TIMEOUT / 408
     * - UNSUPPORTED_MEDIA_TYPE / 415
     * - BUSY_HERE / 486
     * - REQUEST_TERMINATED / 487
     * - NOT_ACCEPTABLE_HERE / 488
     * - NOT_IMPLEMENTED / 501
     * - BAD_GATEWAY / 502
     * - SERVICE_UNAVAILABLE / 503
     * - SERVER_TIMEOUT / 504
     * - VERSION_NOT_SUPPORTED / 505
     * - BUSY_EVERYWHERE / 600
     * - DECLINE / 603
     * 
     * @returns {string}
     */
    getLastStatusCode() {
        return this._lastStatusCode;
    }

    /**
     * Cụm từ lý do mô tả trạng thái cuối cùng.
     *
     * @returns {string}
     */
    getLastReason() {
        return this._lastReason;
    }

    getMedia() {
        return this._media;
    }

    getProvisionalMedia() {
        return this._provisionalMedia;
    }

    /**
     * Định dạng giây thành định dạng "MM:SS".
     *
     * @public
     * @returns {string}
     */
    _formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) {
            return "00:00";
        }
        var hours = parseInt( seconds / 3600 ) % 24;
        var minutes = parseInt( seconds / 60 ) % 60;
        var result = "";
        seconds = seconds % 60;

        if (hours > 0) {
            result += (hours < 10 ? "0" + hours : hours) + ":";
        }

        result += (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
        return result;
    };
}