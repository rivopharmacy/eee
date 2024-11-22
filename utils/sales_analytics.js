const moment = require("moment");
const { productModel } = require("../models/product");
const { salesModel } = require("../models/sales");
// const { productModel, salesModel } = require("../internal");

const salesAnalytics = async () => {
    const prevMonthStartDay = moment().subtract(1, 'months').startOf('month').toDate();
    const prevMonthEndDay = moment().subtract(1, 'months').endOf('month').toDate();
    const previousMonthName = moment().subtract(1, 'months').format('MMM').toLowerCase();
    
    const sellCounts = await productModel.aggregate([
        {
            $match: {
                boughtTime: {
                    $gte: prevMonthStartDay,
                    $lte: prevMonthEndDay
                }
            }
        },
        {
            $group: {
                _id: null,
                sellCount: { $sum: '$sellCount' },
            }
        },
        {
            $project: {
                _id: 0,
                sellCount: 1,
            }
        }
    ]);

    if (sellCounts.length > 0) {
        await salesModel.create({
            month: previousMonthName,
            sales: sellCounts[0].sellCount,
        });
    }
};

module.exports = { salesAnalytics };
