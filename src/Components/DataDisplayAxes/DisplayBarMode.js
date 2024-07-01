import React from "react";

const DisplayBarMode = ({
  handleGoalLineToggle,
  setGoal,
  handleGoalValue,
  setgoalValue,
  handleGoalLabel,
  setGoalLabel,
  handleshowValues,
  setshowvalues,
  handleRadioShowValues,
  setradioshow,
}) => {
  console.log("in dataBar", setradioshow);
  const displayOptions = ["Some", "All"];
  return (
    <div className="display-section">
      <div className="legend">
        <label className="label">Goal Line</label>
        <label className="switch">
          <input
            type="checkbox"
            checked={setGoal}
            onChange={(e) => handleGoalLineToggle(e.target.checked)}
          />
          <span className="slider round"></span>
        </label>
      </div>

      {setGoal && (
        <>
          <div>
            <div>
              <label>Goal Value</label>
            </div>
            <div>
              <input
                type="number"
                value={setgoalValue}
                onChange={(e) => handleGoalValue(e.target.value)}
              />
            </div>
          </div>
          {/* <div>
            <div>
              <label>Goal Label</label>
            </div>
            <div>
              <input
                type="text"
                value={setGoalLabel}
                onChange={(e) => handleGoalLabel(e.target.value)}
              />
            </div>
          </div> */}
        </>
      )}

      <div className="legend">
        <label className="label">Show values on data points</label>
        <label className="switch">
          <input
            type="checkbox"
            checked={setshowvalues}
            onChange={(e) => handleshowValues(e.target.checked)}
          />
          <span className="slider round"></span>
        </label>
      </div>

      {setshowvalues && (
        <>
          <div>
            <div>
              <label>Value to Show</label>
            </div>
            <div>
              {displayOptions.map((option, index) => (
                <div key={index}>
                  <input
                    type="radio"
                    id={index}
                    name="displayOption"
                    value={option}
                    checked={setradioshow === option}
                    onChange={(e) => handleRadioShowValues(e.target.value)}
                  />
                  <label>{option}</label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DisplayBarMode;
