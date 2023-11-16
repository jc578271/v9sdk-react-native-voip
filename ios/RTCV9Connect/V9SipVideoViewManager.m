//
//  V9SipVideoViewManager.m
//  RTCV9Connect
//
//  Created by Hoang Do Xuan on 02/11/2022.
//

#import "V9SipVideoViewManager.m"
#import <React/RCTViewManager.h>
#import <V9SIPServer/pjsua.h>
#import <React/RCTView.h>

/**
 * Implements an equivalent of {@code HTMLVideoElement} i.e. Web's video
 * element.
 */
@interface RTCVideoView : RCTView

// @property pjsua_vid_win_id vidWinId;

@end

@implementation RTCVideoView {
    
}

@end

@interface V9SipVideoViewManager : RCTViewManager

@end


@implementation V9SipVideoViewManager

-(UIView *)view {
    return [[RTCVideoView alloc] init];
}

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_CUSTOM_VIEW_PROPERTY(windowId, NSNumber, RTCVideoView) {
    
    
    // TODO: Remove this

    NSLog(@"RCT_CUSTOM_VIEW_PROPERTY");
    
    pjsua_vid_win_id c[64];
    unsigned k, count = PJ_ARRAY_SIZE(c);
    pjsua_vid_enum_wins(c, &count);
    
    NSLog(@"RCT_CUSTOM_VIEW_PROPERTY Size: %d", count);
    
    for (NSUInteger i = 0; i < count; i++) {
        NSLog(@"Window Id: %d", c[i]);
    }
    
    
    // Start
    NSNumber *s = [RCTConvert NSNumber:json];
    
    int d = [s intValue], i, last;
    i = (d == PJSUA_INVALID_ID) ? 0 : d;
    last = (d == PJSUA_INVALID_ID) ? PJSUA_MAX_VID_WINS : d+1;
    
    
    
    for (;i < last; ++i) {
        pjsua_vid_win_info wi;
        
        if (pjsua_vid_win_get_info(i, &wi) == PJ_SUCCESS) {
            UIView *parent = view;
            UIView *videoView = (__bridge UIView *)wi.hwnd.info.ios.window;
            videoView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
            
            if (videoView && ![videoView isDescendantOfView:parent]) {
                CGRect newFrame = videoView.frame;
                newFrame.size.width = wi.size.w;
                newFrame.size.height = wi.size.h;
                
                [videoView setFrame:view.bounds];
                [view addSubview:videoView];
                
                
                NSLog(@"Add video to view!!!");
                
            }
        }
    }
    
}


RCT_EXPORT_MODULE();

@end
