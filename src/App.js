import React, { useEffect, useState } from "react";
import axios from "axios";
import PieChart from "./Components/Graph/pieChart.js";
import DataDisplayComponent from "./Components/DataDisplayAxes/CommonDisplay.js";
import BarChart from "./Components/Graph/barChart.js";
import LineChart from "./Components/Graph/lineChart.js";
import Loader from "./Components/Loader/loader.js";
import AvgDisplay from "./Components/DataDisplayAxes/avgDisplay.js";
import { Responsive, WidthProvider } from "react-grid-layout";
import "./App.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import SumDisplay from "./Components/DataDisplayAxes/sumDisplay.js";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { X } from "@mui/icons-material";
const mongoose = require("mongoose");
const ResponsiveReactGridLayout = WidthProvider(Responsive);

function App() {
  const sources = [
    { name: "customers" },
    { name: "invoices" },
    { name: "ticket" },
  ];
  const basic = [
    { name: "Graph", identificationId: 1 },
    { name: "Numeric", identificationId: 2 },
  ];
  const structures = [
    { name: "Pie Graph", id: 1 },
    { name: "Bar Graph", id: 2 },
    { name: "Line Graph", id: 3 },
  ];
  const abc = [
    { name: "Sum", idc: 1 },
    { name: "Average", idc: 2 },
  ];
  const xyz = [
    "root_parent_id",
    "parent_id",
    "deleted_at",
    "created_user_id",
    "updated_user_id",
    "is_prospect",
  ];

  const [selectedSource, setSelectedSource] = useState("");
  const [dim, setDim] = useState("");
  const [measure, setMeasure] = useState("");
  const [type, setType] = useState("");
  const [num, setNum] = useState("");
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
  const [identify, setIdentify] = useState(1);
  const [totalSum, setTotalSum] = useState(0);
  const [showLabel, setShowLabel] = useState(true);
  const [yShowLabel, setyShowLabel] = useState(true);
  const [xlabel, setxLabel] = useState("");
  const [yLabel, setyLabel] = useState("");
  const [showLineAndMarks, setshowLineAndMarks] = useState("");
  const [yshowLineAndMarks, setyshowLineAndMarks] = useState("");
  const [refresh, setRefresh] = useState();

  const handleRefreshClick = (val) => {
    setInterval(() => {
      setGraph(!graph);
    }, val * 1000);
  };

  // useEffect(() => {
  //   refresh=
  // },[]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/api/getGraph");
        const data = response.data;

        if (data.length > 0) {
          data[0].graph.map(async (dd) => {
            var response;
            var x;
            if (dd.chartBasic === "1") {
              response = await axios.get("http://localhost:8000/api/getGroup", {
                params: {
                  chartSource: dd.chartSource,
                  field1:
                    dd.chartType === "1"
                      ? dd.chartElements.pieChart.dimension
                      : dd.chartElements.barLineChart.xaxis,

                  field2:
                    dd.chartType === "1"
                      ? dd.chartElements.pieChart.measure
                      : dd.chartElements.barLineChart.yaxis,
                },
              });

              const dataLabel = response.data.data.map((item) => ({
                label: item.label == null ? "nolabel" : item.label,
                value: item.value == null ? "1" : item.value,
              }));
              dd.json_data = dataLabel;
            } else if (dd.chartBasic === "2") {
              // setDim(graphData.field1);
              if (dd.chartNum === "1") {
                x = await fetch(
                  `http://localhost:8000/api/getSum?chartSource=${dd.chartSource}&field1=${dd.chartElements.sumChart.field}`
                );
              } else if (dd.chartNum === "2") {
                x = await fetch(
                  `http://localhost:8000/api/getAvg?chartSource=${dd.chartSource}&field1=${dd.chartElements.sumChart.field}`
                );
              }

              const res = await x.json();
              // console.log("effect", res);
              const totalSum = res.data[0].totalSum;
              dd.chartElements.sumChart.getSum = totalSum;
            }
          });

          console.log("dataaaaaaaaaaaaa", data[0].graph);
          setObjid(() => data[0]._id); // TODO
          setTimeout(() => {
            setDisplayGraph(data[0].graph);
          }, 1000);

          var temp = data[0].graph.map((g, index) => {
            console.log({ ...g.layout, i: index });
            return { ...g.layout, i: index };
          });
          setLayout(temp);
        }
        // setObjid(() => data[0]._id); // TODO
        // setDisplayGraph(data[0].graph);
        // var temp = data[0].graph.map((g, index) => {
        //   console.log({ ...g.layout, i: index });
        //   return { ...g.layout, i: index };
        // });
        // setLayout(temp);
      } catch (error) {
        console.log("error in app js ", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [graph]);

  const handleEdit = async (graphData) => {
    // console.log("abc", graphData);
    setLoading(true);
    setSelectedSource(graphData.chartSource);
    setIdentify(graphData.chartBasic);
    setNum(graphData.chartNum);

    setType(graphData.chartType);
    setNum(graphData.abc);
    setId(graphData._id);
    if (graphData.chartType === "1") {
      setDim(graphData.chartElements.pieChart.dimension);
      setMeasure(graphData.chartElements.pieChart.measure);
      setLegend(graphData.chartElements.pieChart.legend);
      setTotal(graphData.chartElements.pieChart.total);
      setSelectPercentage(graphData.chartElements.pieChart.selectPercentage);
      setSlicePercentage(graphData.chartElements.pieChart.minSlicePercentage);
    } else if (graphData.chartType === "2" || graphData.chartType === "3  ") {
      setDim(graphData.chartElements.barLineChart.xaxis);
      setMeasure(graphData.chartElements.barLineChart.yaxis);
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

      const dataLabel = response.data.data.map((item) => ({
        label: item.label == null ? "nolabel" : item.label,
        value: item.value == null ? "1" : item.value,
      }));
      const requestData = {
        chartSource: selectedSource,
        // json_data: dataLabel,
        chartBasic: identify,
        chartType: type,
        chartNum: num,
        // field1: dim,
        // field2: measure,
        layout: layout,
        chartElements: {},
      };
      if (type === "1") {
        requestData.chartElements = {
          pieChart: {
            dimension: dim,
            measure: measure,
            legend: legend,
            total: total,
            selectPercentage: selectPercentage,
            minSlicePercentage: slicePercentage,
          },
        };
      } else if (type === "2" || type === "3") {
        requestData.chartElements = {
          barLineChart: {
            xaxis: dim,
            yaxis: measure,

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

      if (displayGraph.length == 0 && objid === "") {
        const newId = mongoose.Types.ObjectId();
        setObjid(newId);
        requestData._id = newId;
        console.log(requestData);
        await axios.post("http://localhost:8000/api/saveGraph", requestData);
      } else {
        requestData._id = objid;
        await axios.patch("http://localhost:8000/api/saveGraph", requestData);
      }

      setGraph(!graph);
      setShowModal(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleGenerateEditGraph = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/getGroup", {
        params: {
          chartSource: selectedSource,
          field1: dim,
          field2: measure,
        },
      });
      const dataLabel = response.data.data.map((item) => ({
        label: item.label == null ? "nolabel" : item.label,
        value: item.value == null ? "1" : item.value,
      }));
      const updatedData = {
        chartSource: selectedSource,
        json_data: dataLabel,
        chartBasic: identify,
        chartType: type,
        chartNum: num,
        // field1: dim,
        // field2: measure,
        layout: layout,
        chartElements: {},
      };
      if (type === "1") {
        updatedData.chartElements = {
          pieChart: {
            dimension: dim,
            measure: measure,
            legend: legend,
            total: total,
            selectPercentage: selectPercentage,
            minSlicePercentage: slicePercentage,
          },
        };
      } else if (type === "2" || type === "3") {
        updatedData.chartElements = {
          barLineChart: {
            xaxis: dim,
            yaxis: measure,
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

  const handleEditCount = async (graphData) => {
    // console.log("edit coint", graphData);
    setLoading(true);
    setSelectedSource(graphData.chartSource);
    setIdentify(graphData.chartBasic);
    setNum(graphData.chartNum);
    setId(graphData._id);
    setShowModal(true);
    setAddButton(true);
    setGraphEdit(true);
    setLoading(false);
  };
  const handleGenerateCount = async () => {
    try {
      if (num === "1") {
        var response = await fetch(
          `http://localhost:8000/api/getSum?chartSource=${selectedSource}&field1=${dim}`
        );
      } else if (num === "2") {
        response = await fetch(
          `http://localhost:8000/api/getAvg?chartSource=${selectedSource}&field1=${dim}`
        );
      }

      const res = await response.json();
      const totalSum = res.data[0].totalSum;
      setTotalSum(totalSum);

      const requestData = {
        chartSource: selectedSource,
        chartBasic: identify,
        chartNum: num,
        layout: layout,
      };
      requestData.chartElements = {
        sumChart: {
          field: dim,
        },
      };
      console.log("generate", requestData);
      await axios.patch("http://localhost:8000/api/saveGraph", requestData);

      setGraph(!graph);
      setNum("");
      setShowModal(false);
    } catch (err) {
      console.error("Error fetching sum:", err);
    }
  };
  const handleGenerateEditCount = async () => {
    setLoading(true);
    try {
      let response;
      // setDim(graphData.field1);
      if (num === "1") {
        response = await fetch(
          `http://localhost:8000/api/getSum?chartSource=${selectedSource}&field1=${dim}&field2=${measure}`
        );
      } else if (num === "2") {
        response = await fetch(
          `http://localhost:8000/api/getAvg?chartSource=${selectedSource}&field1=${dim}&field2=${measure}`
        );
      }

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const res = await response.json();
      const totalSum = res.data[0].totalSum;
      setTotalSum(totalSum);

      const requestData = {
        chartSource: selectedSource,
        chartBasic: identify,
        chartNum: num,
        // field1: dim,
        // field2: measure,

        layout: layout,
      };
      requestData.chartElements = {
        sumChart: {
          field: dim,
          // getSum: totalSum,
        },
      };
      await axios.patch(
        `http://localhost:8000/api/updateGraph/${objid}/${id}`,
        requestData
      );

      setId("");
      setShowModal(false);
      setGraph(!graph);
    } catch (error) {
      console.error("Error generating edit count:", error.message);
    }
    setLoading(false);
  };
  const handleDelete = async (id) => {
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
  const selectNumeric = (e) => {
    setNum(e.target.value);
  };

  const handleAddButton = () => {
    setLoading(true);
    setLayout();
    setAddButton(true);
    setShowModal(true);
    setGraphEdit(false);
    setSelectedSource("");
    setDim("");
    setMeasure("");
    setIdentify("");
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

  const onLayoutChange = (newLayout) => {
    console.log("isDraggable:", isDraggable);
    setLayout(newLayout);

    if (!isDraggable && graph) {
      saveLayoutToBackend(newLayout);
      console.log("Layout changed:", newLayout);
    }
  };
  const minWidth = 2;
  const minHeight = 4;
  const maxWidth = 7;
  const maxHeight = 7;

  const generateLayout = (graphs) => {
    let maxX = -Infinity;
    let maxY = -Infinity;

    graphs.forEach((graph) => {
      if (graph.layout) {
        maxX = Math.max(maxX, graph.layout.x);
        maxY = Math.max(maxY, graph.layout.y);
      }
    });

    return { x: maxX, y: maxY, h: 5.7, w: 4 };
  };
  const handleLayout = (graphs) => {
    // const { X, Y, W, H } = generateLayout(graphs);
    return graphs.map((graph, index) => ({
      // i: graph.id?.toString() || index.toString(),
      // x: (index % 3) * 4,
      // y: Math.floor(index / 3) * 6,
      // w: 4,
      // h: 5.7,
      i: graph.id?.toString() || index.toString(),
      x: graph.layout.x ? graph.layout.x : (index % 3) * 4,
      y: graph.layout.y ? graph.layout.y * 6 : Math.floor(index / 3) * 6,
      w: graph.layout.w ? graph.layout.w : 4,
      h: graph.layout.h ? graph.layout.h : 5.7,
      minW: minWidth,
      minH: minHeight,
      maxW: maxWidth,
      maxH: maxHeight,
    }));
  };
  const saveLayoutToBackend = async (layout) => {
    try {
      const updatedGraphs = layout.map((item) => ({
        id: item.i,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
      }));
      const res = await axios.patch(
        `http://localhost:8000/api/updateGraphPositions/${objid}`,
        updatedGraphs
      );
      console.log("ff", layout);
      console.log("res", res);
    } catch (error) {
      console.error("Error saving layout:", error);
    }
  };
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleDragDrop = () => {
    setIsDraggable((prev) => !prev);
    if (isDraggable) {
      saveLayoutToBackend(layout);
    }
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
        <div className="row">
          <button className="add-button" onClick={handleAddButton}>
            + ADD GRAPH
          </button>

          <select
            className=" input"
            defaultValue="0"
            onChange={(e) => handleRefreshClick(e.target.value)}
          >
            <option value={0} disabled>
              AUTO REFRESH
            </option>
            <option value={0}>Off</option>
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
          </select>

          <div className="rearrange">
            <label>Resize/Rearrange</label>
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
                    value={num}
                    onChange={selectNumeric}
                  >
                    <option value="" disabled>
                      Select count
                    </option>
                    {abc.map((option, index) => (
                      <option key={index} value={option.idc} className="option">
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
                      onClick={
                        graphEdit
                          ? handleGenerateEditCount
                          : handleGenerateCount
                      }
                      // onClick={handleGenerateCount}
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
        rowHeight={60}
        width={1200}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        layout={handleLayout(displayGraph)}
        onLayoutChange={onLayoutChange}
        measureBeforeMount={false}
        useCSSTransforms={mounted}
        isDroppable={true}
        droppingItem={{ i: "xx", h: 50, w: 250 }}
        isResizable={isDraggable}
        isDraggable={isDraggable}
        breakpoints={{ lg: 100 }}
      >
        {/* {console.log("rdfr", layout)} */}
        {layout &&
          displayGraph.map((d, index) => (
            <div
              key={d._id}
              className="chart-card"
              data-grid={handleLayout(displayGraph)[index]}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="black">
                <div className="Btn">
                  <div
                    onClick={() => {
                      identify === "1" ? handleEdit(d) : handleEditCount(d);
                    }}
                  >
                    <div style={{ color: "white", cursor: "pointer" }}>
                      <EditOutlinedIcon />
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      handleDelete(d._id);
                    }}
                  >
                    <div style={{ color: "white", cursor: "pointer" }}>
                      <DeleteForeverOutlinedIcon />
                    </div>
                  </div>
                </div>
              </div>
              {d.chartType === "1" ? (
                <PieChart data={d} />
              ) : d.chartType === "2" ? (
                <BarChart data={d} />
              ) : d.chartType === "3" ? (
                <LineChart data={d} />
              ) : d.chartBasic === "2" && d.chartNum === "1" ? (
                <SumDisplay totalSum={d} />
              ) : d.chartBasic === "2" && d.chartNum === "2" ? (
                <AvgDisplay totalSum={d} />
              ) : (
                <div>Invalid chart type</div>
              )}
            </div>
          ))}
      </ResponsiveReactGridLayout>
    </div>
  );
}

export default App;
