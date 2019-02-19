import React, { Component } from 'react';


class WhoWin extends Component {
    render() {
        let player1 = this.props.players[0];
        let player2 = this.props.players[1];

        let playerA = player1.points > player2.points ? player1 : player2;
        let playerB = player1.points < player2.points ? player1 : player2;
        let wasDraw = player1.points === player2.points ? true : false;

        return (
            <div className='game-winner'>
                {wasDraw
                    ? <div>
                        DRAW: <span className='text-winner'>{player1.nickname}</span> & <span className='text-winner'>{player2.nickname}</span>
                        <br />
                        SCORE: <span className='text-winner'>{player1.points}</span>
                    </div>

                    : <div>
                        WINNER: <span className='text-winner'>{playerA.nickname}</span> SCORE: <span className='text-winner'>{playerA.points}</span>
                        <br />
                        looser: <span className='text-looser'>{playerB.nickname}</span> score: <span className='text-looser'>{playerB.points}</span>
                    </div>
                }
            </div>
        );
    }
}

export default WhoWin;