import React, { useEffect, useState } from "react";
import axios from "axios";
import PieChart from "./Components/Graph/pieChart.js";
import DataDisplayComponent from "./Components/DataDisplayAxes/CommonDisplay.js";
import BarChart from "./Components/Graph/barChart.js";
import LineChart from "./Components/Graph/lineChart.js";
import Loader from "./Components/Loader/loader.js";
import Sum from "./Components/DataDisplayAxes/sum.js";
import { Responsive, WidthProvider } from "react-grid-layout";
import "./App.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import SumDisplay from "./Components/DataDisplayAxes/sumDisplay.js";
const mongoose = require("mongoose");

const ResponsiveReactGridLayout = WidthProvider(Responsive);

function App() {
  const sources = [
    { name: "customers" },
    { name: "invoices" },
    { name: "ticket" },
  ];
  const basic = [
    { name: "graph", identificationId: 1 },
    { name: "numeric", identificationId: 2 },
  ];
  const structures = [
    { name: "Pie Graph", id: 1 },
    { name: "Bar Graph", id: 2 },
    { name: "Line Graph", id: 3 },
  ];
  const abc = [
    { name: "Sum", id: 1 },
    { name: "avg", id: 2 },
  ];
  const xyz = [
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

  const [selectedSource, setSelectedSource] = useState("");
  const [dim, setDim] = useState("");
  const [measure, setMeasure] = useState("");
  const [type, setType] = useState("");
  const [displayGraph, setDisplayGraph] = useState([]);
  const [graph, setGraph] = useState(false);
  const [addButton, setAddButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [graphEdit, setGraphEdit] = useState(false);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [legend, setLegend] = useState(false);
  const [total, setTotal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [layout, setLayout] = useState([]);
  const [isDraggable, setIsDraggable] = useState(false);
  const [objid, setObjid] = useState("");

  const [selectPercentage, setSelectPercentage] = useState("");
  const [slicePercentage, setSlicePercentage] = useState("");
  const [goalLine, setGoalLine] = useState(false);
  const [showValues, setShowValues] = useState(false);
  const [goalValue, setGoalValue] = useState("");
  const [goalLabel, setGoalLabel] = useState("");
  const [valueToShow, setRadioshowValues] = useState("");
  const [identify, setIdentify] = useState("");
  const [sum, setSum] = useState();
  const [showLabel, setShowLabel] = useState(true);
  const [yShowLabel, setyShowLabel] = useState(true);
  const [xlabel, setxLabel] = useState("");
  const [yLabel, setyLabel] = useState("");
  const [showLineAndMarks, setshowLineAndMarks] = useState("");
  const [yshowLineAndMarks, setyshowLineAndMarks] = useState("");
  const handleRefreshClick = (val) => {
    setTimeout(() => {
      setGraph(!graph);
    }, val * 60 * 1000);
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/api/getGraph");
        const data = response.data;
        console.log("dataaa", data);
        // console.log(data[0].graph);
        // let id = data[0]._id;
        // console.log(id);
        setObjid(() => data[0]._id); // TODO
        setDisplayGraph(data[0].graph);
        // console.log(_Objid);
      } catch (error) {
        console.log("error in app js ", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [graph]);

  const handleEdit = async (graphData) => {
    // e.preventDefault();
    console.log("abc", graphData);
    setLoading(true);
    setSelectedSource(graphData.chartSource);
    setDim(graphData.field1);
    setMeasure(graphData.field2);
    setType(graphData.chartType);
    setId(graphData._id);
    // console.log("Edit Legend", graphData.chartElements.pieChart.legend);
    if (graphData.chartType === "1") {
      setLegend(graphData.chartElements.pieChart.legend);
      // console.log("Edit Legend", graphData.chartElements.pieChart.legend);
      setTotal(graphData.chartElements.pieChart.total);
      setSelectPercentage(graphData.chartElements.pieChart.selectPercentage);
      setSlicePercentage(graphData.chartElements.pieChart.minSlicePercentage);
    } else {
      setGoalLine(graphData.chartElements.barLineChart.goalLine);
      setGoalValue(graphData.chartElements.barLineChart.goalValue);
      setGoalLabel(graphData.chartElements.barLineChart.goalLabel);
      setShowValues(graphData.chartElements.barLineChart.showValues);
      setRadioshowValues(graphData.chartElements.barLineChart.valueToShow);
      setShowLabel(graphData.chartElements.barLineChart.showLabel);
      setyShowLabel(graphData.chartElements.barLineChart.yShowLabel);
      setxLabel(graphData.chartElements.barLineChart.xlabel);
      setyLabel(graphData.chartElements.barLineChart.yLabel);
      setshowLineAndMarks(
        graphData.chartElements.barLineChart.showLineAndMarks
      );
      setyshowLineAndMarks(
        graphData.chartElements.barLineChart.yshowLineAndMarks
      );
    }
    setShowModal(true);
    setAddButton(true);
    setGraphEdit(true);
    setLoading(false);
  };
  // console.log(_Objid);
  const handleGenerateGraphClick = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/getGroup", {
        params: {
          chartSource: selectedSource,
          field1: dim,
          field2: measure,
        },
      });
      console.log(response.data.data);

      const dataLabel = response.data.data.map((item) => ({
        label: item.label === null ? "nolabel" : item.label,
        value: item.value === null ? "1" : item.value,
      }));
      const requestData = {
        chartSource: selectedSource,
        json_data: dataLabel,
        chartBasic: identify,
        chartType: type,
        field1: dim,
        field2: measure,
        position: layout,
        chartElements: {},
      };
      if (type === "1") {
        requestData.chartElements = {
          pieChart: {
            legend: legend,
            total: total,
            selectPercentage: selectPercentage,
            minSlicePercentage: slicePercentage,
          },
        };
      } else if (type === "2" && type === "3") {
        requestData.chartElements = {
          barLineChart: {
            goalLine: goalLine,
            goalValue: goalValue,
            // goalLabel: goalLabel,
            showValues: showValues,
            valueToShow: valueToShow,
            showLabel: showLabel,
            // xlabel: xlabel,
            showLineAndMarks: showLineAndMarks,
            yShowLabel: yShowLabel,
            // yLabel: yLabel,
            yshowLineAndMarks: yshowLineAndMarks,
          },
        };
      }
      console.log(requestData);
      if (dataLabel.length) {
        if (id.startsWith("tempId")) {
          const newId = mongoose.Types.ObjectId();
          requestData._id = newId;
          await axios.patch("http://localhost:8000/api/saveGraph", requestData);
        } else {
          await axios.patch("http://localhost:8000/api/saveGraph", requestData);
        }
      }

      setGraph(!graph);
      setShowModal(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleGenerateCount = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/getSum?chartSource=customers&field1=${dim}`
      );
      console.log(dim);

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const res = await response.json();
      setSum(res.data[0].totalSum);
      console.log("in sum display", res.data[0].totalSum);
      setGraph(!graph);
    } catch (err) {
      console.error("Error fetching sum:", err);
    }
  };

  const handleGenerateEditGraph = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/getGroup", {
        params: {
          chartSource: selectedSource,
          field1: dim,
          field2: "id",
        },
      });
      const dataLabel = response.data.data.map((item) => ({
        label: item.label === null ? "nolabel" : item.label,
        value: item.value === null ? "1" : item.value,
      }));
      const updatedData = {
        chartSource: selectedSource,
        json_data: dataLabel,
        chartBasic: identify,
        chartType: type,
        field1: dim,
        field2: measure,
        position: layout,
        chartElements: {},
      };
      if (type === "1") {
        updatedData.chartElements = {
          pieChart: {
            legend: legend,
            total: total,
            selectPercentage: selectPercentage,
            minSlicePercentage: slicePercentage,
          },
        };
      } else if (type === "2" && type === "3") {
        updatedData.chartElements = {
          barLineChart: {
            goalLine: goalLine,
            goalValue: goalValue,
            // goalLabel: goalLabel,
            showValues: showValues,
            valueToShow: valueToShow,
            showLabel: showLabel,
            // xlabel: xlabel,
            showLineAndMarks: showLineAndMarks,
            yShowLabel: yShowLabel,
            // yLabel: yLabel,
            yshowLineAndMarks: yshowLineAndMarks,
          },
        };
      }
      await axios.patch(
        `http://localhost:8000/api/updateGraph/${objid}/${id}`,
        updatedData
        // layout
      );
      setId("");
      setShowModal(false);
      setAddButton(false);
      setLegend(false);
      setTotal(false);
      setSelectPercentage("");
      setSlicePercentage("");
      setGoalLine(false);
      setRadioshowValues("");
      setGoalValue("");
      setShowValues(false);
      setGoalLabel("");
      setShowLabel(true);
      setyShowLabel(true);
      setxLabel("");
      setyLabel("");
      setshowLineAndMarks("");
      setyshowLineAndMarks("");
      setGraph(!graph);
    } catch (error) {
      console.error("Error updating graph:", error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    // console.log("Delete button clicked for ID:", id);
    setLoading(true);
    try {
      await axios.patch(`http://localhost:8000/api/deleteGraph/${objid}`, {
        id: id,
      });

      setGraph(!graph);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleSourceChange = (value) => {
    setSelectedSource(value);
  };

  const handleDimension = (value) => {
    setDim(value);
  };
  const handleMeasure = (value) => {
    setMeasure(value);
  };

  const selectGraph = (e) => {
    setType(e.target.value);
  };
  const selectIdentify = (e) => {
    setIdentify(e.target.value);
  };
  const handleAddButton = () => {
    setLoading(true);
    setAddButton(true);
    setShowModal(true);
    setGraphEdit(false);
    setSelectedSource("");
    setDim("");
    setMeasure("");
    setType("");
    setLegend(false);
    setTotal(false);
    setSelectPercentage("");
    setSlicePercentage("");
    setGoalLine(false);
    setRadioshowValues("");
    setGoalValue("");
    setShowValues(false);
    setGoalLabel("");
    setShowLabel(true);
    setyShowLabel(true);
    setxLabel("");
    setyLabel("");
    setshowLineAndMarks("");
    setyshowLineAndMarks("");

    // Generate temporary ID for new graph
    // setDisplayGraph([
    //   ...displayGraph,
    //   { chartSource: "", json_data: [], chartType: "", field1: "", field2: "" },
    // ]);

    setLoading(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const onLayoutChange = (newLayout, id) => {
    setLayout(newLayout);
    saveLayoutToBackend(objid, id);
    console.log("Layout changed:", layout);
  };

  const minWidth = 2;
  const minHeight = 4;
  const maxWidth = 7;
  const maxHeight = 7;

  const generateLayout = (graphs) => {
    return graphs.map((graph, index) => ({
      i: graph.id?.toString() || index.toString(),
      x: (index % 4) * 3,
      y: Math.floor(index / 4) * 5,
      w: graph.chartType === `2` ? 5 : 3,
      // w: 3,
      h: 5.8,
      minW: minWidth,
      minH: minHeight,
      maxW: maxWidth,
      maxH: maxHeight,
    }));
  };
  const saveLayoutToBackend = async (objid, id) => {
    try {
      console.log("in saveee ", layout);
      const updatedGraphs = layout.map((item) => ({
        _id: id,
        layout: {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
        },
      }));

      // console.log("ssss", objid);

      // // Make a PATCH request to your backend API to update graph positions
      // await axios.patch(
      //   `http://localhost:8000/api/updateGraphPositions/${objid}`,
      //   { id: id, updatedGraphs }
      // );
      // console.log("Layout saved:", layout);
    } catch (error) {
      console.error("Error saving layout:", error);
    }
  };
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleDragDrop = () => {
    setIsDraggable(!isDraggable);
  };
  const handlelegend = (value) => {
    setLegend(value);
  };
  const handleTotal = (value) => {
    setTotal(value);
  };
  const handleSelectPercentage = (value) => {
    setSelectPercentage(value);
  };
  const handleslicePercentage = (value) => {
    console.log("in app setSlice", value);
    setSlicePercentage(value);
  };
  const handlegoalLineToggle = (value) => {
    setGoalLine(value);
  };
  const handleShowLabel = (value) => {
    setShowLabel(value);
  };
  const handleyShowLabel = (value) => {
    setyShowLabel(value);
  };
  const handleChangeLabel = (value) => {
    setxLabel(value);
  };
  const handleyChangeLabel = (value) => {
    setyLabel(value);
  };
  const handleRadioAngle = (value) => {
    setshowLineAndMarks(value);
  };
  const handleyRadioAngle = (value) => {
    setyshowLineAndMarks(value);
  };
  const handlegoalValue = (value) => {
    setGoalValue(value);
  };
  const handlegoalLabel = (value) => {
    setGoalLabel(value);
  };
  const handleShowValues = (value) => {
    setShowValues(value);
  };
  const handleshowradio = (value) => {
    setRadioshowValues(value);
  };
  return (
    <div className="App">
      {loading && <Loader />}
      <div className="main-box">
        <div className="control-panel">
          <div className="control-row">
            <button className="add-button" onClick={handleAddButton}>
              + ADD GRAPH
            </button>

            <select
              className="form-control select-class input"
              style={{ width: "15%" }}
              defaultValue="0"
              onChange={(e) => handleRefreshClick(e.target.value)}
            >
              <option value={0} disabled>
                Select Time to Refresh
              </option>
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
            </select>

            <label className="label rearrange">Resize/Rearrange</label>
            <label className="switch">
              <input
                type="checkbox"
                onChange={handleToggleDragDrop}
                checked={isDraggable}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        {addButton && showModal && (
          <div className="box">
            <div className="modal-container">
              <div className="modal-content">
                <select
                  id="ddlOptions1"
                  className="form-control select-class input"
                  value={selectedSource}
                  onChange={(e) => handleSourceChange(e.target.value)}
                >
                  <option value="" disabled>
                    Select Source
                  </option>
                  {sources.map((option, index) => (
                    <option key={index} value={option.name} className="option">
                      {option.name}
                    </option>
                  ))}
                </select>
                <select
                  id="ddlOptions3"
                  className="form-control select-class input"
                  value={identify}
                  onChange={selectIdentify}
                >
                  <option value="" disabled>
                    Select types
                  </option>
                  {basic.map((option, index) => (
                    <option
                      key={index}
                      value={option.identificationId}
                      className="option"
                    >
                      {option.name}
                    </option>
                  ))}
                </select>
                {identify === "1" && (
                  <select
                    id="ddlOptions2"
                    className="form-control select-class input"
                    value={type}
                    onChange={selectGraph}
                  >
                    <option value="" disabled>
                      Select Graph
                    </option>
                    {structures.map((option, index) => (
                      <option key={index} value={option.id} className="option">
                        {option.name}
                      </option>
                    ))}
                  </select>
                )}
                {identify === "2" && (
                  <select
                    id="ddlOptions2"
                    className="form-control select-class input"
                    value={type}
                    onChange={selectGraph}
                  >
                    <option value="" disabled>
                      Select Graph
                    </option>
                    {abc.map((option, index) => (
                      <option key={index} value={option.id} className="option">
                        {option.name}
                      </option>
                    ))}
                  </select>
                )}

                <div>
                  {["customers", "ticket", "invoices"].map(
                    (source, index) =>
                      selectedSource === source &&
                      identify === "1" && (
                        <DataDisplayComponent
                          key={index}
                          type={type}
                          handleDimension={handleDimension}
                          handleMeasure={handleMeasure}
                          setDimen={dim}
                          setMea={measure}
                          selectedSource={selectedSource}
                          handlelegend={handlelegend}
                          legendedit={legend}
                          handleTotal={handleTotal}
                          setTot={total}
                          setDim={dim}
                          handleSelectPercentage={handleSelectPercentage}
                          selectPercentage={selectPercentage}
                          handleslicePercentage={handleslicePercentage}
                          setSlice={slicePercentage}
                          handlegoalLineToggle={handlegoalLineToggle}
                          setGoal={goalLine}
                          handlegoalValue={handlegoalValue}
                          setgoalValue={goalValue}
                          handlegoalLabel={handlegoalLabel}
                          setGoalLabel={goalLabel}
                          handleShowValues={handleShowValues}
                          setshowvalues={showValues}
                          handleshowradio={handleshowradio}
                          setradioshow={valueToShow}
                          handleShowLabel={handleShowLabel}
                          xAxisShowLabel={showLabel}
                          handleyShowLabel={handleyShowLabel}
                          yAxisShowLabel={yShowLabel}
                          xAxisLabel={xlabel}
                          handleChangeLabel={handleChangeLabel}
                          yAxisLabel={yLabel}
                          handleyChangeLabel={handleyChangeLabel}
                          setxradioshow={showLineAndMarks}
                          handleRadioAngle={handleRadioAngle}
                          setyradioshow={yshowLineAndMarks}
                          handleyRadioAngle={handleyRadioAngle}
                        />
                      )
                  )}
                  {["customers", "ticket", "invoices"].map((source, index) => {
                    if (selectedSource === source && identify === "2") {
                      return (
                        <select
                          key={index}
                          id="ddlOptions2"
                          className="form-control select-class input"
                          value={dim}
                          onChange={(e) => setDim(e.target.value)}
                        >
                          <option value="" disabled>
                            Select Field
                          </option>

                          {xyz.map((option, idx) => (
                            <option key={idx} className="option">
                              {option}
                            </option>
                          ))}
                        </select>
                      );
                    }
                  })}
                </div>

                <div className="modal-button-container">
                  {identify === "1" && (
                    <button
                      className="generate-button"
                      onClick={
                        graphEdit
                          ? handleGenerateEditGraph
                          : handleGenerateGraphClick
                      }
                    >
                      {graphEdit ? "Edit Graph" : "Generate Graph"}
                    </button>
                  )}

                  {identify === "2" && (
                    <button
                      className="generate-button"
                      onClick={handleGenerateCount}
                    >
                      {graphEdit ? "Edit Count" : "Generate Count"}
                    </button>
                  )}

                  <button className="cancel" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ResponsiveReactGridLayout
        className="layout"
        rowHeight={60}
        width={1200}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        layout={generateLayout(displayGraph)}
        onLayoutChange={onLayoutChange}
        measureBeforeMount={false}
        useCSSTransforms={mounted}
        isDroppable={true}
        droppingItem={{ i: "xx", h: 50, w: 250 }}
        isResizable={isDraggable}
        isDraggable={isDraggable}
        breakpoints={{ lg: 100 }}
      >
        {layout &&
          displayGraph.map((d, index) => (
            <div
              key={d._id}
              className="chart-card"
              data-grid={generateLayout(displayGraph)[index]}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="Btn">
                <div
                  onClick={() => {
                    handleEdit(d);
                  }}
                >
                  <button className="edit">Edit</button>
                </div>
                <div
                  onClick={() => {
                    handleDelete(d._id);
                  }}
                >
                  <button className="edit">Delete</button>
                </div>
              </div>
              {d.chartType === "1" ? (
                <PieChart data={d} />
              ) : d.chartType === "2" ? (
                <BarChart data={d} />
              ) : null}
            </div>
          ))}
      </ResponsiveReactGridLayout>
    </div>
  );
}

export default App;
