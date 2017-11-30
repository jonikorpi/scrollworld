import React from "react";
import { connect } from "react-firebase";

import UnitWrapper from "./UnitWrapper";

class UnitListFetcher extends React.PureComponent {
  render() {
    const { unitIDs, userID, isDevelopment } = this.props;
    const locationList = unitIDs && Object.keys(unitIDs);

    return (
      <div className="units">
        {locationList.length > 0
          ? locationList
              .filter(locationID => unitIDs[locationID])
              .map(locationID => (
                <UnitWrapper
                  key={unitIDs[locationID]}
                  userID={userID}
                  unitID={unitIDs[locationID]}
                  isDevelopment={isDevelopment}
                />
              ))
          : null}
      </div>
    );
  }
}

export default connect(
  (props, ref) => {
    const { vision } = props;

    return vision
      ? Object.keys(vision).reduce((mapping, locationID) => {
          if (vision[locationID].trueSight > 0) {
            mapping[locationID] = `locations/${locationID}/unit/ID`;
          }

          return mapping;
        }, {})
      : {};
  },
  (ownProps, firebaseProps) => ({
    ...ownProps,
    unitIDs: firebaseProps,
  })
)(UnitListFetcher);