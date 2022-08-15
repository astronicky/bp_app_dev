/*
 * Created by Justice on Tue Dec 01 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Geolocation from '@react-native-community/geolocation'
import RNPickerSelect from 'react-native-picker-select'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { withTheme, Switch, IconButton } from 'react-native-paper'
import { styles } from './style'

import chevron from 'app/assets/chevron-down.png'
import searchIcon from 'app/assets/searchTabIcon.png';
import PageLoader from 'app/features/shared/page-loader/components/index'

import { actLoadGenderFilters, actLoadAgeFilters, actFilterUsers, actSetIsOnline, actSetIsNearby, actSetGenderFilter, actSetAgeFilter, actResetFilter, actToggleFilters, actSetLocation, actToggleSearching } from './../actions/index'

class BrowserHeaderComponent extends Component {

    componentDidMount() {
        this.findCoordinates()
        this.props.doLoadGenderFilters()
        this.props.doLoadAgeFilters()

        // load default values
        if (this.props.isLoading == undefined) {
            this.tapApplyFilter(false);
        }
    }

    componentDidUpdate(prevProps) {
        // when filter changed, reload the items
        if (this.props.ageId != prevProps.ageId ||
            this.props.genderId != prevProps.genderId ||
            this.props.isNearby != prevProps.isNearby ||
            this.props.isOnline != prevProps.isOnline
        ) {
            setTimeout(() => {
                this.tapApplyFilter(false);
            }, 500);
        }
    }

    render() {
        const { colors, fonts } = this.props.theme
        const { isLoading, showFilter } = this.props

        return (
            <React.Fragment>
                <View style={styles.filterContainer}>
                    <TouchableOpacity style={styles.searchToolbar} onPress={this.tapSearch}>
                        <View style={{ flexDirection: 'row', backgroundColor: colors.background, borderRadius: 8, width: '100%', height: '100%' }}>
                            <IconButton
                                icon={searchIcon}
                                color={colors.gray}
                                size={20}
                                style={{ marginLeft: 10 }}
                            />
                            <Text style={{ ...styles.searchText, color: colors.gray }}>
                                Search
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.headerCont1}>
                        <TouchableOpacity style={{ ...styles.filterBtn, borderColor: colors.secondary }} onPress={this.toggleIsFiltersEnabled}>
                            <Text style={{ ...styles.bigBtnText, color: colors.secondary, fontFamily: fonts.regular }}>
                                Filters
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {showFilter == true && this.renderOpts()}
                </View>
                {isLoading == true && this.renderLoader()}
            </React.Fragment>
        )
    }

    renderLoader = () => {
        return (
            <View style={styles.loaderCont}>
                <PageLoader type="large" />
            </View>
        )
    }

    renderOpts = () => {
        const { colors, fonts } = this.props.theme
        const { genderId, ageId, isOnline, isNearby } = this.props
        const { genderFilters, ageFilters } = this.props

        return (
            <React.Fragment>
                <View style={styles.headerFilterCont}>
                    <View style={styles.filterRow}>
                        <Text style={{ ...styles.legendLabel1, fontFamily: fonts.semiBold }}>
                            Status:
                        </Text>
                        <View style={styles.flexRow}>
                            <Switch value={isOnline} color={colors.secondary} onValueChange={this.toggleIsOnline} />
                            <Text style={{ ...styles.valueLabel, fontFamily: fonts.regular }}>
                                Online
                            </Text>
                        </View>
                    </View>
                    <View style={styles.filterRow}>
                        <Text style={{ ...styles.legendLabel1, fontFamily: fonts.semiBold }}>
                            Location:
                        </Text>
                        <View style={styles.flexRow}>
                            <Switch value={isNearby} color={colors.secondary} onValueChange={this.toggleIsNearby} />
                            <Text style={{ ...styles.valueLabel, fontFamily: fonts.regular }}>
                                Nearby
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.headerFilterCont}>
                    <View style={styles.filterRow}>
                        <Text style={{ ...styles.legendLabel2, fontFamily: fonts.semiBold }}>
                            Age:
                        </Text>
                        <View style={{ ...styles.dropdownCont, borderColor: colors.gray }}>
                            <View style={styles.dropdownRow}>
                                <RNPickerSelect
                                    useNativeAndroidPickerStyle={false}
                                    placeholder={{ label: 'Age', value: 0 }}
                                    value={ageId}
                                    style={{
                                        inputIOS: { ...styles.dropdown, color: colors.dark, fontFamily: fonts.regular },
                                        inputAndroid: { ...styles.dropdown, color: colors.dark, fontFamily: fonts.regular }
                                    }}
                                    onValueChange={(ageId) => this.props.doSetAgeFilter(ageId)}
                                    Icon={() => <View />}
                                    items={ageFilters}
                                />
                            </View>
                            <View style={styles.chevronRow}>
                                <Image source={chevron} style={styles.chevron} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.filterRow}>
                        <Text style={{ ...styles.legendLabel2, fontFamily: fonts.semiBold }}>
                            Gender:
                        </Text>
                        <View style={{ ...styles.dropdownCont, borderColor: colors.gray }}>
                            <View style={styles.dropdownRow}>
                                <RNPickerSelect
                                    useNativeAndroidPickerStyle={false}
                                    placeholder={{ label: 'Gender', value: 0 }}
                                    value={genderId}
                                    style={{
                                        inputIOS: { ...styles.dropdown, color: colors.dark, fontFamily: fonts.regular },
                                        inputAndroid: { ...styles.dropdown, color: colors.dark, fontFamily: fonts.regular }
                                    }}
                                    onValueChange={(genderId) => this.props.doSetGenderFilter(genderId)}
                                    Icon={() => <View />}
                                    items={genderFilters}
                                />
                            </View>
                            <View style={styles.chevronRow}>
                                <Image source={chevron} style={styles.chevron} />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.headerCont2}>
                    <TouchableOpacity style={styles.resetBtn} onPress={this.tapResetFilters}>
                        <Text style={{ ...styles.smallBtnText, color: colors.secondary, fontFamily: fonts.semiBold }}>
                            Reset all
                        </Text>
                    </TouchableOpacity>
                </View>
                {/* <View style={styles.headerCont3}>
                    <TouchableOpacity style={{ ...styles.applyBtn, backgroundColor: colors.secondary }} onPress={() => this.tapApplyFilter(true)}>
                        <Text style={{ ...styles.applyBtnText, fontFamily: fonts.regular }}>
                            Apply
                        </Text>
                    </TouchableOpacity>
                </View> */}
            </React.Fragment>
        )
    }

    toggleIsOnline = () => {
        this.props.doSetIsOnline()
    }

    toggleIsNearby = () => {
        this.props.doSetIsNearby()
    }

    toggleIsFiltersEnabled = () => {
        this.props.doToggleFilters()
    }

    tapResetFilters = () => {
        this.props.doResetFilter()
    }

    tapSearch = () => {
        this.props.doToggleSearching()
        // this.props.navigation.navigate('Search')
    }

    tapApplyFilter = (dismissFilters) => {
        const { genderValue, ageValue, latValue, lngValue, isOnline, isNearby } = this.props

        if (genderValue != undefined && ageValue != undefined) {
            const lat = isNearby == true ? latValue : undefined
            const lng = isNearby == true ? lngValue : undefined
            this.props.doFilterUsers(0, lat, lng, genderValue, ageValue, isOnline)
        }

        if (dismissFilters == true) {
            this.props.doToggleFilters()
        }
    }

    findCoordinates = () => {
        Geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords?.latitude
                const longitude = position.coords?.longitude
                this.props.doSetLocation(latitude, longitude)
            },
            error => { console.log('location error', error.message) },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    };
}

const mapStateToProps = (state) => {
    const _state = {
        genderFilters: state.browse.genderFilters ?? [],
        ageFilters: state.browse.ageFilters ?? [],
        isLoading: state.browse.isLoading,
        showFilter: state.browse.showFilter,
        latValue: state.browse.latValue,
        lngValue: state.browse.lngValue,
        genderValue: state.browse.genderValue ?? 'All',
        ageValue: state.browse.ageValue ?? 'All',
        ageId: state.browse.ageId ?? 1,
        genderId: state.browse.genderId ?? 1,
        isNearby: state.browse.isNearby ?? false,
        isOnline: state.browse.isOnline ?? false,
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doLoadGenderFilters: () => dispatch(actLoadGenderFilters()),
        doLoadAgeFilters: () => dispatch(actLoadAgeFilters()),
        doSetAgeFilter: () => dispatch(actSetAgeFilter(age)),
        doToggleFilters: () => dispatch(actToggleFilters()),
        doToggleSearching: () => dispatch(actToggleSearching()),
        doSetIsOnline: () => dispatch(actSetIsOnline()),
        doSetIsNearby: () => dispatch(actSetIsNearby()),
        doSetGenderFilter: (genderId) => dispatch(actSetGenderFilter(genderId)),
        doSetAgeFilter: (age) => dispatch(actSetAgeFilter(age)),
        doSetLocation: (lat, lng) => dispatch(actSetLocation(lat, lng)),
        doResetFilter: () => dispatch(actResetFilter()),
        doFilterUsers: (offset, lat, lng, gender, age, online) => dispatch(actFilterUsers(offset, lat, lng, gender, age, online)),
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(BrowserHeaderComponent))
