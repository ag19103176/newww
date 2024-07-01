const mongoose = require("mongoose");

// Define subschema for pie chart configurations
const PieChartSchema = new mongoose.Schema(
  {
    legend: {
      type: Boolean,
    },
    total: {
      type: Boolean,
    },
    selectPercentage: {
      type: String,
    },
    minSlicePercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  { _id: false }
);

// const SumSchema = new mongoose.Schema(
//   {
//     sum: {
//       type: number,
//       // required: true,
//     },
//   },
//   { _id: false }
// );

// Define subschema for bar and line chart configurations
const BarLineChartSchema = new mongoose.Schema(
  {
    goalLine: {
      type: Boolean,
      default: false,
    },
    goalValue: {
      type: Number,
      default: null,
    },
    // goalLabel: {
    //   type: String,
    //   default: null,
    // },
    showValues: {
      type: Boolean,
      default: false,
    },
    valueToShow: {
      type: String,
      default: null,
    },
    showLabel: {
      type: Boolean,
      default: false,
    },
    // xlabel: {
    //   type: String,
    //   default: null,
    // },
    showLineAndMarks: {
      type: String,
      default: null,
    },
    yShowLabel: {
      type: Boolean,
      default: null,
    },
    // yLabel: {
    //   type: String,
    //   default: null,
    // },
    yshowLineAndMarks: {
      type: String,
      default: null,
    },
  },
  { _id: false }
);

const UserAnalyticsChartsSchema = new mongoose.Schema({
  graph: [
    {
      companyId: {
        type: Number,
        required: true,
        default: 0,
      },
      userId: {
        type: Number,
        required: true,
        default: 0,
      },
      isDeleted: {
        type: Boolean,
        default: false,
        // required: true,
      },
      chartSource: {
        type: String,
        required: true,
        required: true,
        default: 0,
      },
      chartBasic: {
        type: String,
        default: null,
      },
      chartType: {
        type: String,
        required: true,
        default: 0,
      },
      json_data: {
        type: Array,
        required: true,
      },
      field1: {
        type: String,
        required: true,
        default: 0,
      },
      field2: {
        type: String,
        required: true,
        default: 0,
      },
      layout: {
        x: {
          type: Number,
          default: 10,
        },
        y: {
          type: Number,
          default: 10,
        },
        w: {
          type: Number,
          default: 10,
        },
        h: {
          type: Number,
          default: 0,
        },
      },
      chartElements: {
        pieChart: PieChartSchema,
        barLineChart: BarLineChartSchema,
      },
    },
  ],
});

const UserAnalyticsCharts = mongoose.model(
  "UserAnalyticsCharts",
  UserAnalyticsChartsSchema
);
module.exports = UserAnalyticsCharts;
