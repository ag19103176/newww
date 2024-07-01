import React, { useState, useEffect } from "react";
import axios from "axios";
import DataModeComponent from "./DataMode";
import DisplayModeComponent from "./DisplayPieMode";
import DisplayBarModeComponent from "./DisplayBarMode";
import SumDisplay from "./sumDisplay";
import Axes from "./CommonAxes";
import "./dataDisplay.css";

const DataDisplayComponent = ({
  selectedSource,
  handleDimension,
  handleMeasure,
  setDimen,
  setMea,
  type,
  handlelegend,
  legendedit,
  handleTotal,
  setTot,
  setDim,
  handleSelectPercentage,
  selectPercentage,
  handleslicePercentage,
  setSlice,
  handlegoalLineToggle,
  setGoal,
  handlegoalValue,
  setgoalValue,
  handlegoalLabel,
  setGoalLabel,
  handleShowValues,
  setshowvalues,
  handleshowradio,
  setradioshow,
  xAxisShowLabel,
  handleShowLabel,
  yAxisShowLabel,
  handleyShowLabel,
  xAxisLabel,
  handleChangeLabel,
  yAxisLabel,
  handleyChangeLabel,
  setxradioshow,
  handleRadioAngle,
  setyradioshow,
  handleyRadioAngle,
}) => {
  const [mode, setMode] = useState("");
  const [dimensions, setDimensions] = useState([]);
  const [measures, setMeasures] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        var response = await axios.get("http://localhost:8000/api/getAllData", {
          params: { chartSource: selectedSource },
        });
        const fItem = response.data[0];
        const keys = Object.keys(fItem);
        const mens = [];
        const meas = [
          "root_parent_id",
          "parent_id",
          "deleted_at",
          "ready_for_sync",
          "created_user_id",
          "updated_user_id",
          "is_active",
          "is_deleted",
          "skip_level",
          "is_prospect",
        ];
        keys.forEach((key) => {
          const value = fItem[key];
          if (typeof value === "number" || typeof value === "boolean") {
            mens.push(key);
          } else if (typeof value === "string" && !isNaN(value)) {
            mens.push(key);
          }
        });
        setDimensions(keys);
        setMeasures(meas);
      } catch (error) {
        console.error("Error fetching columns: ", error);
      }
    };

    fetchData();
  }, [selectedSource]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleDimensionChange = (value) => {
    // setSelectedDimension(value);
    handleDimension(value);
  };

  const handleMeasureChange = (value) => {
    handleMeasure(value);
    // setSelectedMeasure(value);
  };
  const handlelegendChange = (value) => {
    // console.log("Legend", value);
    handlelegend(value);
  };
  const handleTotalChange = (value) => {
    // console.log("in display total ", value);
    handleTotal(value);
  };
  const handleselectPercentage = (value) => {
    // console.log("handleselectPercentage", value);
    handleSelectPercentage(value);
  };
  const selectSlicePercentage = (value) => {
    handleslicePercentage(value);
  };
  const handleGoalLineToggle = (value) => {
    handlegoalLineToggle(value);
  };
  const handleshowlabel = (value) => {
    handleShowLabel(value);
  };
  const handleyshowlabel = (value) => {
    handleyShowLabel(value);
  };
  const handlechangelabel = (value) => {
    handleChangeLabel(value);
  };
  const handleychangelabel = (value) => {
    handleyChangeLabel(value);
  };
  const handleradioangle = (value) => {
    handleRadioAngle(value);
    console.log("sss", value);
  };
  const handleyradioangle = (value) => {
    handleyRadioAngle(value);
  };
  const handleGoalValue = (value) => {
    handlegoalValue(value);
  };
  const handleGoalLabel = (value) => {
    handlegoalLabel(value);
  };
  const handleshowValues = (value) => {
    handleShowValues(value);
  };
  const handleRadioShowValues = (value) => {
    console.log("hondle show value", value);
    handleshowradio(value);
  };
  return (
    <div className="container">
      <div className="button-container">
        <button
          className="data-display"
          onClick={() => handleModeChange("data")}
        >
          Data
        </button>
        <button
          className="data-display"
          onClick={() => handleModeChange("display")}
        >
          Display
        </button>
        {type !== "1" && (
          <button
            className="data-display"
            onClick={() => handleModeChange("axes")}
          >
            Axes
          </button>
        )}
      </div>
      {mode === "data" && dimensions && dimensions.length > 0 && (
        <div className="select-container">
          <DataModeComponent
            dimensions={dimensions}
            measures={measures}
            setDimen={setDimen}
            setMea={setMea}
            handleDimensionChange={handleDimensionChange}
            handleMeasureChange={handleMeasureChange}
            type={type}
            preDim={setDim}
          />
        </div>
      )}
      {mode === "display" && (
        <>
          {type === "1" && (
            <DisplayModeComponent
              handlelegendChange={handlelegendChange}
              handleTotalChange={handleTotalChange}
              legend={legendedit}
              setTot={setTot}
              selectPercentage={handleselectPercentage}
              setSelPer={selectPercentage}
              selectSlicePercentage={selectSlicePercentage}
              setSlice={setSlice}
            />
          )}
          {(type === "2" || type === "line") && (
            <DisplayBarModeComponent
              handleGoalLineToggle={handleGoalLineToggle}
              setGoal={setGoal}
              handleGoalValue={handleGoalValue}
              setgoalValue={setgoalValue}
              handleGoalLabel={handleGoalLabel}
              setGoalLabel={setGoalLabel}
              handleshowValues={handleshowValues}
              setshowvalues={setshowvalues}
              handleRadioShowValues={handleRadioShowValues}
              setradioshow={setradioshow}
            />
          )}
          {(type === "3" || type === "line") && (
            <DisplayBarModeComponent
              handleGoalLineToggle={handleGoalLineToggle}
              setGoal={setGoal}
              handleGoalValue={handleGoalValue}
              setgoalValue={setgoalValue}
              handleGoalLabel={handleGoalLabel}
              setGoalLabel={setGoalLabel}
              handleshowValues={handleshowValues}
              setshowvalues={setshowvalues}
              handleRadioShowValues={handleRadioShowValues}
              setradioshow={setradioshow}
            />
          )}
          {type === "4" && <SumDisplay dimensions={measures} />}
        </>
      )}
      {mode === "axes" && (
        <>
          {(type === "2" || type === "line") && (
            <Axes
              xAxisShowLabel={xAxisShowLabel}
              handleshowlabel={handleshowlabel}
              yAxisShowLabel={yAxisShowLabel}
              handleyshowlabel={handleyshowlabel}
              xAxisLabel={xAxisLabel}
              handlechangelabel={handlechangelabel}
              yAxisLabel={yAxisLabel}
              handleychangelabel={handleychangelabel}
              setxradioshow={setxradioshow}
              handleradioangle={handleradioangle}
              setyradioshow={setyradioshow}
              handleyradioangle={handleyradioangle}
            />
          )}
          {(type === "3" || type === "line") && (
            <Axes
              xAxisShowLabel={xAxisShowLabel}
              handleshowlabel={handleshowlabel}
              yAxisShowLabel={yAxisShowLabel}
              handleyshowlabel={handleyshowlabel}
              xAxisLabel={xAxisLabel}
              handlechangelabel={handlechangelabel}
              yAxisLabel={yAxisLabel}
              handleychangelabel={handleychangelabel}
              setxradioshow={setxradioshow}
              handleradioangle={handleradioangle}
              setyradioshow={setyradioshow}
              handleyradioangle={handleyradioangle}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DataDisplayComponent;
