//
//  V9SipLocalVideoViewManager.m
//  RTCV9Connect
//
//  Created by Hoang Do Xuan on 02/11/2022.
//

#import "V9SipLocalVideoViewManager.m"
#import <V9SIPServer/pjsua.h>
#import <React/RCTViewManager.h>
#import <React/RCTView.h>
#import <AVFoundation/AVFoundation.h>

/**
 * Implements an equivalent of {@code HTMLVideoElement} i.e. Web's video
 * element.
 */
@interface RTCLocalVideoView : RCTView

@property UIView* videoView;

@end

@implementation RTCLocalVideoView {
    
    
    
}

///**
// * Initializes and returns a newly allocated view object with the specified
// * frame rectangle.
// *
// * @param frame The frame rectangle for the view, measured in points.
// */
- (instancetype)init {
    self = [super init];
    
//    CGRect rc = self.frame;
//    self.frame = CGRectMake(rc.origin.x, rc.origin.y, 150, 150);
//
//    self.backgroundColor = [UIColor greenColor];

    
    int numOfDevices = pjsua_vid_dev_count();
    
    NSLog(@"Number of devices %@", @(numOfDevices));
    
    
    unsigned dev_id, count;
    pjmedia_vid_dev_info vdi;
    pj_status_t status;
    
    count = pjsua_vid_dev_count();
    
    dev_id = 2;
    
//    int ori = PJMEDIA_ORIENT_ROTATE_180DEG;
//    pjsua_vid_dev_set_setting(dev_id, PJMEDIA_VID_DEV_CAP_ORIENTATION, &ori, PJ_TRUE);
    
    // for (dev_id=0; dev_id < count; ++dev_id) {
        NSLog(@"Render video device with %@ id", @(dev_id));
        
        status = pjsua_vid_dev_get_info(dev_id, &vdi);
        if (status == PJ_SUCCESS) {
            NSLog(@"Render video vdi.dir: %@", @(vdi.dir));
            NSLog(@"Render video vdi.name: %@", @(vdi.name));
            
            // Render video
            pjsua_vid_preview_param param;
            pjsua_vid_preview_param_default(&param);
            
            status = pjsua_vid_preview_start(dev_id, &param);
            
            if (status == PJ_SUCCESS) {
                pjsua_vid_win_info wi;
                pjsua_vid_win_id winId = pjsua_vid_preview_get_win(dev_id);
                
                NSLog(@"Render preview video window id: %@", @(winId));
                
                status = pjsua_vid_win_get_info(winId, &wi);
                
                if (status == PJ_SUCCESS) {
                    self.videoView = (__bridge UIView *)wi.hwnd.info.ios.window;
                    self.videoView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
                    
                    NSLog(@"Render video info width : %@", @(wi.size.w));
                    NSLog(@"Render video info height : %@", @(wi.size.h));
                    
                    [self addSubview:self.videoView];

                    NSLog(@"Render video end with device %@ id", @(dev_id));
                } else {
                    NSLog(@"Failed to pjsua_vid_win_get_info %@ (%@ error code)", @(dev_id), @(status));
                }
            } else {
                NSLog(@"Failed to pjsua_vid_preview_start %@ (%@ error code)", @(dev_id), @(status));
            }
        } else {
            NSLog(@"Failed to pjsua_vid_dev_get_info %@ (%@ error code)", @(dev_id), @(status));
        }
        
    return self;
}



- (void)layoutSubviews
{
    [super layoutSubviews];
    
    UIView *subview = self.videoView;
    if (!subview) {
        return;
    }
    
    CGFloat width = self.videoView.bounds.size.width, height = self.videoView.bounds.size.height;
    CGRect newValue;
    if (width <= 0 || height <= 0) {
        newValue.origin.x = 0;
        newValue.origin.y = 0;
        newValue.size.width = 0;
        newValue.size.height = 0;
    } else if (true /*RTCVideoViewObjectFitCover == self.objectFit*/) { // cover
        newValue = self.bounds;
        // Is there a real need to scale subview?
        if (newValue.size.width != width || newValue.size.height != height) {
            CGFloat scaleFactor
            = MAX(newValue.size.width / width, newValue.size.height / height);
            // Scale both width and height in order to make it obvious that the aspect
            // ratio is preserved.
            width *= scaleFactor;
            height *= scaleFactor;
            newValue.origin.x += (newValue.size.width - width) / 2.0;
            newValue.origin.y += (newValue.size.height - height) / 2.0;
            newValue.size.width = width;
            newValue.size.height = height;
        }
    } else { // contain
        // The implementation is in accord with
        // https://www.w3.org/TR/html5/embedded-content-0.html#the-video-element:
        //
        // In the absence of style rules to the contrary, video content should be
        // rendered inside the element's playback area such that the video content
        // is shown centered in the playback area at the largest possible size that
        // fits completely within it, with the video content's aspect ratio being
        // preserved. Thus, if the aspect ratio of the playback area does not match
        // the aspect ratio of the video, the video will be shown letterboxed or
        // pillarboxed. Areas of the element's playback area that do not contain the
        // video represent nothing.
        newValue
        = AVMakeRectWithAspectRatioInsideRect(
                                              CGSizeMake(width, height),
                                              self.bounds);
    }
    
    CGRect oldValue = subview.frame;
    if (newValue.origin.x != oldValue.origin.x
        || newValue.origin.y != oldValue.origin.y
        || newValue.size.width != oldValue.size.width
        || newValue.size.height != oldValue.size.height) {
        subview.frame = newValue;
    }
    
    subview.transform
    = /*self.mirror
    ? CGAffineTransformMakeScale(-1.0, 1.0)
    : */ CGAffineTransformIdentity;
    
}

@end

@interface V9SipLocalVideoViewManager : RCTViewManager

@end


@implementation V9SipLocalVideoViewManager

-(UIView *) view {
    return [[RTCLocalVideoView alloc] init];
}

- (dispatch_queue_t) methodQueue {
    return dispatch_get_main_queue();
}

RCT_CUSTOM_VIEW_PROPERTY(deviceId, NSString, RTCLocalVideoView) {

}



RCT_EXPORT_MODULE();

@end
