/*
 * @Author: hoangdx (Hoang Do) 
 * @Date: 2022-10-29 15:10:01 
 * @Last Modified by: hoangdx (Hoang Do)
 * @Last Modified time: 2022-10-31 11:12:40
 */
package com.v9company.RNModuleV9Sip;

import com.v9company.ReactNativeV9Sip.*;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.*;

public class V9SipModule extends ReactContextBaseJavaModule {

    private static V9SipBroadcastReceiver receiver;

    public V9SipModule(ReactApplicationContext context) {
        super(context);

        // Module could be started several times, but we have to register receiver only once.
        if (receiver == null) {
            receiver = new V9SipBroadcastReceiver(context);
            this.getReactApplicationContext().registerReceiver(receiver, receiver.getFilter());
        } else {
            receiver.setContext(context);
        }
    }

    @Override
    public String getName() {
        return "V9SipModule";
    }

    @ReactMethod
    public void start(ReadableMap configuration, Callback callback) {
        int id = receiver.register(callback);
        Intent intent = V9Actions.createStartIntent(id, configuration, getReactApplicationContext());

        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void stop(Callback callback) {
        int id = receiver.register(callback);
        Intent intent = V9Actions.createStopIntent(id, getReactApplicationContext());

        getReactApplicationContext().stopService(intent);
    }

    @ReactMethod
    public void changeServiceConfiguration(ReadableMap configuration, Callback callback) {
        int id = receiver.register(callback);
        Intent intent = V9Actions.createSetServiceConfigurationIntent(id, configuration, getReactApplicationContext());
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void createAccount(ReadableMap configuration, Callback callback) {
        int id = receiver.register(callback);
        Intent intent = V9Actions.createAccountCreateIntent(id, configuration, getReactApplicationContext());
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void registerAccount(int accountId, boolean renew, Callback callback) {
        int id = receiver.register(callback);
        Intent intent = V9Actions.createAccountRegisterIntent(id, accountId, renew, getReactApplicationContext());
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void deleteAccount(int accountId, Callback callback) {
        int callbackId = receiver.register(callback);
        Intent intent = V9Actions.createAccountDeleteIntent(callbackId, accountId, getReactApplicationContext());
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void makeCall(int accountId, String destination, ReadableMap callSettings, ReadableMap msgData,  Callback callback) {
        int callbackId = receiver.register(callback);
        Intent intent = V9Actions.createMakeCallIntent(callbackId, accountId, destination, callSettings, msgData, getReactApplicationContext());
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void hangupCall(int callId, Callback callback) {
        int callbackId = receiver.register(callback);
        Intent intent = V9Actions.createHangupCallIntent(callbackId, callId, getReactApplicationContext());
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void declineCall(int callId, Callback callback) {
        int callbackId = receiver.register(callback);
        Intent intent = V9Actions.createDeclineCallIntent(callbackId, callId, getReactApplicationContext());
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void answerCall(int callId, Callback callback) {
        int callbackId = receiver.register(callback);
        Intent intent = V9Actions.createAnswerCallIntent(callbackId, callId, getReactApplicationContext());
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void holdCall(int callId, Callback callback) {
        int callbackId = receiver.register(callback);
        Intent intent = V9Actions.createHoldCallIntent(callbackId, callId, getReactApplicationContext());
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void unholdCall(int callId, Callback callback) {
        int callbackId = receiver.register(callback);
        Intent intent = V9Actions.createUnholdCallIntent(callbackId, callId, getReactApplicationContext());
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void muteCall(int callId, Callback callback) {
        int callbackId = receiver.register(callback);
        Intent intent = V9Actions.createMuteCallIntent(callbackId, callId, getReactApplicationContext());
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void unMuteCall(int callId, Callback callback) {
        int callbackId = receiver.register(callback);
        Intent intent = V9Actions.createUnMuteCallIntent(callbackId, callId, getReactApplicationContext());
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void useSpeaker(int callId, Callback callback) {
        int callbackId = receiver.register(callback);
        Intent intent = V9Actions.createUseSpeakerCallIntent(callbackId, callId, getReactApplicationContext());
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void useEarpiece(int callId, Callback callback) {
        int callbackId = receiver.register(callback);
        Intent intent = V9Actions.createUseEarpieceCallIntent(callbackId, callId, getReactApplicationContext());
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void xferCall(int callId, String destination, Callback callback) {
        int callbackId = receiver.register(callback);
        Intent intent = V9Actions.createXFerCallIntent(callbackId, callId, destination, getReactApplicationContext());
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void xferReplacesCall(int callId, int destCallId, Callback callback) {
        int callbackId = receiver.register(callback);
        Intent intent = V9Actions.createXFerReplacesCallIntent(callbackId, callId, destCallId, getReactApplicationContext());
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void redirectCall(int callId, String destination, Callback callback) {
        int callbackId = receiver.register(callback);
        Intent intent = V9Actions.createRedirectCallIntent(callbackId, callId, destination, getReactApplicationContext());
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void dtmfCall(int callId, String digits, Callback callback) {
        int callbackId = receiver.register(callback);
        Intent intent = V9Actions.createDtmfCallIntent(callbackId, callId, digits, getReactApplicationContext());
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void changeCodecSettings(ReadableMap codecSettings, Callback callback) {
        int callbackId = receiver.register(callback);
        Intent intent = V9Actions.createChangeCodecSettingsIntent(callbackId, codecSettings, getReactApplicationContext());
        getReactApplicationContext().startService(intent);
    }
}
