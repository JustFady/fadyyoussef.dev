import React from 'react';

const Globe = () => {
  return (
    <div className="globe-scene">
      <div className="globe-halo" />

      <div className="globe-orbit orbit-large">
        <span />
      </div>
      <div className="globe-orbit orbit-mid">
        <span />
      </div>
      <div className="globe-orbit orbit-small">
        <span />
      </div>

      <div className="globe-sphere">
        <div className="globe-latitude latitude-top" />
        <div className="globe-latitude latitude-mid" />
        <div className="globe-latitude latitude-low" />

        <div className="globe-longitude longitude-left" />
        <div className="globe-longitude longitude-mid" />
        <div className="globe-longitude longitude-right" />

        <div className="signal signal-one" />
        <div className="signal signal-two" />
      </div>

      <div className="globe-caption">
        <p>Spokane, Washington</p>
        <span>Gonzaga University</span>
      </div>
    </div>
  );
};

export default Globe;
