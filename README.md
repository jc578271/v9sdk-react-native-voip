# V9 VOIP SDK -- @v9sdk/react-native-voip

## Support
- Currently support for iOS and Android.  
- Support video and audio communication.
- Ability to use Callkit and PushNotifications.
- You can use it to build an iOS/Android app that can communicate with SIP server.


## Installation

`npm i @v9sdk/react-native-voip`

## Configuation Android/iOS

[Android]
------------------------------

Add permissions & service to `android/app/src/main/AndroidManifest.xml`

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

```xml
<application>
    ...
    <service
        android:name="com.v9company.ReactNativeV9Sip.V9SipService"
        android:enabled="true"
        android:exported="true" />
    ...
</application>
```

If your Android targetSdk is 23 or above you should grant `android.permission.RECORD_AUDIO` at runtime before making/receiving an audio call.


[iOS]
------------------------------

Set permission in info.plist file

```xml
<dict>
  ...
  <key>NSMicrophoneUsageDescription</key>
  <string>${PRODUCT_NAME} always microphone for voice call</string>
  <key>NSCameraUsageDescription</key>
  <string>${PRODUCT_NAME} always camera for video call</string>
</dict>
```

In targets product with Xcode select tab Build Phases `Xcode > Open Project > Target > Build Phases `

Link Binary With Libraries - Add Framework : 

- AudioToolbox.framework
- CoreAudio.framework
- libc++.tbd
- libc.tbd
- Accelerate.framework
- Accessibility.framework


## Usage

First of all you have to initialize module to be able to work with it.

```javascript
import { V9Voip } from '@v9sdk/react-native-voip';

let voip = new V9Voip();
let state = await voip.start();
let {accounts, calls, settings, connectivity} = state;

// Subscribe to voip events
voip.on("registration_changed", (account) => {});
voip.on("connectivity_changed", (online) => {});
voip.on("call_received", (call) => {});
voip.on("call_changed", (call) => {});
voip.on("call_terminated", (call) => {});
voip.on("call_screen_locked", (call) => {}); // Android only
```

Account creating is pretty strainghforward.

```javascript
let configuration = {
  "name": "V9 Team",
  "username": "sip_username",
  "domain": "pbx.v9.com.vn",
  "password": "****"
};

voip.addAccount(configuration).then((account) => {
  console.log("Account created", account);
});

```

To be able to make a call first of all you should addAccount, and pass account instance into voip.makeCall function.
```javascript
let options = {
  headers: {
    "P-Assserted-Identity": "Header example",
    "X-UA": "V9 SDK React Native Voip"
  }
}
let destination = '0123456798'; // phone number , example 'sip:0123456798@{configuration.domain}' or 0123456798

let call = await voip.makeCall(account, destination, options);
call.getId() // Use this id to detect changes and make actions

voip.addListener("call_changed", (newCall) => {
  if (call.getId() === newCall.getId()) {
     // Our call changed, do smth.
  }
}
voip.addListener("call_terminated", (newCall) => {
  if (call.getId() === newCall.getId()) {
     // Our call terminated
  }
}
```
## METHOD SUPPORTED

| Command | Description |
| --- | --- |
| addAccount(account) | information configuation account |
| registerAccount(account, renew) | information configuation account, bool renew Nếu đối số renew bằng false => hủy đăng ký. |
| deleteAccount(account ) | remove account register |
| makeCall(account, destination, options) | {account} , destination {String} Số điện thoại được chỉ định gọi., {options} Cài đặt cuộc gọi đi. |
| answerCall(call) | {Call} Call instance |
| hangupCall(call) | {Call} Call instance |
| declineCall(call) | {Call} Call instance |
| holdCall(call) / unholdCall(call) | {Call} Call instance |
| muteCall(call) / unMuteCall(call) | {Call} Call instance |
| transferCall(account, call, destination) | {Account} Tài khoản được liên kết với cuộc gọi. {Call} Cuộc gọi được chuyển. destination URI của mục tiêu mới sẽ được liên hệ. |


## API

Comming soon!!!