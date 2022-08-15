#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <ComScore/ComScore.h>
#import <FirebaseCore/FirebaseCore.h>
#import <AppTrackingTransparency/AppTrackingTransparency.h>
#import <AdSupport/AdSupport.h>

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"BlackPlanet"
                                            initialProperties:nil];
  
  [FIRApp configure];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [self requestIdfa];
  
  // Comscore setup
  SCORPublisherConfiguration *myPublisherConfig = [SCORPublisherConfiguration publisherConfigurationWithBuilderBlock:^(SCORPublisherConfigurationBuilder *builder) {
      builder.publisherId = @"6035391";
  }];
  [[SCORAnalytics configuration] addClientWithConfiguration:myPublisherConfig];
  [SCORAnalytics configuration].usagePropertiesAutoUpdateMode = SCORUsagePropertiesAutoUpdateModeForegroundAndBackground;
#if DEBUG
  [[SCORAnalytics configuration] enableImplementationValidationMode];
#endif
  [SCORAnalytics start];
  
  [self requestPushNotificationPermissions];
  
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (void)requestIdfa
{
  if (@available(iOS 14, *)) {
    [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
      // Tracking authorization completed. Start loading ads here.
      // [self loadAd];
    }];
  } else {
    // Fallback on earlier versions
  }
}

#pragma mark - Push notifications functions
- (void)application:(UIApplication*)app didRegisterForRemoteNotificationsWithDeviceToken:(NSData*)devToken
{
  // parse token bytes to string
  const char *data = [devToken bytes];
  NSMutableString *token = [NSMutableString string];
  for (NSUInteger i = 0; i < [devToken length]; i++)
  {
    [token appendFormat:@"%02.2hhX", data[i]];
  }
  
  // print the token in the console.
  NSLog(@"Push Notification Token: %@", [token copy]);
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  // could not register a Push Notification token at this time.
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  // app has received a push notification
}

- (void)requestPushNotificationPermissions
{
  // iOS 10+
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  [center getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * _Nonnull settings) {
    
    switch (settings.authorizationStatus)
    {
      // User hasn't accepted or rejected permissions yet. This block shows the allow/deny dialog
      case UNAuthorizationStatusNotDetermined:
      {
        center.delegate = self;
        [center requestAuthorizationWithOptions:(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge) completionHandler:^(BOOL granted, NSError * _Nullable error)
         {
           if(granted)
           {
             [[UIApplication sharedApplication] registerForRemoteNotifications];
           }
           else
           {
             // notify user to enable push notification permission in settings
           }
         }];
        break;
      }
      // the user has denied the permission
      case UNAuthorizationStatusDenied:
      {
        // notify user to enable push notification permission in settings
        break;
      }
      // the user has accepted; Register a PN token
      case UNAuthorizationStatusAuthorized:
      {
        [[UIApplication sharedApplication] registerForRemoteNotifications];
        break;
      }
      default:
        break;
    }
  }];
}

@end
