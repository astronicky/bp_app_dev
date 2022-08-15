/*
 * Created by Justice on Wed Nov 18 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    margin: 15,
    marginTop: 0,
    marginBottom: 0
  },
  menuTitle: {
    fontSize: 18,
    marginTop: 10
  },
  settingTitle: {
    fontSize: 16
  },
  settingSubTitle: {
    fontSize: 14
  },
  settingCaption: {
    fontSize: 12,
    marginTop: 5
  },
  settingContainer: {
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 10,
    flexDirection: 'row'
  },
  settingLeftCont: {
    flex: 3
  },
  settingRightCont: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  settingsFullCont: {
    flex: 1,
    marginTop: 10,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  settingsRightActionCont: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 5,
  },
  settingsSearchCont: {
    flex: 1,
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    flexDirection: 'row'
  },
  searchLeftCont: {
    flex: 1,
    maxWidth: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchRightCont: {
    flex: 3,
  },
  searchField: {
    fontSize: 16,
    height: 43,
    borderRadius: 5,
    padding: 10,
    paddingLeft: 0,
  },
  searchIcon: {
    width: 20, height: 20
  },
  fieldLeftCont: {
    justifyContent: 'center',
    flex: 2
  },
  fieldMiddleCont: {
    flex: 3,
    marginRight: 10
  },
  fieldRightCont: {
    maxWidth: 80,
    flex: 2
  },
  field: {
    fontSize: 16,
    height: 43
  },
  whiteField: {
    fontSize: 16,
    height: 43,
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 10
  },
  lineSeparator: {
    width: '100%',
    height: 0.5,
    backgroundColor: 'gray',
    marginTop: 10,
    marginLeft: 10,
  },
  separator: {
    width: '100%',
    height: 20,
    backgroundColor: 'transparent'
  },
  halfSeparator: {
    width: '100%',
    height: 10,
    backgroundColor: 'transparent'
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  logo: {
    width: 50, height: 40, resizeMode: 'stretch'
  },
  titleLine: {
    marginTop: 15, fontSize: 24, marginBottom: 15
  },
  txtbox_container: {
    margin: 20,
    marginBottom: 5,
    marginTop: 5,
    maxWidth: '100%'
  },
  topSeparator: {
    marginTop: 70,
    alignItems: 'center'
  },
  codeContainer: {
    paddingTop: 20
  },
  txtbox: {
    paddingRight: 2, marginTop: 5, marginBottom: 5,
    fontSize: 16, height: 45,
    maxWidth: '100%',
    width: '60%',
    borderStyle: "solid",
    borderWidth: 0.6,
    padding: 12, borderRadius: 10,
    backgroundColor: 'white',
  },
  updateButtonCont: {
    justifyContent: 'center', alignItems: 'center'
  },
  updateButton: {
    width: '90%', height: 43, borderRadius: 8, marginBottom: 15, marginTop: 5,
    alignItems: 'center', justifyContent: 'center'
  },
  updateButtonText: {
    alignItems: 'center', justifyContent: 'center'
  },
  updateText: {
    color: 'white',
    fontSize: 18,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: 80,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 15,
  },
  personInfoCont: {
    width: '78%',
    paddingLeft: 10, paddingRight: 10
  },
  personRowCont: {
    width: '50%',
    paddingLeft: 10, paddingRight: 10
  },
  actionInfoCont: {
    width: '35%',
    paddingLeft: 10, paddingRight: 10
  },
  nameCont: {
    flexDirection: 'row'
  },
  nicktxt: {
    fontSize: 17,
    fontWeight: '600',
  },
  nametxt: {
    marginTop: 3,
    fontSize: 13
  },
  verifiedIcon: {
    width: 15, height: 18, marginTop: 2, marginLeft: 5, resizeMode: 'stretch'
  },
  loaderCont: {
    height: Dimensions.get('window').height * 0.7,
    justifyContent: 'center'
  },
  listContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#F5F5F5'
  },
  deactContainer: {
    flex: 1, margin: 30, marginTop: 60
  },
  deactTitle: {
    fontSize: 20
  },
  deactSubtitle: {
    fontSize: 16, marginTop: 10
  },
  deactOptionContainer: {
    borderWidth: 1, marginTop: 20, borderRadius: 8
  },
  optionContainer: {
    flexDirection: 'row'
  },
  optionRadioContainer: {
    width: 50, justifyContent: 'center', alignItems: 'center'
  },
  optionTextContainer: {
    flex: 3, flexDirection: 'column', padding: 10
  },
  optionTitle: {
    fontSize: 16, marginBottom: 5
  },
  optionSubtitle: {
    fontSize: 14
  }
})