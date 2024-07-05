const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const CommonSchema = require("../models/commonSchema");
const Customer = require("../models/customerModel");
const customerData = require("../src/data1/customer.json");
const Invoice = require("../models/invoiceModel");
const invoiceData = require("../src/data1/invoice.json");
const db = require("../db");
const Joi = require("joi");
const { layouts } = require("chart.js");
const schemas = {
  customers: Customer,
  commonschemas: CommonSchema,
};

router.get("/createCustomerTable", async (req, res) => {
  try {
    await Customer.createCollection();
    console.log("Collection created successfully");
    res.status(200).send("Collection created successfully");
  } catch (err) {
    console.error("Error creating collection: ", err.message);
    res.status(500).send("Error creating collection");
  }
});
router.get("/createInvoiceTable", async (req, res) => {
  try {
    await Invoice.createCollection();
    console.log("Collection created successfully");
    res.status(200).send("Collection created successfully");
  } catch (err) {
    console.error("Error creating collection: ", err.message);
    res.status(500).send("Error creating collection");
  }
});

router.post("/insertCustomerTable", async (req, res) => {
  try {
    await Customer.insertMany(customerData);
    console.log("Records inserted successfully");
    res.status(200).send("Records inserted successfully");
  } catch (err) {
    console.error("Error inserting records: ", err.message);
    res.status(500).send("Error inserting records");
  }
});
router.post("/insertInvoiceTable", async (req, res) => {
  try {
    await Invoice.insertMany(invoiceData);
    console.log("Records inserted successfully");
    res.status(200).send("Records inserted successfully");
  } catch (err) {
    console.error("Error inserting records: ", err.message);
    res.status(500).send("Error inserting records");
  }
});

router.get("/getAllData", async (req, res) => {
  const { chartSource } = req.query;
  console.log("Table name:", chartSource);
  try {
    if (!chartSource || !schemas[chartSource]) {
      console.error("Invalid table name:", chartSource);
      return res.status(400).send("Invalid table name");
    }
    const data = await schemas[chartSource].find();
    res.send(data);
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.status(500).send("Error fetching data");
  }
});

router.get("/getGroup", async (req, res) => {
  try {
    const { chartSource, field1, field2 } = req.query;

    if (!chartSource || !field1 || !field2) {
      return res.status(400).send("Table name and fields are required.");
    }
    const response = await schemas[chartSource].aggregate([
      { $group: { _id: `$${field1}`, value: { $sum: 1 } } },
      { $project: { _id: 0, label: `$_id`, value: 1 } },
    ]);
    console.log(response);

    res.send({
      status: 200,
      msg: "Request processed successfully",
      data: response,
    });
  } catch (err) {
    console.error("Error fetching data: ", err.message);
    res.status(500).send("Error fetching data");
  }
});

const saveSchema = Joi.object({
  companyId: Joi.string(),
  userId: Joi.string(),
  isDeleted: Joi.boolean(),
  chartSource: Joi.string().required(),
  chartBasic: Joi.number(),
  chartType: Joi.string(),
  chartNum: Joi.alternatives().conditional("chartBasic", {
    is: "1",
    then: Joi.string().allow(""),
    otherwise: Joi.string().allow(""),
  }),
  getSum: Joi.number(),
  json_data: Joi.array(),
  field1: Joi.string().required(),
  field2: Joi.string(),
  layout: Joi.array(),
  // .items(
  //   Joi.object({
  //     x: Joi.number().optional().allow(),
  //     y: Joi.number().optional().allow(),
  //     w: Joi.number().optional().allow(),
  //     h: Joi.number().optional().allow(),
  //   })
  // )
  chartElements: Joi.object({
    pieChart: Joi.object({
      legend: Joi.boolean(),
      total: Joi.boolean(),
      selectPercentage: Joi.string().allow(""),
      minSlicePercentage: Joi.number()

        .allow(null)
        .empty("")
        .default(null)
        .min(0)
        .max(100),
    }),
    barLineChart: Joi.object({
      goalLine: Joi.boolean().allow(),
      goalValue: Joi.number().optional().allow(null).empty("").default(null),
      // goalLabel: Joi.string().allow("").optional(),
      showValues: Joi.boolean().default(false),
      valueToShow: Joi.string().allow("").optional(),
      showLabel: Joi.boolean().default(false),
      showLineAndMarks: Joi.string().allow("").optional(),
      // LabelDisplayMode: Joi.optional(),
      yShowLabel: Joi.boolean().default(null),
      // yLabel: Joi.string().allow("").optional(),
      yshowLineAndMarks: Joi.optional(),
    }),
  }),
});
router.post("/saveGraph", async (req, res) => {
  const {
    companyId,
    userId,
    isDeleted,
    chartSource,
    chartBasic,
    chartType,
    chartNum,
    field1,
    field2,
    layout,
    chartElements,
  } = req.body;

  try {
    const newEntry = new UserAnalyticsCharts({
      graph: [
        {
          companyId,
          userId,
          isDeleted,
          chartSource,
          chartBasic,
          chartType,
          chartNum,
          field1,
          field2,
          layout,
          chartElements,
        },
      ],
    });

    console.log("in save", newEntry);

    await newEntry.save();
    res.send({ msg: "Data saved successfully" });
  } catch (err) {
    console.error("Error in saving graph data: ", err.message);
    res.status(500).send("Error in saving graph data");
  }
});

router.patch("/updateGraphPositions/:_id", async (req, res) => {
  try {
    const objid = req.params._id;
    const updatedGraphs = req.body;
    const graphObject = await CommonSchema.findOne({ _id: objid });
    if (!graphObject) {
      return res.status(404).json({ message: "Parent object not found" });
    }
    updatedGraphs.forEach(({ id, x, y, w, h }) => {
      const graphToUpdate = graphObject.graph.find((graph) => graph.id === id);
      if (graphToUpdate) {
        graphToUpdate.layout.x = x;
        graphToUpdate.layout.y = y;
        graphToUpdate.layout.w = w;
        graphToUpdate.layout.h = h;
      }
    });
    const updatedObject = await graphObject.save();

    res.send({
      message: "Graph positions updated successfully",
      updatedObject,
    });
  } catch (err) {
    console.error("Error updating graph positions:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

router.patch("/saveGraph", async (req, res) => {
  // const validatedData = await saveSchema.validateAsync(req.body);
  const data = req.body;
  const latestGraph = await CommonSchema.findOne({});
  console.log(latestGraph);
  const { _id } = latestGraph;
  console.log(latestGraph.graph);
  const graph = [...latestGraph.graph, data];
  const response = await CommonSchema.findByIdAndUpdate(_id, {
    graph,
  });
  res.send({ response });
});

router.get("/getGraph", async (req, res) => {
  try {
    const data = await CommonSchema.find({});
    res.send(data);
  } catch (err) {
    console.error("Error fetching data from MongoDB: " + err);
    res.status(500).send("Internal Server Error");
  }
});

router.patch("/deleteGraph/:id", async (req, res) => {
  try {
    const graphId = req.body;
    const _id = req.params.id;
    const graphs = await CommonSchema.findOne({ _id: _id });
    console.log(graphs);
    let graph = [];
    for (const item of graphs.graph) {
      if (item._id != graphId.id) {
        graph.push(item);
      }
    }
    const response = await CommonSchema.findByIdAndUpdate(_id, { graph });
    res.send(response);
    console.log(graph);
  } catch (err) {
    console.error("Error deleting graph entry:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.patch("/updateGraph/:objid/:id", async (req, res) => {
  try {
    const objid = req.params.objid;
    const id = req.params.id;
    let updatedData = req.body;
    // console.log("updated data", updatedData);
    // updatedData = updatedData.updatedData;
    const graphs = await CommonSchema.findOne({ objid });
    const graph = [];

    for (const item of graphs.graph) {
      let temp = item._id;
      if (temp != id) {
        graph.push(item);
      } else graph.push(updatedData);
    }
    const response = await CommonSchema.findByIdAndUpdate(objid, { graph });
    res.send(response);
    // console.log(graph);
    if (!response) {
      return res.status(404).json({ message: "Document not found" });
    }
  } catch (err) {
    console.error("Error updating document:", err.message);
    res.status(500).json({ message: "Error updating document" });
  }
});
router.get("/getAvg", async (req, res) => {
  try {
    const { chartSource, field1 } = req.query;
    if (!chartSource || !field1) {
      return res.status(400).send("Table name and fields are required.");
    }
    const response = await schemas[chartSource].aggregate([
      {
        $group: {
          _id: "null",
          totalSum: { $avg: { $toDouble: `$${field1}` } },
        },
      },
    ]);
    // const response = await schemas[chartSource].aggregate(aggregation).exec();
    res.send({
      status: 200,
      msg: "Request processed successfully",
      data: response,
    });
  } catch (err) {
    console.error("Error fetching data: ", err.message);
    res.status(500).send("Error fetching data");
  }
});

router.get("/getSum", async (req, res) => {
  try {
    const { chartSource, field1 } = req.query;

    if (!chartSource || !field1) {
      return res.status(400).send("Table name and field1 are required.");
    }
    const response = await schemas[chartSource].aggregate([
      {
        $group: {
          _id: "null",
          totalSum: { $sum: { $toDouble: `$${field1}` } },
        },
      },
    ]);
    res.send({
      status: 200,
      msg: "Sum computed successfully",
      data: response,
    });
  } catch (err) {
    console.error("Error computing sum: ", err.message);
    res.status(500).send("Error computing sum");
  }
});
// router.get("/getGraph", async (req, res) => {
//   try {
//     const data = await CommonSchema.find({});
//     const filteredData = data.map((doc) => ({
//       _id: doc._id,
//       graph: doc.graph.filter((entry) => !entry.isDeleted),
//     }));
//     // console.log(filteredData);
//     res.send(filteredData);
//   } catch (err) {
//     console.error("Error fetching data from MongoDB: " + err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// router.patch("/deleteGraph/:id", async (req, res) => {
//   try {
//     const graphId = req.body;
//     const _id = req.params.id;
//     const graphs = await CommonSchema.findOne({ _id: _id });
//     // console.log(graphs);
//     let graph = [];
//     for (const item of graphs.graph) {
//       if (item._id == graphId.id) {
//         item.isDeleted = true;
//       }
//       graph.push(item);
//     }
//     const response = await CommonSchema.findByIdAndUpdate(_id, { graph });
//     res.send(response);
//     // console.log(graph);
//   } catch (err) {
//     console.error("Error deleting graph entry:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

module.exports = router;
