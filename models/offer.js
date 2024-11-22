const mongoose = require("mongoose");

const Category = {
  ChildrenProducts: "منتجات أطفال",
  MedicalSupplies: "مستلزمات طبية",
  Cosmetics: "مستحضرات تجميل",
  Skincare: "العناية بالبشرة",
  PersonalCare: "العناية الشخصية",
  HealthCare: "العناية الصحية",
  Perfumes: "برفانات",
  Haircare: "العناية بالشعر",
  Makeup: "مكياج",
  TabletsAndCapsules: "أقراص وكبسول",
  Drops: "القطرات",
  Syrup: "شراب",
  Injections: "الحقن",
  CreamsAndOintments: "الكريمات والمراهم",
  Sachets: "أكياس",
  Suppositories: "لبوس",
};

const offerSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  description: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  sellCount: {
    type: Number,
    default: 0,
  },
  images: {
    type: [String],
  },
  boughtTime: {
    type: Date,
  },
  oldPrice: {
    type: Number,
  },
  newPrice: {
    type: Number,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  category: {
    type: String,
    enum: Object.values(Category),
  },
});

const offerModel = mongoose.model("offers", offerSchema);

module.exports = { offerModel, offerSchema };
