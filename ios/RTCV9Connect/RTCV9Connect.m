//
//  RTCV9Connect.m
//  RTCV9Connect
//
//  Created by Hoang Do Xuan on 02/11/2022.
//

#import "V9SipEndpoint.h"
#import "RTCV9Connect.h"

#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTUtils.h>

@interface RTCV9Connect ()

@end

@implementation RTCV9Connect

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(V9SipModule);

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

- (instancetype)init {
    self = [super init];
    return self;
}


+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

RCT_EXPORT_METHOD(start: (NSDictionary *) config callback: (RCTResponseSenderBlock) callback) {
    [V9SipEndpoint instance].bridge = self.bridge;

    NSDictionary *result = [[V9SipEndpoint instance] start];
    callback(@[@TRUE, result]);
}

#pragma mark - Account Actions

RCT_EXPORT_METHOD(createAccount: (NSDictionary *) config callback:(RCTResponseSenderBlock) callback) {
    V9SipAccount *account = [[V9SipEndpoint instance] createAccount:config];
    callback(@[@TRUE, [account toJsonDictionary]]);
}

RCT_EXPORT_METHOD(deleteAccount: (int) accountId callback:(RCTResponseSenderBlock) callback) {
    [[V9SipEndpoint instance] deleteAccount:accountId];
    callback(@[@TRUE]);
}

RCT_EXPORT_METHOD(registerAccount: (int) accountId renew:(BOOL) renew callback:(RCTResponseSenderBlock) callback) {
    @try {
        V9SipEndpoint* endpoint = [V9SipEndpoint instance];
        V9SipAccount *account = [endpoint findAccount:accountId];
        
        [account register:renew];
        
        callback(@[@TRUE]);
    }
    @catch (NSException * e) {
        callback(@[@FALSE, e.reason]);
    }
}

#pragma mark - Call Actions

RCT_EXPORT_METHOD(makeCall: (int) accountId destination: (NSString *) destination callSettings:(NSDictionary*) callSettings msgData:(NSDictionary*) msgData callback:(RCTResponseSenderBlock) callback) {
    @try {
        V9SipEndpoint* endpoint = [V9SipEndpoint instance];
        V9SipAccount *account = [endpoint findAccount:accountId];
        V9SipCall *call = [endpoint makeCall:account destination:destination callSettings:callSettings msgData:msgData];
        
        // TODO: Remove this function
        // Automatically put other calls on hold.
        [endpoint pauseParallelCalls:call];
        
        callback(@[@TRUE, [call toJsonDictionary:endpoint.isSpeaker]]);
    }
    @catch (NSException * e) {
        callback(@[@FALSE, e.reason]);
    }
}

RCT_EXPORT_METHOD(hangupCall: (int) callId callback:(RCTResponseSenderBlock) callback) {
    V9SipCall *call = [[V9SipEndpoint instance] findCall:callId];
    
    if (call) {
        [call hangup];
        callback(@[@TRUE]);
    } else {
        callback(@[@FALSE, @"Call not found"]);
    }
}

RCT_EXPORT_METHOD(declineCall: (int) callId callback:(RCTResponseSenderBlock) callback) {
    V9SipCall *call = [[V9SipEndpoint instance] findCall:callId];
    
    if (call) {
        [call decline];
        callback(@[@TRUE]);
    } else {
        callback(@[@FALSE, @"Call not found"]);
    }
}

RCT_EXPORT_METHOD(answerCall: (int) callId callback:(RCTResponseSenderBlock) callback) {
    V9SipEndpoint* endpoint = [V9SipEndpoint instance];
    V9SipCall *call = [endpoint findCall:callId];
    
    if (call) {
        [call answer];
        
        // Automatically put other calls on hold.
        [endpoint pauseParallelCalls:call];
        
        callback(@[@TRUE]);
    } else {
        callback(@[@FALSE, @"Call not found"]);
    }
}

RCT_EXPORT_METHOD(holdCall: (int) callId callback:(RCTResponseSenderBlock) callback) {
    V9SipEndpoint* endpoint = [V9SipEndpoint instance];
    V9SipCall *call = [endpoint findCall:callId];
    
    if (call) {
        [call hold];
        [endpoint emmitCallChanged:call];
        
        callback(@[@TRUE]);
    } else {
        callback(@[@FALSE, @"Call not found"]);
    }
}

RCT_EXPORT_METHOD(unholdCall: (int) callId callback:(RCTResponseSenderBlock) callback) {
    V9SipEndpoint* endpoint = [V9SipEndpoint instance];
    V9SipCall *call = [endpoint findCall:callId];
    
    if (call) {
        [call unhold];
        [endpoint emmitCallChanged:call];
        
        // Automatically put other calls on hold.
        [endpoint pauseParallelCalls:call];
        
        callback(@[@TRUE]);
    } else {
        callback(@[@FALSE, @"Call not found"]);
    }
}

RCT_EXPORT_METHOD(muteCall: (int) callId callback:(RCTResponseSenderBlock) callback) {
    V9SipEndpoint* endpoint = [V9SipEndpoint instance];
    V9SipCall *call = [endpoint findCall:callId];
    
    if (call) {
        [call mute];
        [endpoint emmitCallChanged:call];
        callback(@[@TRUE]);
    } else {
        callback(@[@FALSE, @"Call not found"]);
    }
}

RCT_EXPORT_METHOD(unMuteCall: (int) callId callback:(RCTResponseSenderBlock) callback) {
    V9SipEndpoint* endpoint = [V9SipEndpoint instance];
    V9SipCall *call = [endpoint findCall:callId];
    
    if (call) {
        [call unmute];
        [endpoint emmitCallChanged:call];
        callback(@[@TRUE]);
    } else {
        callback(@[@FALSE, @"Call not found"]);
    }
}

RCT_EXPORT_METHOD(xferCall: (int) callId destination: (NSString *) destination callback:(RCTResponseSenderBlock) callback) {
    V9SipCall *call = [[V9SipEndpoint instance] findCall:callId];
    
    if (call) {
        [call xfer:destination];
        callback(@[@TRUE]);
    } else {
        callback(@[@FALSE, @"Call not found"]);
    }
}

RCT_EXPORT_METHOD(xferReplacesCall: (int) callId destinationCallId: (int) destinationCallId callback:(RCTResponseSenderBlock) callback) {
    V9SipCall *call = [[V9SipEndpoint instance] findCall:callId];
    
    if (call) {
        [call xferReplaces:destinationCallId];
        callback(@[@TRUE]);
    } else {
        callback(@[@FALSE, @"Call not found"]);
    }
}

RCT_EXPORT_METHOD(redirectCall: (int) callId destination: (NSString *) destination callback:(RCTResponseSenderBlock) callback) {
    V9SipCall *call = [[V9SipEndpoint instance] findCall:callId];
    
    if (call) {
        [call redirect:destination];
        callback(@[@TRUE]);
    } else {
        callback(@[@FALSE, @"Call not found"]);
    }
}

RCT_EXPORT_METHOD(dtmfCall: (int) callId digits: (NSString *) digits callback:(RCTResponseSenderBlock) callback) {
    V9SipCall *call = [[V9SipEndpoint instance] findCall:callId];
    
    if (call) {
        [call dtmf:digits];
        callback(@[@TRUE]);
    } else {
        callback(@[@FALSE, @"Call not found"]);
    }
}

RCT_EXPORT_METHOD(useSpeaker: (int) callId callback:(RCTResponseSenderBlock) callback) {
    [[V9SipEndpoint instance] useSpeaker];
}

RCT_EXPORT_METHOD(useEarpiece: (int) callId callback:(RCTResponseSenderBlock) callback) {
    [[V9SipEndpoint instance] useEarpiece];
}

RCT_EXPORT_METHOD(activateAudioSession: (RCTResponseSenderBlock) callback) {
    pjsua_set_no_snd_dev();
    pj_status_t status;
    status = pjsua_set_snd_dev(PJMEDIA_AUD_DEFAULT_CAPTURE_DEV, PJMEDIA_AUD_DEFAULT_PLAYBACK_DEV);
    if (status != PJ_SUCCESS) {
        NSLog(@"Failed to active audio session");
    }
}

RCT_EXPORT_METHOD(deactivateAudioSession: (RCTResponseSenderBlock) callback) {
    pjsua_set_no_snd_dev();
}

#pragma mark - Settings

RCT_EXPORT_METHOD(changeOrientation: (NSString*) orientation) {
    [[V9SipEndpoint instance] changeOrientation:orientation];
}

RCT_EXPORT_METHOD(changeCodecSettings: (NSDictionary*) codecSettings callback:(RCTResponseSenderBlock) callback) {
    [[V9SipEndpoint instance] changeCodecSettings:codecSettings];
    callback(@[@TRUE]);
}


@end
