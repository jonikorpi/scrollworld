import React from "react";
import World from "./World";
import GameUI from "./GameUI";
import PlayerUI from "./PlayerUI";
import Vision from "./Vision";
import Memory from "./Memory";
import { rules } from "../shared/helpers.js";

const calculateTurn = (startedAt, when = Date.now()) => {
  return Math.floor(
    Math.max(0, (when - startedAt) / rules.secondsPerTurn / 1000)
  );
};

export default class Clock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      turn: 0,
    };
  }

  componentDidMount() {
    this.timer = setInterval(this.refreshTurn, 6 * 1000 / 60);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  refreshTurn = () => {
    const currentTurn = Math.floor(calculateTurn(this.props.startedAt));

    if (currentTurn !== this.state.turn) {
      this.setState({
        turn: currentTurn,
      });
    }
  };

  render() {
    const { turn } = this.state;
    const { playerCount, player, startedAt } = this.props;
    const { mana, lastUsedManaAt } = player;

    const worldLength = playerCount * rules.plateLength;

    return [
      <World key="World" worldLength={worldLength}>
        <Vision turn={turn} worldLength={worldLength} {...this.props} />
        <Memory turn={turn} worldLength={worldLength} {...this.props} />
      </World>,
      <GameUI key="GameUI" turn={turn} startedAt={startedAt} />,
      <PlayerUI
        key="PlayerUI"
        mana={
          calculateTurn(startedAt, lastUsedManaAt) === turn
            ? mana
            : rules.maxMana
        }
      />,
    ];
  }
}
