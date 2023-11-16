//
//  V9SipAccount.h
//  RTCV9Connect
//
//  Created by Hoang Do Xuan on 02/11/2022.
//

#import <React/RCTUtils.h>

#import "V9SipCall.h"

@interface V9SipAccount : NSObject

@property int id;
@property NSString * name;
@property NSString * username;
@property NSString * domain;
@property NSString * password;
@property NSString * proxy;
@property NSString * transport;

@property NSString * contactParams;
@property NSString * contactUriParams;


@property NSString * regServer;
@property NSNumber * regTimeout;
@property NSDictionary * regHeaders;
@property NSString * regContactParams;
@property bool regOnAdd;

+ (instancetype)itemConfig:(NSDictionary *)config;

- (id)initWithConfig:(NSDictionary *)config;
- (int)id;

- (V9SipCall *) makeCall: (NSString *) destination;
- (void) register: (bool) renew;

- (NSDictionary *)toJsonDictionary;

@end
