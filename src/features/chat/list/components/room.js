/*
 * Created by Justice on Wed Jan 27 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import { withTheme, Card } from 'react-native-paper'
import { styles } from './style'

import detailIcon from 'app/assets/detailIcon.png'
import groupIcon from 'app/assets/stat3.png'

import chatIcon from 'app/assets/dialogs.png';
import chatIconNotif from 'app/assets/dialogs-notif.png';

class RoomItemComponent extends Component {

    render() {
        const { chatRoom, roomChanges } = this.props
        const { colors, fonts } = this.props.theme
        const totalDesc = chatRoom.totalDesc ?? chatRoom.total
        const displayAvatars = chatRoom.avatars.length != 0
        const hasRoomChange = roomChanges?.roomId == chatRoom.id ? (roomChanges?.withChanges ?? false) : false

        return (
            <Card style={styles.cardCont}>
                <TouchableOpacity style={styles.cardTouchCont} onPress={this.tapRoom}>
                    <View style={styles.cardFirstRow}>
                        <Image source={hasRoomChange == true ? chatIconNotif : chatIcon} style={styles.commentIcon} />
                    </View>
                    <View style={styles.cardSecondRow}>
                        <Text style={{ fontFamily: fonts.bold, color: colors.dark, ...styles.roomTitle }}>
                            {chatRoom.name}
                        </Text>
                        <Image source={groupIcon} style={styles.groupIcon} />
                        <Text style={{ fontFamily: fonts.regular, color: colors.dark, ...styles.countTitle }}>
                            {totalDesc}
                        </Text>
                        {/* {displayAvatars == true &&
                            this.renderAvatars()
                        } */}
                    </View>
                    <View style={styles.cardThirdRow}>
                        <Image source={detailIcon} style={styles.detailIcon} />
                    </View>
                </TouchableOpacity>
            </Card>
        )
    }

    renderAvatars = () => {
        const { chatRoom } = this.props
        // display first 3 avatars only
        const avatars = (chatRoom.avatars ?? []).slice(0, 3)

        return (
            <View style={{ flexDirection: 'row' }}>
                {avatars.map((item, index) =>
                    <Image
                        style={index == 0
                            ? styles.avatarFront
                            : {
                                ...styles.avatarBack,
                                marginLeft: index == 1 ? 22 : 44,
                                zIndex: index == 1 ? 3 : 1
                            }
                        }
                        source={{ uri: item }}
                    />
                )}
            </View>
        )
    }

    tapRoom = () => {
        const { chatRoom } = this.props
        this.props.navigation.navigate('ChatThreadComponent', { chatRoom, roomId: chatRoom.id })
    }
}

const mapStateToProps = (state, ownProps) => {
    const _state = {

    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,

    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(RoomItemComponent))