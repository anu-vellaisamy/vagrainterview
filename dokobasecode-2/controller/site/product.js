'use strict'
var db = require('../../model/mongodb.js')
const axios = require('axios');

const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

module.exports = function () {
  var router = {}

 
  async function makeProductRequest() {

    const data = {
        method: 'get',
        url: 'https://vajro-interview.myshopify.com/admin/api/2023-01/products.json',
        headers: {'X-Shopify-Access-Token': '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' }
    }

    let resProduct = await axios(data)
    
    return resProduct;
  }

  async function makeShopRequest() {

    const data = {
        method: 'get',
        url: 'https://vajro-interview.myshopify.com/admin/api/2023-01/shop.json',
        headers: {'X-Shopify-Access-Token': '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' }
    }

    let resShop = await axios(data)
    
    return resShop;
  }

 
  router.generateProduct = async (req, res) => {
    let data = {}
    data.status = 0
    data.response = 'Invalid Request'

    try {
      let resProduct = await makeProductRequest();
      let resShop = await makeShopRequest();

      if (resProduct.data !== undefined && resProduct.data.products !== undefined && resProduct.data.products.length > 0) {

        let filteredProductDatas = [];
        myCache.set('productCount', resProduct.data.products.length);
        for (var i = 0; i < resProduct.data.products.length; i += 1) {
          let productData = {};

          productData.id = resProduct.data.products[i].id;
          productData.title = resProduct.data.products[i].title;
          productData.status = resProduct.data.products[i].status;
          productData.variants = resProduct.data.products[i].variants;
          productData.images = resProduct.data.products[i].images;
          productData.created_at = resProduct.data.products[i].created_at;
          filteredProductDatas.push(productData);
        }
         

        db.insertManyDocument('product', filteredProductDatas, (error, docData) => {
          if (error) {
            data.status = 1
            data.response = error.message
            res.send(data)
          }
        })

      }

      if (resShop.data !== undefined && resShop.data.shop !== undefined) {
        let shopData = {};

        shopData.name = resShop.data.shop.name;
        shopData.domain = resShop.data.shop.domain;

        db.insertDocument('shopinfo', shopData, (error, docData) => {
          if (error) {
            data.status = 1
            data.response = error.message
            res.send(data)
          } else {
            data.status = 1
            data.response = 'data added successfully'
            res.send(data)
          }
        })

      }
      
    } catch (error) {
      console.log(error.message);
      data.response = `${error.message}`
      res.send(data)
    }
  }

  router.getList = (req, res) => {
    let data = {}
    data.status = 0
    data.response = 'Invalid Request'
    try {
      // pagination
      var skip = req.body.skip,
        limit = req.body.limit,
        aggregationQuery = [],
        sort = { _id:-1 }

      var condition = { 'status': 'active' }

      aggregationQuery = [
        {
          '$facet': {
            'documentData': [
              { '$match': condition },
              { '$sort': sort },
              { '$skip': skip },
              { '$limit': limit },
              {
                '$project': {
                  'variants': 1,
                  'images': 1,
                  'id': 1,
                  'title': 1,
                  'status': 1,
                  'created_at':1
                },
              },
            ],
          },
        }
      ]      
      db.getAggregation('product', aggregationQuery,async (error, docData) => {
        if (error) {
          data.response = error.message
          res.send(data)
        } else {
          let documentData =
            docData[0].documentData && docData[0].documentData.length > 0
              ? docData[0].documentData
              : []

              
              let shopData = await db.getFindAsyncDocument(
                'shopinfo',
                {}
              )
              // shop info
              if (shopData.status === 200) {
                documentData.shop_info = {};
                documentData.shop_info.name = shopData.data[0].name;
                documentData.shop_info.domain = shopData.data[0].domain;
              }
              
              // product count
              documentData.product_count = docData[0].documentData.length;

              data.status = 1
              data.response = JSON.stringify(documentData)
              console.log(documentData);
              res.send(data)
        }
      })
    } catch (error) {
      data.response = `${error.message}`
      res.send(data)
    }
  }

  router.clearCache = (req, res) => {
    let data = {}
    data.status = 0
    data.response = 'Invalid Request'
    
    try {
      myCache.del( "productCount" );
      data.status = '1';
      data.response = 'Product Count cache is cleared';
      res.send(data);
    } catch (error) {
      console.log(error);
    }
  }

  router.getCache = (req, res) => {
    let data = {}
    data.status = 0
    data.response = 'Invalid Request'
    
    try {
      let productCount = myCache.get( "productCount" );
      if (productCount === undefined) {
        productCount = 0;
      }
      data.status = '1';
      data.response = 'Product Count: ' + productCount;
      res.send(data);
    } catch (error) {
      console.log(error);
      data.response = error;
      res.send(data);
    }
  }
  

  return router
}
