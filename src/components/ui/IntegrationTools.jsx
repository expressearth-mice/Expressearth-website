import React from "react";
import "./IntegrationTools.css";

// Images
import imageOne from "../../assests/1.png";
import imageTwo from "../../assests/2.png";
import imageThree from "../../assests/3.png";
import imageFour from "../../assests/4.png";
import imageFive from "../../assests/5.png";
import imageSix from "../../assests/6.png";
import imageSeven from "../../assests/7.png";
import imageEight from "../../assests/8.png";
import imageNine from "../../assests/9.png";
import imageTen from "../../assests/10.png";

import imageEleven from "../../assests/11.png";
import imageTwelve from "../../assests/12.png";
import imageThirteen from "../../assests/13.png";
import imageFourteen from "../../assests/14.png";
import imageFifteen from "../../assests/15.png";
import imageSixteen from "../../assests/16.png";
import imageSeventeen from "../../assests/17.png";
import imageEighteen from "../../assests/18.png";
import imageNineteen from "../../assests/19.png";
import imageTwenty from "../../assests/20.png";

import imageTwentyOne from "../../assests/21.png";
import imageTwentyTwo from "../../assests/22.png";
import imageTwentyThree from "../../assests/23.png";
import imageTwentyFour from "../../assests/24.png";
import imageTwentyFive from "../../assests/25.png";
import imageTwentySix from "../../assests/26.png";
import imageTwentySeven from "../../assests/27.png";
import imageTwentyEight from "../../assests/28.png";
import imageTwentyNine from "../../assests/29.png";
import imageThirty from "../../assests/30.png";

import imageThirtyOne from "../../assests/31.png";
import imageThirtyTwo from "../../assests/32.png";
import imageThirtyThree from "../../assests/33.png";
import imageThirtyFour from "../../assests/34.png";
import imageThirtyFive from "../../assests/35.png";

const IntegrationTools = () => {
  const tools = [
    imageOne,
    imageTwo,
    imageThree,
    imageFour,
    imageFive,
    imageSix,
    imageSeven,
    imageEight,
    imageNine,
    imageTen,
    imageEleven,
    imageTwelve,
    imageThirteen,
    imageFourteen,
    imageFifteen,
    imageSixteen,
    imageSeventeen,
    imageEighteen,
    imageNineteen,
    imageTwenty,
    imageTwentyOne,
    imageTwentyTwo,
    imageTwentyThree,
    imageTwentyFour,
    imageTwentyFive,
    imageTwentySix,
    imageTwentySeven,
    imageTwentyEight,
    imageTwentyNine,
    imageThirty,
    imageThirtyOne,
    imageThirtyTwo,
    imageThirtyThree,
    imageThirtyFour,
    imageThirtyFive,
  ];

  return (
    <div className="integration-tools-container">
      <div className="integration-header">
        <h1>Trusted by companies like</h1>
      </div>

      <div className="scroll-wrapper">
        <div className="scroll-track">
          {tools.concat(tools).map((logo, index) => (
            <div key={index} className="tool-card">
              <img src={logo} alt={`tool-${index}`} className="tool-logo" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntegrationTools;
