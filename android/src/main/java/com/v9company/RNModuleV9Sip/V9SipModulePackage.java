/*
 * @Author: hoangdx (Hoang Do) 
 * @Date: 2022-10-29 15:09:51 
 * @Last Modified by: hoangdx (Hoang Do)
 * @Last Modified time: 2022-10-31 11:12:48
 */
package com.v9company.RNModuleV9Sip;

import com.v9company.ReactNativeV9Sip.*;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class V9SipModulePackage implements ReactPackage {

    public V9SipModulePackage() {

    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new V9SipModule(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
            new V9SipRemoteVideoViewManager(),
            new V9SipPreviewVideoViewManager()
        );
    }
}
