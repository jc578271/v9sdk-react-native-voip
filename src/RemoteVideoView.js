/*
 * @Author: hoangdx (Hoang Do) 
 * @Date: 2022-10-29 11:27:27 
 * @Last Modified by: hoangdx (Hoang Do)
 * @Last Modified time: 2022-10-29 17:00:32
 */

import {DeviceEventEmitter, NativeModules, requireNativeComponent} from 'react-native';
import PropTypes from 'prop-types';

const RemoteVideoView = {
  name: 'V9SipRemoteVideoView',
  propTypes: {
  	windowId: PropTypes.string.isRequired,
	objectFit: PropTypes.oneOf(['contain', 'cover'])
  },
};

const View = requireNativeComponent('V9SipRemoteVideoView', null);

export default View;

