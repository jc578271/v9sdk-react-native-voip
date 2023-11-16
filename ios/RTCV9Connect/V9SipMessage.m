//
//  V9SipMessage.m
//  RTCV9Connect
//
//  Created by Hoang Do Xuan on 02/11/2022.
//

#import "V9SipMessage.h"

@implementation V9SipMessage

+ (instancetype)itemConfig:(NSDictionary *)config {
    return [[self alloc] initWithConfig:config];
}

- (id)initWithConfig:(NSDictionary *)config {
    self = [super init];
    
    if (self) {
        self.data = config;
    }
    
    return self;
}

- (NSDictionary *)toJsonDictionary {
    return self.data;
}

@end

