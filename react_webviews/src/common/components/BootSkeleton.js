import React from 'react';
import './BootSkeleton.scss';

export default function BootSkeleton() {
  return (
    <div className="skelton-boot">
      <div className="products-listing">
        <div className="top">
          <div className="single-full-image">
            <div className="single-full-image-skelton">
            </div>
          </div>
        </div>
        <div className="mid">
          <div className="two-lines">
            <div className="mid-right-skelton"></div>
            <div className="mid-right-skelton"></div>
          </div>
        </div>
        <div className="mid">
          <div className="two-lines">
            <div className="mid-right-skelton"></div>
            <div className="mid-right-skelton"></div>
          </div>
        </div>
        <div className="mid">
          <div className="two-lines">
            <div className="mid-right-skelton"></div>
            <div className="mid-right-skelton"></div>
          </div>
        </div>
        <div className="mid">
          <div className="two-lines">
            <div className="mid-right-skelton"></div>
            <div className="mid-right-skelton"></div>
          </div>
        </div>
      </div>
    </div>
  );
}