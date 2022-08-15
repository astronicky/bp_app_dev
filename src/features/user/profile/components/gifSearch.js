/*
 * Created by Justice on Mon Dec 14 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { GifSearch, poweredByGiphyLogoGrey } from 'react-native-gif-search'
import { withTheme } from 'react-native-paper'

import { actAttachGifUrl } from '../actions/index'

class ProfileGifSearchComponent extends Component {
    render() {
        const { colors, fonts } = this.props.theme
        return (
            <GifSearch
                giphyApiKey={'mabAg3mppm4zRFGRTbwKxXq9zOiD3nmd'}
                onGifSelected={(gif_url) => { this.tapGif(gif_url) }}
                style={{ backgroundColor: colors.backgroundColor, height: 300 }}
                textInputStyle={{ fontFamily: fonts.semiBold, color: colors.dark }}
                loadingSpinnerColor={'black'}
                placeholderTextColor={'grey'}
                numColumns={3}
                visible={true}
                provider={"giphy"}
                providerLogo={poweredByGiphyLogoGrey}
                showScrollBar={false}
                noGifsFoundText={"No Gifs found :("}
            />
        )
    }

    tapGif = (url) => {
        const postId = this.props.route.params?.postId ?? undefined
        // store selection
        this.props.doAttachGifUrl(url, postId)
        // and immediately clear it
        setTimeout(() => {
            this.props.doAttachGifUrl(undefined, undefined)
        }, 0.5);
        // and exit the picker
        this.props.navigation.pop()
    }
}

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doAttachGifUrl: (url, postId) => dispatch(actAttachGifUrl(url, postId))
    };

    return _action;
};

export default connect(null, mapDispatchToProps)(withTheme(ProfileGifSearchComponent))
