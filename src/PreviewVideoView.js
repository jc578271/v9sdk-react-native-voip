/*
 * @Author: hoangdx (Hoang Do) 
 * @Date: 2022-10-29 11:27:41 
 * @Last Modified by: hoangdx (Hoang Do)
 * @Last Modified time: 2022-10-29 17:00:27
 */

import {DeviceEventEmitter, NativeModules, requireNativeComponent} from 'react-native';
import PropTypes from 'prop-types';

const PreviewVideoView = {
  name: 'V9SipPreviewVideoView',
  propTypes: {
    deviceId: PropTypes.number.isRequired,
	objectFit: PropTypes.oneOf(['contain', 'cover'])
  },
};

const View = requireNativeComponent('V9SipPreviewVideoView', null);

export default View;
