import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Redirect } from 'react-router-dom';

import BtnRdy from '../components/game/BtnRdy';


/**  ---Current Player---
 * "idPlayer" is arr with 2 objects
 * 1st key: id current player, 
 * 2nd key: bool, checks at what address the player is 
 * */

 /**  ---Structure---
  * Game >                  create "idPlayer", (!)GameDisconnect/NotFound, (*)'F5/refresh', (1)(2)
  * BtnRdy >                who, bool for btnRdy, idPlayer, (1)(2)
  * Timer >                 allPlayers, btnsRdyHide, time, idPlayer, (!)GameOver + state, (*)'Back btn', (2), (s)
  * Player >                whenToStart, time, idPlayer, (3)'LAYOUT PLAYER'
  * MechanismGameButtons >  whenToStart, idPlayer, (1)(2), (s)
  * 
  * LEGEND:
  * (!) - Redirect MECHANISM
  * (*) - Case for Redirect MECHANISM
  * (s) - Sounds
  * (1) - REFERENCE TO SELECTED DATA IN FIREBASE
  * (2) - UPDATING DATA IN FIREBASE
  * (3) - MAIN REFERENCE TO FIREBASE
  * */

class Game extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            isInGame: [],
            disconnect: false
        }
    }

    componentDidMount() {
        this._isMounted = true;

        /** Redirect to GameDisconnect.js */
        window.onbeforeunload = function () {

            /** ---For a case: 'refresh/F5'--- */
            firebase.database().ref('/game').update({
                disconnect: true,
            })
            this.props.history.push('/gamedisconnect');

            /** ---For a case: 'Back Btn' --> looking to Timer.js--- */
        }


        /** Redirect to NotFound.js */
        if ( !this.props.location.state || this.props.location.state.validChars !== this.props.match.params.simpleValid ) {

            this.props.history.push('/*');
        } 


        /** Save disconnect bool from DB */
        firebase.database().ref('/game').on('value', snap => {
            
            const val = snap.val();
            if ( this._isMounted ) {
                this.setState({ disconnect: val.disconnect });
            }
        })

        /** Save current player from DB for valid */
        firebase.database().ref('/users').on('value', snap => {

            const val = snap.val();
            const usersValid = [];

            for (let key in val) {
                usersValid.push({
                    who: key,
                    validChars: val[key].validChars
                })
            }

            if ( this._isMounted ) {
                this.setState({ isInGame: usersValid }); 
            }
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    /** ---When 'disconnect === true' from Firebase---
     * 1.DropDB
     * 2.Redirect do GameDisconnect
     */
    redirectToGameDisconnect = (isMounted) => {
        if (isMounted) {

            firebase.database().ref('/users').remove();
            return <Redirect to='/gamedisconnect' />
        }
    }
    

    render() {
        const ID_URL = Number(this.props.match.params.userId);

        return (
            <div className="div-game">
            
                { this.state.disconnect && this.redirectToGameDisconnect( this._isMounted ) }

                {/* { this.redirectToNotFound( this._isMounted ) } */}
                
                <BtnRdy idPlayer={ [0, ID_URL === 0] } />
                <BtnRdy idPlayer={ [1, ID_URL === 1] } />
            </div>
        )
    }
}

export default Game;