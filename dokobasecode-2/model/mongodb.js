const product = require('../schema/product.js')
const shopinfo = require('../schema/shopinfo.js')

const db = {
  product: product,
  shopinfo: shopinfo
}

const getOneDocument = (model, query, projection, extension, callback) => {
  var query = db[model].findOne(query, projection, extension.options)
  if (extension.populate) {
    query.populate(extension.populate)
  }
  if (extension.sort) {
    query.sort(extension.sort)
  }
  query.exec(function (err, docs) {
    callback(err, docs)
  })
}

const insertDocument = (model, docs, callback) => {
  var doc_obj = new db[model](docs)
  doc_obj.save(function (err, numAffected) {
    callback(err, numAffected)
  })
}

const insertManyDocument = (model, query, callback) => {
  db[model].insertMany(query, function (err, result) {
    callback(err, result)
  })
}

const updateManyDocument = (model, query, params, options, callback) => {
  db[model].updateMany(query, params, options, function (err, result) {
    callback(err, result)
  })
}

const updateDocument = (model, criteria, doc, options, callback) => {
  db[model].updateOne(criteria, doc, options, function (err, docs) {
    callback(err, docs)
  })
}

const findOneDocument = (model, criteria, options, callback) => {
  db[model].findOne(criteria, options, function (err, docs) {
    callback(err, docs)
  })
}

const findOneAndUpdate = (model, criteria, doc, options, callback) => {
  db[model].findOneAndUpdate(criteria, doc, options, function (err, docs) {
    callback(err, docs)
  })
}


const getAggregation = (model, query, callback) => {
  db[model].aggregate(query).exec(function (err, docs) {
    callback(err, docs)
  })
}

const getCount = (model, conditions, callback) => {
  db[model].countDocuments(conditions, function (err, count) {
    callback(err, count)
  })
}

const deleteDocument = (model, criteria, callback) => {
  db[model].remove(criteria, function (err, docs) {
    callback(err, docs)
  })
}

const deleteOneDocument = (model, criteria, callback) => {
  db[model].deleteOne(criteria, function (err, docs) {
    callback(err, docs)
  })
}

const getFindAsyncDocument = async (model, query, projection) => {
  try {
    var results = await db[model].find(query, projection)
    return { status: 200, data: results }
  } catch (e) {
    return { status: 500, data: `${e.message}` }
  }
}

module.exports = {
  getOneDocument: getOneDocument,
  insertDocument: insertDocument,
  updateManyDocument: updateManyDocument,
  updateDocument: updateDocument,
  findOneAndUpdate: findOneAndUpdate,
  getAggregation: getAggregation,
  getCount: getCount,
  deleteDocument: deleteDocument,
  findOneDocument: findOneDocument,
  deleteOneDocument: deleteOneDocument,
  getFindAsyncDocument: getFindAsyncDocument,
  insertManyDocument: insertManyDocument,
}
