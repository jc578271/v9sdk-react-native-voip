//
//  V9SipUtil.h
//  RTCV9Connect
//
//  Created by Hoang Do Xuan on 02/11/2022.
//

#import <React/RCTUtils.h>
#import <V9SIPServer/pjsua.h>

@interface V9SipUtil : NSObject

+(NSString *) toString: (pj_str_t *) str;
+(BOOL) isEmptyString : (NSString *) str;

+(NSString *) callStateToString: (pjsip_inv_state) state;
+(NSString *) callStatusToString: (pjsip_status_code) status;
+(NSString *) mediaDirToString: (pjmedia_dir) dir;
+(NSString *) mediaStatusToString: (pjsua_call_media_status) status;
+(NSString *) mediaTypeToString: (pjmedia_type) type;

+(void) fillCallSettings: (pjsua_call_setting*) callSettings dict:(NSDictionary*) dict;
+(void) fillMsgData: (pjsua_msg_data*) msgData dict:(NSDictionary*) dict;

@end
