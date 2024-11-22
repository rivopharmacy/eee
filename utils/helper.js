const unwind = (path) => {
    return {
      $unwind: {
        path: path,
        preserveNullAndEmptyArrays: true,
      },
    };
  };
  
  const lookup = (obj) => {
    obj.foreignField = obj.foreignField || "_id";
    obj.localField = obj.localField || "_id";
    return {
      $lookup: obj,
    };
  };
  
  const lookupWithUnwind = (obj) => {
    return [lookup(obj), unwind(`$${obj.as}`)];
  };
  
  const calcDistance = (currentLoc, prevLoc) => {
    //convert lat lng to radians
    const lat1 = (parseFloat(currentLoc.lat) * Math.PI) / 180;
    const lon1 = (parseFloat(currentLoc.lng) * Math.PI) / 180;
    
    const lat2 = (parseFloat(prevLoc.lat) * Math.PI) / 180;
    const lon2 = (parseFloat(prevLoc.lng) * Math.PI) / 180;
    
    //Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
  
    let c = 2 * Math.asin(Math.sqrt(a));
    let r = 6371;
  
    return (c * r) * 1000;
  };
  
  module.exports = { unwind, lookup, lookupWithUnwind, calcDistance };
  