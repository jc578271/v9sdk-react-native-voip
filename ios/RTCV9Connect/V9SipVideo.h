//
//  V9SipVideo.h
//  RTCV9Connect
//
//  Created by Hoang Do Xuan on 02/11/2022.
//

#import <Foundation/Foundation.h>
#import <React/RCTViewManager.h>
#import <V9SIPServer/pjsua.h>
#import <AVFoundation/AVFoundation.h>

// TODO: Add ability to change device orientation!

typedef enum ObjectFit : NSUInteger {
    contain,
    cover
} ObjectFit;

@interface V9SipVideo : UIView
@property pjsua_vid_win_id winId;
@property UIView* winView;
@property ObjectFit winFit;

-(void)setWindowId:(pjsua_vid_win_id) windowId;
-(void)setObjectFit:(ObjectFit) objectFit;
@end
