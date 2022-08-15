//
//  RCTComscoreModule.m
//  BlackPlanet
//
//  Created by John Paul T. Mañoza on 3/30/21.
//

#import "RCTComscoreModule.h"
#import <ComScore/ComScore.h>

@implementation RCTComscoreModule

RCT_EXPORT_METHOD(trackScreenAt:(NSString *)screenName)
{
  [SCORAnalytics notifyViewEventWithLabels:@{
    @"ns_category": screenName
  }];
#if DEBUG
  NSLog(@"Comscore iOS: Log screen event at %@", screenName);
#endif
}

RCT_EXPORT_MODULE(ComscoreNativeiOSModule);

@end
