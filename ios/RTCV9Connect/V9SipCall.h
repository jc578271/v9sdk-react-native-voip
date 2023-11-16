//
//  V9SipCall.h
//  RTCV9Connect
//
//  Created by Hoang Do Xuan on 02/11/2022.
//

#import <React/RCTUtils.h>
#import <V9SIPServer/pjsua.h>

@interface V9SipCall : NSObject

@property int id;
@property bool isHeld;
@property bool isMuted;

+ (instancetype)itemConfig:(int)id;

- (void)hangup;
- (void)decline;
- (void)answer;
- (void)hold;
- (void)unhold;
- (void)mute;
- (void)unmute;
- (void)xfer:(NSString*) destination;
- (void)xferReplaces:(int) destinationCallId;
- (void)redirect:(NSString*) destination;
- (void)dtmf:(NSString*) digits;

- (void)onStateChanged:(pjsua_call_info) callInfo;
- (void)onMediaStateChanged:(pjsua_call_info) callInfo;

- (NSDictionary *)toJsonDictionary:(bool) isSpeaker;

@end
