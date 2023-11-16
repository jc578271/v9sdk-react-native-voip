//
//  V9SipMessage.h
//  RTCV9Connect
//
//  Created by Hoang Do Xuan on 02/11/2022.
//

#import <React/RCTUtils.h>

@interface V9SipMessage : NSObject

@property NSDictionary * data;

+ (instancetype)itemConfig:(NSDictionary *)config;
- (id)initWithConfig:(NSDictionary *)config;

- (NSDictionary *)toJsonDictionary;

@end

