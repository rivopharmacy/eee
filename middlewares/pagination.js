const mongoose = require("mongoose");
const { parse } = require("../utils/query_parse");
const { asyncHandler } = require("./async");

const pagination = asyncHandler(
  async (req, res, next) => {
    // Copy req.query
    const reqQuery = { ...parse(req.query) };

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in|ne)\b/g,
      (match) => `$${match}`
    );

    const filters = JSON.parse(queryStr);
    const pageNumber = parseInt(req.query.page?.toString() ?? "") || 1;
    const limit = parseInt(req.query.limit?.toString() ?? "") || 25;
    let sortBy = req.query.sort ? req.query.sort : "createdAt";
    const result = {};
    const model = req.model;

    const totalPosts = await model.countDocuments(filters);
    let startIndex = (pageNumber - 1) * limit;
    result.totalPages = Math.ceil(totalPosts / limit);
    result.totalCount = totalPosts;
    result.limit = limit;
    result.currentPage = pageNumber;

    for (let key of Object.keys(filters)) {
      if (Array.isArray(filters[key])) {
        filters[key] = { $in: filters[key] };
      }
    }

    result.data = await model
      .find(filters)
      .collation({ locale: "en_US", strength: 2 })
      .sort(sortBy)
      .skip(startIndex)
      .limit(limit)
      .populate(req.populate);

    result.count = result.data.length;
    res.json({ success: true, result: result });
  }
);

const aggregatedPagination = asyncHandler(
  async (req, res, next) => {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    const filters = JSON.parse(queryStr);
    recursiveCasting(filters);

    const pageNumber = parseInt(req.query.page?.toString() ?? "") || 1;
    const limit = parseInt(req.query.limit?.toString() ?? "") || 25;
    let sortBy = req.query.sort ? req.query.sort : "createdAt";

    const model = req.model;
    const totalPosts = await model.countDocuments();
    let startIndex = (pageNumber - 1) * limit;

    const extraStages = req.extraStages || [];
    const params = [
      {
        $match:
          Object.keys(filters).length !== 0
            ? {
                $or: Object.keys(filters).map((field) => {
                  if (Array.isArray(filters[field])) {
                    return { [field]: { $in: filters[field] } };
                  }
                  return { [field]: filters[field] };
                }),
              }
            : {},
      },
      ...extraStages,
      ...(req.query.sort
        ? [
            {
              $sort: sortBy,
            },
          ]
        : []),
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
    ];

    const result = {};
    result.totalPages = Math.ceil(totalPosts / limit);
    result.totalCount = totalPosts;
    result.limit = limit;
    result.currentPage = pageNumber;
    result.data = await model
      .aggregate(params)
      .collation({ locale: "en_US", strength: 2, numericOrdering: true });

    result.count = result.data.length;
    res.json({ success: true, result: result });
  }
);

function isObjectIdValid(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    if (String(new mongoose.Types.ObjectId(id)) === id) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function recursiveCasting(val) {
  if (typeof val === "object") {
    if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i++) {
        val[i] = recursiveCasting(val[i]);
      }
    } else {
      for (const key in val) {
        val[key] = recursiveCasting(val[key]);
      }
    }
  } else if (typeof val === "string") {
    if (isObjectIdValid(val)) {
      return new mongoose.Types.ObjectId(val);
    } else {
      return val;
    }
  } else {
    return val;
  }
  return val;
}

module.exports = { aggregatedPagination, pagination, recursiveCasting };
