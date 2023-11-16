//
//  V9SipEndpoint.h
//  RTCV9Connect
//
//  Created by Hoang Do Xuan on 02/11/2022.
//

#import <React/RCTBridgeModule.h>

#import "V9SipAccount.h"
#import "V9SipCall.h"


@interface V9SipEndpoint : NSObject

@property NSMutableDictionary* accounts;
@property NSMutableDictionary* calls;
@property(nonatomic, strong) RCTBridge *bridge;

@property pjsua_transport_id tcpTransportId;
@property pjsua_transport_id udpTransportId;
@property pjsua_transport_id tlsTransportId;

@property bool isSpeaker;

+(instancetype)instance;

-(NSDictionary *)start;

-(V9SipAccount *)createAccount:(NSDictionary*) config;
-(void) deleteAccount:(int) accountId;
-(V9SipAccount *)findAccount:(int)accountId;
-(V9SipCall *)makeCall:(V9SipAccount *) account destination:(NSString *)destination callSettings: (NSDictionary *)callSettings msgData: (NSDictionary *)msgData;
-(void)pauseParallelCalls:(V9SipCall*) call; // TODO: Remove this feature.
-(V9SipCall *)findCall:(int)callId;
-(void)useSpeaker;
-(void)useEarpiece;

-(void)changeOrientation: (NSString*) orientation;
-(void)changeCodecSettings: (NSDictionary*) codecSettings;

-(void)emmitRegistrationChanged:(V9SipAccount*) account;
-(void)emmitCallReceived:(V9SipCall*) call;
-(void)emmitCallUpdated:(V9SipCall*) call;
-(void)emmitCallChanged:(V9SipCall*) call;
-(void)emmitCallTerminated:(V9SipCall*) call;

@end
