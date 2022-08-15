/*
 * Created by Justice on Fri Oct 30 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    backgroundColor: '#F5F5F5'
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  adContainer: {
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  connectionContainer: {
    width: '100%', 
    height: 45, 
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    marginLeft: 10, 
    marginRight: 10 
  },
  image: {
    height: '100%',
    width: '100%',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
  },
  smallAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  avatarComments: {
    width: 35,
    height: 35,
    borderRadius: 18,
  },
  backIconCont: {
    position: 'absolute',
    top: 35,
    left: 20,
    zIndex: 100,
    height: 25,
    width: 25,
  },
  backIcon: {
    height: 25,
    width: 25,
  },
  header: {
    backgroundColor: 'white',
    width: '100%',
    height: 100,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  postCont: {
    width: '100%',
    minHeight: 100,
    backgroundColor: 'white',
    marginVertical: 8,
    borderRadius: 2,
  },
  postImg: {
    height: 300,
    borderRadius: 3,
    marginLeft: 10, marginRight: 10
  },
  postImgSmall: {
    height: 200,
    borderRadius: 3,
    marginLeft: 10, marginRight: 10
  },
  postHeader: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    height: 65,
    alignItems: 'center',
  },
  personInfoCont: {
    width: '78%',
    marginLeft: 10,
    marginRight: 10
  },
  nicktxt: {
    fontSize: 17,
    fontWeight: '600',
  },
  nametxt: {
    marginTop: 3,
    fontSize: 13
  },
  commentIcon: {
    width: 30, height: 30, margin: 5 
  },
  commentNicktxt: {
    fontSize: 13,
    fontWeight: '600',
  },
  commentNametxt: {
    fontSize: 13
  },
  commentLikeCont: {
    width: 100, flexDirection: 'row',
    marginTop: 10
  },
  commentLikeBtnCont: {
    flexDirection: 'row', flex: 1,
  },
  commentLikeLabel: {
    marginLeft: 10, marginTop: 2, fontSize: 13
  },
  commentLikersLabel: {
    marginLeft: 10, marginTop: 0, fontSize: 13
  },
  commentLikersCont: {
    alignItems: 'flex-end', flex: 2
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 45,
    marginLeft: '3%', marginRight: '3%'
  },
  moreComtxt: {
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 10,
    marginTop: 10
  },
  likesCount: {
    fontSize: 15,
    marginLeft: 8,
    paddingRight: 8,
  },
  likeButton: {
    flexDirection: 'row', height: 32,
    borderRadius: 3, paddingLeft: 8, 
    paddingRight: 0, paddingTop: 5, 
    paddingBottom: 5
  },
  likeIcon: {
    marginTop: 1,
    width: 20, height: 20, resizeMode: 'contain'
  },
  commentCountIcon: {
    marginTop: 3,
    width: 20, height: 20, resizeMode: 'contain'
  },
  likeCommentIcon: {
    marginTop: 2,
    width: 15, height: 15, 
    resizeMode: 'contain'
  },
  likeSeparator: {
    marginRight: 10
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentsCont: {
    minHeight: 60,
    backgroundColor: '#F4F2F2',
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    marginLeft: '3%',
    maxWidth: '87%'
  },
  commentFlex: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: '3%', marginRight: '3%',
  },
  moreCommentsFlex: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: '3%', marginRight: '3%',
    marginBottom: 15, marginTop: 5
  },
  input: {
    width: '66%'
  },
  picBox: {
    flex: 1,
    maxWidth: 38,
    marginBottom: 20,
    marginTop: 2
  },
  inputBox: {
    flex: 3,
    height: 40,
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: '#F4F2F2',
    paddingHorizontal: 10,
    marginLeft: '3%', marginRight: '3%',
    flexDirection: 'row',
  },
  sendBox: {
    flex: 1,
    maxWidth: 50,
    width: 50,
    height: 40,
    borderWidth: 0.4,
    borderRadius: 5,
    alignItems: 'flex-end'
  },
  separatorLine: {
    flex: 1,
    height: 0.5, width: '94%', 
    justifyContent: 'center',
    marginLeft: '3%', marginRight: '3%',
    marginBottom: 5 
  },
  bottomSeparatorLine: {
    flex: 1,
    height: 0.5, width: '94%', 
    justifyContent: 'center',
    marginLeft: '3%', marginRight: '3%',
    marginBottom: 10
  },
  topSeparatorLine: {
    flex: 1,
    height: 0.5, width: '94%', 
    justifyContent: 'center',
    marginLeft: '3%', marginRight: '3%',
    marginTop: 10
  },
  send: {
    width: 30,
    height: 30
  },
  sendButton: {
    width: 50,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputCont: {
    alignContent: 'flex-start',
    paddingTop: 10,
    flexDirection: 'row',
    marginLeft: '3%', marginRight: '3%',
    height: 65
  },
  mainText: {
    fontSize: 15,
    marginHorizontal: 8,
    marginBottom: 5,
    marginLeft: 10, 
    marginRight: 10
  },
  tobtabbattabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 80,
    paddingTop: 30,
  },
  tobtabbattabsTxt: {
    color: '#707070',
    fontSize: 21,
    fontWeight: '600',
  },
  selectedTopTabBar: {
    width: 120,
    height: 4,
    backgroundColor: '#006A7C',
    marginTop: 8,
  },
  toptabs: {
    alignItems: 'center',
    width: 120,
  },
  bottomTabBar: {
    height: 70,
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  bottomTabSelected: {
    width: 30,
    alignItems: 'center',
  },
  sugestedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sugestedHeaderTxt: {
    fontSize: 23,
    fontWeight: '700',
  },
  hr: {
    width: '100%',
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  suggetedPeopleCont: {
    marginHorizontal: 10,
    marginTop: 10,
    flexDirection: 'row',
  },
  suggetedPersonCont: {
    padding: 8,
    width: 110,
    height: 130,
    borderRadius: 7,
    borderColor: '#F0F0F0',
    borderWidth: 1,
    alignItems: 'center',
    marginRight: 18,
  },
  followStyle: {
    color: '#006A7C',
    fontWeight: '600',
    marginTop: 3,
  },
  followBtn: {
    width: '100%', height: 30, 
    alignItems: 'center', justifyContent: 'center'
  },
  viewMoreTextCont: {
    fontSize: 14, marginLeft: 10
  },
  viewMoreCont: {
    height: 50,
    justifyContent: 'center',
    paddingRight: 14,
    alignItems: 'flex-end',
  },
  previewAttachBox: {
    flex: 1, 
    backgroundColor: 'white', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    margin: 10, 
    marginTop: 0,
  },
  previewBox: {
    marginLeft: 10, marginRight: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 3
  },
  previewBoxSmall: {
    backgroundColor: '#F5F5F5',
    borderRadius: 3,
    width: '100%',
  },
  previewContent: {
    height: 250,
    marginTop: 10, 
    marginBottom: 10
  },
  previewContentSmall: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 5
  },
  previewHeader: {
    flexDirection: 'row',
    marginTop: 10, marginLeft: 10, marginRight: 10, marginBottom: 0
  },
  previewHeaderSmall: {
    flexDirection: 'row', margin: 0, marginTop: 10,
  },
  previewHeaderLabel: {
    marginLeft: 8
  },
  previewFavIcon: {
    height: 18, width: 18
  },
  previewLabel: {
    marginLeft: 10, 
    marginRight: 10, 
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 18
  },
  previewLabelSmall: {
    marginLeft: 5, 
    marginRight: 5, 
    marginBottom: 5,
    fontSize: 14
  },
  fab: {
    position: 'absolute',
    marginRight: 5, marginBottom: 0,
    right: 0,
    bottom: 0
  },
  ad: {
    position: 'absolute',
    marginRight: 5, marginBottom: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'red',
    height: 60,
    width: '100%'
  },
  fabIcon: {
    width: 85, height: 85
  },
  loaderCont: {
    height: Dimensions.get('window').height * 0.7,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  removePreviewIcon: {
    position: 'absolute', justifyContent: 'flex-end', alignItems: 'flex-end', 
    padding: 0, width: '100%'
  },
  commentMedia: {
    marginHorizontal: 7,
    height: 300,
    borderRadius: 5,
    marginTop: 15,
    marginLeft: 10, marginRight: 10,
  },
  removeMediaIcon: {
    position: 'absolute', alignItems: 'flex-end', 
    width: '100%', height: 30, paddingRight: 0
  },
  updaterCont: {
    width: '100%', height: 30, justifyContent: 'center', alignItems: 'center', marginTop: 15, position: 'absolute'
  },
  updaterButton: {
    width: 100, height: 30, justifyContent: 'center', borderRadius: 15
  },
  updaterTitle: {
    textAlign: 'center', color: '#ffffff', fontSize: 14,
  },
  legacyBanner: {
    width: '100%', maxHeight: 80, flexDirection: 'row', 
    justifyContent: 'center', alignItems: 'center', 
    marginTop: 5, marginBottom: 5
  },
  blockedBanner: {
    width: '100%', maxHeight: 80, flexDirection: 'row', 
    justifyContent: 'flex-start', alignItems: 'center', 
    marginTop: 0, marginBottom: 10, margin: 5
  },
  legacyIcon: {
    width: 15, maxHeight: 80, alignItems: 'flex-start'
  },
  legacyText: {
    fontSize: 12, width: '80%', textAlign: 'center' 
  },
  blockText: {
    fontSize: 12, width: '100%', textAlign: 'left' 
  },
  verifiedIcon: {
    width: 15, height: 18, marginTop: 2, marginLeft: 5, resizeMode: 'stretch'
  },
  verifiedIconComment: {
    width: 13, height: 15, marginLeft: 0, resizeMode: 'stretch'
  },
});