import React from 'react';
import './BootSkeleton.scss';

export default function BootSkeleton() {
  return (
    <div class="skelton-boot">
      <div class="products-listing">
        <div class="top">
          <div class="single-full-image">
            <div class="single-full-image-skelton">
            </div>
          </div>
        </div>
        <div class="mid">
          <div class="two-lines">
            <div class="mid-right-skelton"></div>
            <div class="mid-right-skelton"></div>
          </div>
        </div>
        <div class="mid">
          <div class="two-lines">
            <div class="mid-right-skelton"></div>
            <div class="mid-right-skelton"></div>
          </div>
        </div>
        <div class="mid">
          <div class="two-lines">
            <div class="mid-right-skelton"></div>
            <div class="mid-right-skelton"></div>
          </div>
        </div>
        <div class="mid">
          <div class="two-lines">
            <div class="mid-right-skelton"></div>
            <div class="mid-right-skelton"></div>
          </div>
        </div>
      </div>
    </div>
  );
}