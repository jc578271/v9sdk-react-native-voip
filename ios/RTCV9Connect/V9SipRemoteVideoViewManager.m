//
//  V9SipRemoteVideoViewManager.m
//  RTCV9Connect
//
//  Created by Hoang Do Xuan on 02/11/2022.
//

#import <React/RCTViewManager.h>
#import <V9SIPServer/pjsua.h>
#import <React/RCTView.h>
#import <AVFoundation/AVFoundation.h>
#import "V9SipUtil.h"
#import "V9SipVideo.h"
#import "V9SipRemoteVideoViewManager.h"

@implementation V9SipRemoteVideoViewManager

-(UIView *) view {
    return [[V9SipVideo alloc] init];
}

- (dispatch_queue_t) methodQueue {
    return dispatch_get_main_queue();
}

RCT_CUSTOM_VIEW_PROPERTY(windowId, NSString, V9SipVideo) {
    pjsua_vid_win_id windowId = [[RCTConvert NSNumber:json] intValue];
    [view setWindowId:windowId];
}

RCT_CUSTOM_VIEW_PROPERTY(objectFit, NSString, V9SipVideo) {
    ObjectFit fit = contain;
    
    if ([[RCTConvert NSString:json] isEqualToString:@"cover"]) {
        fit = cover;
    }
    
    [view setObjectFit:fit];
}


RCT_EXPORT_MODULE();

@end

