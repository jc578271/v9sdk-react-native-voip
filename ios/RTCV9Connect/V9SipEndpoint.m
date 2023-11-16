//
//  V9SipEndpoint.m
//  RTCV9Connect
//
//  Created by Hoang Do Xuan on 02/11/2022.
//

#import <Foundation/Foundation.h>
@import AVFoundation;

#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTUtils.h>
#import <V9SIPServer/pjsua.h>

#import "V9SipUtil.h"
#import "V9SipEndpoint.h"
#import "V9SipMessage.h"

@implementation V9SipEndpoint

+ (instancetype) instance {
    static V9SipEndpoint *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[V9SipEndpoint alloc] init];
    });

    return sharedInstance;
}

- (instancetype) init {
    self = [super init];
    self.accounts = [[NSMutableDictionary alloc] initWithCapacity:12];
    self.calls = [[NSMutableDictionary alloc] initWithCapacity:12];

    pj_status_t status;

    // Create pjsua first
    status = pjsua_create();
    if (status != PJ_SUCCESS) {
        NSLog(@"Error in pjsua_create()");
    }
    
    // Init pjsua
    {
        // Init the config structure
        pjsua_config cfg;
        pjsua_config_default(&cfg);

        // cfg.cb.on_reg_state = [self performSelector:@selector(onRegState:) withObject: o];
        cfg.cb.on_reg_state = &onRegStateChanged;
        cfg.cb.on_incoming_call = &onCallReceived;
        cfg.cb.on_call_state = &onCallStateChanged;
        cfg.cb.on_call_media_state = &onCallMediaStateChanged;
        cfg.cb.on_call_media_event = &onCallMediaEvent;
        
        cfg.cb.on_pager2 = &onMessageReceived;
        
        // Init the logging config structure
        pjsua_logging_config log_cfg;
        pjsua_logging_config_default(&log_cfg);
        log_cfg.console_level = 10;

        // Init media config
        pjsua_media_config mediaConfig;
        pjsua_media_config_default(&mediaConfig);
        mediaConfig.clock_rate = PJSUA_DEFAULT_CLOCK_RATE;
        mediaConfig.snd_clock_rate = 0;
        
        // Init the pjsua
        status = pjsua_init(&cfg, &log_cfg, &mediaConfig);
        if (status != PJ_SUCCESS) {
            NSLog(@"Error in pjsua_init()");
        }
    }

    // Add UDP transport.
    {
        // Init transport config structure
        pjsua_transport_config cfg;
        pjsua_transport_config_default(&cfg);
        pjsua_transport_id id;

        // Add TCP transport.
        status = pjsua_transport_create(PJSIP_TRANSPORT_UDP, &cfg, &id);
        
        if (status != PJ_SUCCESS) {
            NSLog(@"Error creating UDP transport");
        } else {
            self.udpTransportId = id;
        }
    }
    
    // Add TCP transport.
    {
        pjsua_transport_config cfg;
        pjsua_transport_config_default(&cfg);
        pjsua_transport_id id;
        
        status = pjsua_transport_create(PJSIP_TRANSPORT_TCP, &cfg, &id);
        
        if (status != PJ_SUCCESS) {
            NSLog(@"Error creating TCP transport");
        } else {
            self.tcpTransportId = id;
        }
    }
    
    // Add TLS transport.
    {
        pjsua_transport_config cfg;
        pjsua_transport_config_default(&cfg);
        pjsua_transport_id id;
        
        status = pjsua_transport_create(PJSIP_TRANSPORT_TLS, &cfg, &id);
        
        if (status != PJ_SUCCESS) {
            NSLog(@"Error creating TLS transport");
        } else {
            self.tlsTransportId = id;
        }
    }

    // Initialization is done, now start pjsua
    status = pjsua_start();
    if (status != PJ_SUCCESS) NSLog(@"Error starting pjsua");

    return self;
}

- (NSDictionary *) start {
    NSMutableArray *accountsResult = [[NSMutableArray alloc] initWithCapacity:[@([self.accounts count]) unsignedIntegerValue]];
    NSMutableArray *callsResult = [[NSMutableArray alloc] initWithCapacity:[@([self.calls count]) unsignedIntegerValue]];

    for (NSString *key in self.accounts) {
        V9SipAccount *acc = self.accounts[key];
        [accountsResult addObject:[acc toJsonDictionary]];
    }
    
    for (NSString *key in self.calls) {
        V9SipCall *call = self.calls[key];
        [callsResult addObject:[call toJsonDictionary:self.isSpeaker]];
    }
    
    return @{@"accounts": accountsResult, @"calls": callsResult, @"connectivity": @YES};
}

- (V9SipAccount *)createAccount:(NSDictionary *)config {
    V9SipAccount *account = [V9SipAccount itemConfig:config];
    self.accounts[@(account.id)] = account;

    return account;
}

- (void)deleteAccount:(int) accountId {
    // TODO: Destroy function ?
    if (self.accounts[@(accountId)] == nil) {
        [NSException raise:@"Failed to delete account" format:@"Account with %@ id not found", @(accountId)];
    }

    [self.accounts removeObjectForKey:@(accountId)];
}

- (V9SipAccount *) findAccount: (int) accountId {
    return self.accounts[@(accountId)];
}


#pragma mark Calls

-(V9SipCall *) makeCall:(V9SipAccount *) account destination:(NSString *)destination callSettings: (NSDictionary *)callSettingsDict msgData: (NSDictionary *)msgDataDict {
    pjsua_call_setting callSettings;
    [V9SipUtil fillCallSettings:&callSettings dict:callSettingsDict];

    pjsua_msg_data msgData;
    [V9SipUtil fillMsgData:&msgData dict:msgDataDict];
    
    pjsua_call_id callId;
    pj_str_t callDest = pj_str((char *) [destination UTF8String]);

    [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayAndRecord error:nil];
   
    pj_status_t status = pjsua_call_make_call(account.id, &callDest, &callSettings, NULL, &msgData, &callId);
    if (status != PJ_SUCCESS) {
        [NSException raise:@"Failed to make a call" format:@"See device logs for more details."];
    }
    
    V9SipCall *call = [V9SipCall itemConfig:callId];
    self.calls[@(callId)] = call;
    
    return call;
}

- (V9SipCall *) findCall: (int) callId {
    return self.calls[@(callId)];
}

-(void) pauseParallelCalls:(V9SipCall*) call {
    for(id key in self.calls) {
        if (key != call.id) {
            for (NSString *key in self.calls) {
                V9SipCall *parallelCall = self.calls[key];
                
                if (call.id != parallelCall.id && !parallelCall.isHeld) {
                    [parallelCall hold];
                    [self emmitCallChanged:parallelCall];
                }
            }
        }
    }
}

-(void)useSpeaker {
    self.isSpeaker = true;
    
    AVAudioSession *audioSession = [AVAudioSession sharedInstance];
    [audioSession overrideOutputAudioPort:AVAudioSessionPortOverrideSpeaker error:nil];
    
    for (NSString *key in self.calls) {
        V9SipCall *call = self.calls[key];
        [self emmitCallChanged:call];
    }
}

-(void)useEarpiece {
    self.isSpeaker = false;
    
    AVAudioSession *audioSession = [AVAudioSession sharedInstance];
    [audioSession overrideOutputAudioPort:AVAudioSessionPortOverrideNone error:nil];
    
    for (NSString *key in self.calls) {
        V9SipCall *call = self.calls[key];
        [self emmitCallChanged:call];
    }
}

#pragma mark - Settings

-(void) changeOrientation: (NSString*) orientation {
    pjmedia_orient orient = PJMEDIA_ORIENT_ROTATE_90DEG;
    
    if ([orientation isEqualToString:@"PJMEDIA_ORIENT_ROTATE_270DEG"]) {
        orient = PJMEDIA_ORIENT_ROTATE_270DEG;
    } else if ([orientation isEqualToString:@"PJMEDIA_ORIENT_ROTATE_180DEG"]) {
        orient = PJMEDIA_ORIENT_ROTATE_180DEG;
    } else if ([orientation isEqualToString:@"PJMEDIA_ORIENT_NATURAL"]) {
        orient = PJMEDIA_ORIENT_NATURAL;
    }
    
    /* Here we set the orientation for all video devices.
     * This may return failure for renderer devices or for
     * capture devices which do not support orientation setting,
     * we can simply ignore them.
    */
    for (int i = pjsua_vid_dev_count() - 1; i >= 0; i--) {
        pjsua_vid_dev_set_setting(i, PJMEDIA_VID_DEV_CAP_ORIENTATION, &orient, PJ_TRUE);
    }
}

-(void) changeCodecSettings: (NSDictionary*) codecSettings {
    
    for (NSString * key in codecSettings) {
        pj_str_t codec_id = pj_str((char *) [key UTF8String]);
        NSNumber * priority = codecSettings[key];
        pjsua_codec_set_priority(&codec_id, priority);
    }
    
}
#pragma mark - Events

-(void)emmitRegistrationChanged:(V9SipAccount*) account {
    [self emmitEvent:@"RegistrationChanged" body:[account toJsonDictionary]];
}

-(void)emmitCallReceived:(V9SipCall*) call {
    [self emmitEvent:@"CallReceived" body:[call toJsonDictionary:self.isSpeaker]];
}

-(void)emmitCallChanged:(V9SipCall*) call {
    [self emmitEvent:@"CallChanged" body:[call toJsonDictionary:self.isSpeaker]];
}

-(void)emmitCallTerminated:(V9SipCall*) call {
    [self emmitEvent:@"CallTerminated" body:[call toJsonDictionary:self.isSpeaker]];
}

-(void)emmitMessageReceived:(V9SipMessage*) message {
    [self emmitEvent:@"MessageReceived" body:[message toJsonDictionary]];
}

-(void)emmitEvent:(NSString*) name body:(id)body {
    [[self.bridge eventDispatcher] sendAppEventWithName:name body:body];
}


#pragma mark - Callbacks

static void onRegStateChanged(pjsua_acc_id accId) {
    V9SipEndpoint* endpoint = [V9SipEndpoint instance];
    V9SipAccount* account = [endpoint findAccount:accId];
    
    if (account) {
        [endpoint emmitRegistrationChanged:account];
    }
}

static void onCallReceived(pjsua_acc_id accId, pjsua_call_id callId, pjsip_rx_data *rx) {
    V9SipEndpoint* endpoint = [V9SipEndpoint instance];
    
    V9SipCall *call = [V9SipCall itemConfig:callId];
    endpoint.calls[@(callId)] = call;
    
    [endpoint emmitCallReceived:call];
}

static void onCallStateChanged(pjsua_call_id callId, pjsip_event *event) {
    V9SipEndpoint* endpoint = [V9SipEndpoint instance];
    
    pjsua_call_info callInfo;
    pjsua_call_get_info(callId, &callInfo);
    
    V9SipCall* call = [endpoint findCall:callId];
    
    if (!call) {
        return;
    }
    
    [call onStateChanged:callInfo];
    
    if (callInfo.state == PJSIP_INV_STATE_DISCONNECTED) {
        [endpoint.calls removeObjectForKey:@(callId)];
        [endpoint emmitCallTerminated:call];
    } else {
        [endpoint emmitCallChanged:call];
    }
}

static void onCallMediaStateChanged(pjsua_call_id callId) {
    V9SipEndpoint* endpoint = [V9SipEndpoint instance];
    
    pjsua_call_info callInfo;
    pjsua_call_get_info(callId, &callInfo);
    
    V9SipCall* call = [endpoint findCall:callId];
    
    if (call) {
        [call onMediaStateChanged:callInfo];
    }
    
    [endpoint emmitCallChanged:call];
    
    [[NSNotificationCenter defaultCenter] postNotificationName:@"PjSipInvalidateVideo"
                                                        object:nil];
}

static void onCallMediaEvent(pjsua_call_id call_id,
                             unsigned med_idx,
                             pjmedia_event *event) {
    if (event->type == PJMEDIA_EVENT_FMT_CHANGED) {
        /* Adjust renderer window size to original video size */
        pjsua_call_info ci;
        pjsua_vid_win_id wid;
        pjmedia_rect_size size;
        
        pjsua_call_get_info(call_id, &ci);
        
        if ((ci.media[med_idx].type == PJMEDIA_TYPE_VIDEO) &&
            (ci.media[med_idx].dir & PJMEDIA_DIR_DECODING))
        {
            wid = ci.media[med_idx].stream.vid.win_in;
            size = event->data.fmt_changed.new_fmt.det.vid.size;

            pjsua_vid_win_set_size(wid, &size);
        }
    }
}

static void onMessageReceived(pjsua_call_id call_id, const pj_str_t *from,
                          const pj_str_t *to, const pj_str_t *contact,
                          const pj_str_t *mime_type, const pj_str_t *body,
                          pjsip_rx_data *rdata, pjsua_acc_id acc_id) {
    V9SipEndpoint* endpoint = [V9SipEndpoint instance];
    NSDictionary* data = [NSDictionary dictionaryWithObjectsAndKeys:
                          [NSNull null], @"test",
                          @(call_id), @"callId",
                          @(acc_id), @"accountId",
                          [V9SipUtil toString:contact], @"contactUri",
                          [V9SipUtil toString:from], @"fromUri",
                          [V9SipUtil toString:to], @"toUri",
                          [V9SipUtil toString:body], @"body",
                          [V9SipUtil toString:mime_type], @"contentType",
                          nil];
    V9SipMessage* message = [V9SipMessage itemConfig:data];
    
    [endpoint emmitMessageReceived:message];
}

@end

