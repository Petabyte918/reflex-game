import React, { Component } from 'react';
import * as firebase from 'firebase';

import BtnRdy from '../components/game/BtnRdy';


/**  ---Current Player---
 * "idPlayer" is arr with 2 objects
 * 1st key: id current player, 
 * 2nd key: bool, checks at what address the player is 
 * */

 /**  ---Structure---
  * Test >                  create "idPlayer", RedirectToHomeMechanism
  * BtnRdy >                who, bool for btnRdy, idPlayer, (REFERENCE TO SELECTED DATA IN FIREBASE)
  * Timer >                 allPlayers, btnsRdyHide - whenToStart, time, idPlayer, RedirectToGameOver
  * Player >                whenToStart, time, idPlayer, (MAIN REFERENCE TO FIREBASE) + (LAYOUT PLAYER)
  * MechanismGameButtons >  whenToStart, idPlayer, selectedDataFromFirebase, (UPDATING DATA IN FIREBASE)
  * */

class Game extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            isInGame: [],
            disconnect: null
        }
        // this.closeBrowser = () => {
        //     this.dropDataBase();
        // }
    }

    componentDidMount() {
        this._isMounted = true;
        if ( !this._isMounted ) { return null; }

        firebase.database().ref('/users').on('value', snap => {

            const val = snap.val();
            const changeOnArr = this.changeOnArr( val, this._isMounted );
            this.redirectToHome( changeOnArr, this._isMounted );
            
            /** Test of memory leak */
            // console.log( 'Zaleznosc z przekierowaniem z this.props.history podczas dropDB. Przeciek pamieci, gdy null: ' + changeOnArr );
        })
    }

    componentDidUpdate() {
        if ( !this._isMounted ) { return null; }

        /** For a case where someone manually enters the address */
        firebase.database().ref('/users').on('value', snap => {

            const val = snap.val();
            const changeOnArr = this.changeOnArr( val, this._isMounted );
            this.redirectToHome( changeOnArr, this._isMounted );
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
        // window.removeEventListener('beforeunload', this.closeBrowser);
    }

    /** Remove all players & set disconnect in '/game' on true, when someone:
     * 1.refreshes(F5)
     * 2.press 'back' in browser - COS NIE TRYBI? ???????????????????????????????????/ */
    // dropDataBase = () => {
    //     firebase.database().ref('/game').update({ disconnect: true });
    //     firebase.database().ref('/users').remove();
    // }

    /** Redirect to: GameDisconnect */
    // redirectToGameDisconnect = bool => {

    //     if (bool === false) {
    //         return null;
    //     } else {
    //         this.props.history.push('/gamedisconnect');
    //     }
    // }

    changeOnArr = (val, isMounted) => {
        if (!isMounted || !val) { return null; }

        const returnArr = [];
        for ( let key in val) {
            returnArr.push({
                who: key,
                validChars: val[key].validChars
            })
        }

        return returnArr;
    }

    redirectToHome = (arr, isMounted) => {

        if (!isMounted) { return null; }

        const arrLength = arr ? arr.length : null;
        const { userId, simpleValid } = this.props.match.params;
        const { history } = this.props;

        if ( arrLength === null || (arrLength - 1 < Number(userId)) ) {

            return history.push('/gamedisconnect');
        } 
        else if (  arr[userId].validChars !== simpleValid ) {

            return history.push('/*');
        }
    }


    render() {
        const ID_URL = Number(this.props.match.params.userId);

        return (
            <div className="div-game">
                <BtnRdy idPlayer={ [0, ID_URL === 0] } />
                <BtnRdy idPlayer={ [1, ID_URL === 1] } />
            </div>
        )
    }
}

export default Game;