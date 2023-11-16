require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "react-native-voip"
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']

  s.authors      = package['author']
  s.homepage     = package['homepage']
  s.platform     = :ios, "9.0"

  s.source       = { :git => "https://gitlab.com/htt.bkap/v9sdk-react-native-voip.git" }
  s.source_files  = "ios/**/*.{h,m}"

  s.dependency 'React'
  s.vendored_frameworks = 'ios/V9SIPServer.framework'
end