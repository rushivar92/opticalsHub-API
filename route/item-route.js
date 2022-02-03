const { json } = require('express/lib/response');
const itemcontroller = require('../controller/item-controllers');
const {verifyToken} = require('../common/authorization/Jwtauthorization')
const s3Controller = require('../controller/s3-upload');

function ensureToken(req, res, next){
  const bearerheader = req.headers.authorization;
  if(typeof bearerheader !== 'undefined'){
    const bearer = bearerheader.split(" ")
    const token = bearer[1]
    req.token = token
    next()
  }else{
    res.sendStatus({message:"unauthorized user",code:401});
  }
}

exports.routesConfig = function (app) {
  //category
  app.get('/api/v1/list/category',ensureToken, [
    verifyToken,
    itemcontroller.list_category
  ]);
  app.post('/api/v1/category/create',ensureToken, [
    verifyToken,
    itemcontroller.create_category
  ]);
  app.delete('/api/v1/category/delete',ensureToken, [
    verifyToken,
    itemcontroller.delete_category
  ]);
  app.put('/api/v1/category/update',ensureToken, [
    verifyToken,
    itemcontroller.update_category
  ]);
  //group
  app.post('/api/v1/group/create',ensureToken, [
    verifyToken,
    itemcontroller.create_group
  ]);
  app.delete('/api/v1/group/delete',ensureToken, [
    verifyToken,
    itemcontroller.delete_group
  ]);
  app.post('/api/v1/group/update',ensureToken, [
    verifyToken,
    itemcontroller.update_group
  ]);
  app.get('/api/v1/list/groups',ensureToken, [
    verifyToken,
    itemcontroller.list_groups
  ]);
  app.post('/api/v1/list/groups/by/category',ensureToken, [
    verifyToken,
    itemcontroller.list_groups_by_category
  ]);
  //item
  app.post('/api/v1/item/create',ensureToken, [
    verifyToken,
    itemcontroller.create
  ]);
  app.get('/api/v1/list/totalItems',ensureToken, [
    verifyToken,
    itemcontroller.getTotalItems
  ]);
  app.get('/api/v1/list/items',ensureToken, [
    verifyToken,
    itemcontroller.getItems
  ]);
  app.get('/api/v1/list/itemById',ensureToken, [
    verifyToken,
    itemcontroller.getItemById
  ]);
  app.post('/api/v1/item/update',ensureToken, [
    verifyToken,
    itemcontroller.item_update
  ]);
  app.delete('/api/v1/item/delete',ensureToken, [
    verifyToken,
    itemcontroller.item_delete
  ]);
  app.get('/api/v1/list/similar/items',ensureToken, [
    verifyToken,
    itemcontroller.get_similar_products
  ]);

  app.post('/api/v1/items/search',ensureToken, [
    verifyToken,
    itemcontroller.search
  ]);
  app.post('/api/v1/cart/items/create',ensureToken, [
    verifyToken,
    itemcontroller.cart_item_create
  ]);
  app.delete('/api/v1/cart/items/delete',ensureToken, [
    verifyToken,
    itemcontroller.cart_item_delete
  ]);
  app.put('/api/v1/cart/item/update',ensureToken, [
    verifyToken,
    itemcontroller.cart_item_update
  ]);
  app.post('/api/v1/cart/items',ensureToken, [
    verifyToken,
    itemcontroller.get_cart_items
  ]);
  app.post('/api/v1/list/create_support', [
    itemcontroller.create_support
  ]);
  app.get('/api/v1/list/getSupport', [
    itemcontroller.getSupport
  ]);
  app.get('/api/v1/list/dashboard', [
    itemcontroller.getDashboard
  ]);

  // enduser api's without token
  app.get('/api/v1/enduser/list/category', [
    itemcontroller.list_category
  ]);
  app.post('/api/v1/enduser/list/groups/by/category',[
    itemcontroller.list_groups_by_category
  ]);
  app.get('/api/v1/enduser/list/items', [
    itemcontroller.getItems
  ]);
  app.get('/api/v1/enduser/list/itemById', [
    itemcontroller.getItemById
  ]);
};