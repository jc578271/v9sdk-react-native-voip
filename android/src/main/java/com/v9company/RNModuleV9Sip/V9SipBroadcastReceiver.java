/*
 * @Author: hoangdx (Hoang Do) 
 * @Date: 2022-10-29 15:15:55 
 * @Last Modified by: hoangdx (Hoang Do)
 * @Last Modified time: 2022-10-31 11:44:19
 */
package com.v9company.RNModuleV9Sip;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;
import com.v9company.RNModuleV9Sip.utils.ArgumentUtils;
import com.v9company.ReactNativeV9Sip.*;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;

import javax.annotation.Nullable;

public class V9SipBroadcastReceiver extends BroadcastReceiver {

    private static String TAG = "V9SipBroadcastReceiver";

    private int seq = 0;

    private ReactApplicationContext context;

    private HashMap<Integer, Callback> callbacks = new HashMap<>();

    public V9SipBroadcastReceiver(ReactApplicationContext context) {
        this.context = context;
    }

    public void setContext(ReactApplicationContext context) {
        this.context = context;
    }

    public int register(Callback callback) {
        int id = ++seq;
        callbacks.put(id, callback);
        return id;
    }

    public IntentFilter getFilter() {
        IntentFilter filter = new IntentFilter();
        filter.addAction(V9Actions.EVENT_STARTED);
        filter.addAction(V9Actions.EVENT_ACCOUNT_CREATED);
        filter.addAction(V9Actions.EVENT_REGISTRATION_CHANGED);
        filter.addAction(V9Actions.EVENT_CALL_RECEIVED);
        filter.addAction(V9Actions.EVENT_CALL_CHANGED);
        filter.addAction(V9Actions.EVENT_CALL_TERMINATED);
        filter.addAction(V9Actions.EVENT_CALL_SCREEN_LOCKED);
        filter.addAction(V9Actions.EVENT_MESSAGE_RECEIVED);
        filter.addAction(V9Actions.EVENT_HANDLED);

        return filter;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();

        Log.d(TAG, "Received \""+ action +"\" response from service (" + ArgumentUtils.dumpIntentExtraParameters(intent) + ")");

        switch (action) {
            case V9Actions.EVENT_STARTED:
                onCallback(intent);
                break;
            case V9Actions.EVENT_ACCOUNT_CREATED:
                onCallback(intent);
                break;
            case V9Actions.EVENT_REGISTRATION_CHANGED:
                onRegistrationChanged(intent);
                break;
            case V9Actions.EVENT_MESSAGE_RECEIVED:
                onMessageReceived(intent);
                break;
            case V9Actions.EVENT_CALL_RECEIVED:
                onCallReceived(intent);
                break;
            case V9Actions.EVENT_CALL_CHANGED:
                onCallChanged(intent);
                break;
            case V9Actions.EVENT_CALL_TERMINATED:
                onCallTerminated(intent);
                break;
            default:
                onCallback(intent);
                break;
        }
    }

    private void onRegistrationChanged(Intent intent) {
        String json = intent.getStringExtra("data");
        Object params = ArgumentUtils.fromJson(json);
        emit("RegistrationChanged", params);
    }

    private void onMessageReceived(Intent intent) {
        String json = intent.getStringExtra("data");
        Object params = ArgumentUtils.fromJson(json);

        emit("MessageReceived", params);
    }

    private void onCallReceived(Intent intent) {
        String json = intent.getStringExtra("data");
        Object params = ArgumentUtils.fromJson(json);
        emit("CallReceived", params);
    }

    private void onCallChanged(Intent intent) {
        String json = intent.getStringExtra("data");
        Object params = ArgumentUtils.fromJson(json);
        emit("CallChanged", params);
    }

    private void onCallTerminated(Intent intent) {
        String json = intent.getStringExtra("data");
        Object params = ArgumentUtils.fromJson(json);
        emit("CallTerminated", params);
    }

    private void onCallback(Intent intent) {
        // Define callback
        Callback callback = null;

        if (intent.hasExtra("callback_id")) {
            int id = intent.getIntExtra("callback_id", -1);
            if (callbacks.containsKey(id)) {
                callback = callbacks.remove(id);
            } else {
                Log.w(TAG, "Callback with \""+ id +"\" identifier not found (\""+ intent.getAction() +"\")");
            }
        }

        if (callback == null) {
            return;
        }

        // -----
        if (intent.hasExtra("exception")) {
            Log.w(TAG, "Callback executed with exception state: " + intent.getStringExtra("exception"));
            callback.invoke(false, intent.getStringExtra("exception"));
        } else if (intent.hasExtra("data")) {
            Object params = ArgumentUtils.fromJson(intent.getStringExtra("data"));
            callback.invoke(true, params);
        } else {
            callback.invoke(true, true);
        }
    }

    private void emit(String eventName, @Nullable Object data) {
        Log.d(TAG, "emit " + eventName + " / " + data);

        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, data);
    }
}
