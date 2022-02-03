const { Item } = require('../dto/items')
const { Groups } = require('../dto/groups')
const { Categories } = require('../dto/categories')
const { ItemCart } = require('../dto/cart_items')
const { User } = require('../dto/users')
var crypto = require("crypto");
const { Support } = require('../dto/support')
const { isValidObjectId } = require('mongoose')

//Category methods
exports.list_category = async (req, res) => {
  Categories.find(function (error, info) {
    if (error) {
      res.json({
        message: "error",
        status_code: 200,
      });
    } else {
      res.json({
        message: "success",
        items: info,
        status_code: 200,
      });
    }
  });
}

exports.create_category = async (req, res) => {

  var id = crypto.randomBytes(20).toString('hex');
  const category = {
    category_id: id
  };
  const payload = Object.assign(req.body, category);

  Categories.create(payload, function (error, response) {
    if (error) {
      console.log('Error occurred while inserting');
      // return 
    } else {
      console.log('inserted record', response);
      // return 
      res.json({
        message: "success",
        result: response,
        status_code: 200,
      });
    }
  });

}
exports.update_category = async (req, res) => {
  const id = req.query._id;
  Categories.findByIdAndUpdate({ _id: id }, { $set: req.body }, function (error, response) {
    if (error) {
      console.log('Error occurred while inserting');
      // return 
    } else {
      console.log('inserted record', response);
      // return 
      res.json({
        message: "success",
        result: response,
        status_code: 200,
      });
    }
  });
}
exports.delete_category = async (req, res) => {
  const id = req.query._id;
  Categories.deleteOne({ _id: id }).then((data) => {
    res.json({
      message: "success",
      status_code: 200,
    });
  })
    .catch((error) => {
      console.log("delete category error")
    })
}

//groups method
exports.create_group = async (req, res) => {
  var id = crypto.randomBytes(20).toString('hex');
  const group = {
    group_id: id
  };
  const payload = Object.assign(req.body, group);

  Groups.create(payload, function (error, response) {
    if (error) {
      console.log('Error occurred while inserting');
      // return 
    } else {
      console.log('inserted record', response);
      // return 
      res.json({
        message: "success",
        result: response,
        status_code: 200,
      });
    }
  });
}
exports.update_group = async (req, res) => {
  const id = req.query._id;
  Groups.findByIdAndUpdate({ _id: id }, { $set: req.body }, function (error, response) {
    if (error) {
      console.log('Error occurred while inserting');
      // return 
    } else {
      console.log('inserted record', response);
      // return 
      res.json({
        message: "success",
        result: response,
        status_code: 200,
      });
    }
  });
}
exports.list_groups = async(req, res) =>{
  Groups.find({}).exec(function (err, result) {
  var category_ids = result.map(data => data.category_id)
                            .filter(d => d != null) 
 Categories.find({'category_id':{$in:category_ids}}, function(err, categories) {
    var category_id_to_name ={}
    categories.map(category => category_id_to_name[category.category_id]=category.name)
    result = result.map(function(data) {
        data.set('category_name',category_id_to_name[data.category_id] , {strict: false});
        return data;
    });
  res.json(result);
});
 
});

 }

exports.list_groups_by_category = async (req, res) => {
  const data = { "category_id": { $in: req.body.category_id } };
  const info = await Groups.find(data);
  if (info) {
    res.json({
      message: "success",
      items: info,
      status_code: 200,
    });
  }
}

exports.delete_group = async (req, res) => {
  const id = req.query._id;
  Groups.deleteOne({ _id: id }).then((data) => {
    res.json({
      message: "success",
      status_code: 200,
    });
  })
    .catch((error) => {
      console.log("delete group error")
    })
}
//items method
exports.search = async (req, res) => {
  let offset = parseInt(req.query.offset)
  let limit = parseInt(req.query.limit)
  let item = req.body
  let serach_items = []
  for (let key in item) {
    if (key == 'price') {
      item[key].forEach(element => {
        let prices = element.split('-')
        let above = parseInt(prices[0])
        let below = parseInt(prices[1])
        serach_items.push({ 'price': { '$gte': above, '$lte': below } })
      })
    }
    else {
      let search_query = {};
      let q = { '$in': item[key] }
      search_query[key] = q;
      serach_items.push(search_query)
    }
  }
  let items = await Item.find({ '$or': serach_items }).skip(offset).limit(limit)

  res.json({
    message: "success",
    items: items,
    status_code: 200,
  });
}

exports.get_similar_products = async (req, res) => {
  let group = req.query.group
  let offset = req.query.offset
  let limit = req.query.limit
  Item.find({ 'group': group }).skip(offset).limit(limit).toArray(function (error, info) {
    if (error) {
      res.json({
        message: "error",
        status_code: 200,
      });
    } else {
      res.json({
        message: "success",
        items: info,
        status_code: 200,
      });

    }
  });


}

exports.cart_item_create = async(req, res) =>{
  Item.findOne({'_id':req.body.item_id},{_id:0}, function (error, itemInfo) {
    if(error) {
        console.log('Error occurred while inserting');
       // return 
    } else {
      const cartInfo = Object.assign({...itemInfo._doc,'email':req.body.email,'quantity':1,wishlist:false})
      ItemCart.create(cartInfo,function (error, response) {
        if(error) {
            console.log('Error occurred while inserting',error);
           // return 
        } 
        else {
           res.json({
            message: "success",
            result: response,
            status_code: 200,
         });
        }
      })
    }
})
}

exports.cart_item_delete = async (req, res) => {
  const id = req.query._id;
  ItemCart.deleteOne({ _id: id }).then((data) => {
    res.json({
      message: "success",
      status_code: 200,
    });
  })
    .catch((error) => {
      console.log("delete cart error",error)
    })
}

exports.cart_item_update = async (req, res) => {
  const id = req.query._id;
  ItemCart.findByIdAndUpdate({ _id: id }, { $set: req.body }, function (error, response) {
    if (error) {
      console.log('Error occurred while inserting');
      // return 
    } else {
      res.json({
        message: "success",
        result: response,
        status_code: 200,
      });
    }
  });
}


exports.create = async (req, res) => {
  var id = crypto.randomBytes(20).toString('hex');
  const item = {
    item_id: id
  };
  const payload = Object.assign(req.body, item);
  Item.create(payload, function (error, response) {
    if (error) {
      console.log('Error occurred while inserting');
      // return 
    } else {
      console.log('inserted record', response);
      // return 
      res.json({
        message: "success",
        result: response,
        status_code: 200,
      });
    }
  });
}
exports.item_update = async (req, res) => {
  const id = req.query._id;
  Item.findByIdAndUpdate({ _id: id }, { $set: req.body }, function (error, response) {
    if (error) {
      console.log('Error occurred while inserting');
      // return 
    } else {
      console.log('inserted record', response);
      // return 
      res.json({
        message: "success",
        result: response,
        status_code: 200,
      });
    }
  });
}

exports.item_delete = async (req, res) => {
  const id = req.query._id;
  Item.deleteOne({ _id: id }).then((data) => {
    res.json({
      message: "success",
      status_code: 200,
    });
  })
    .catch((error) => {
      console.log("delete item error")
    })
}

exports.getTotalItems = async (req, res) => {
  let items = await Item.find();
  res.json({
    message: "success",
    items: items,
    status_code: 200,
  });
}
exports.getItems = async (req, res) => {
  // let offset = parseInt(req.query.offset)
  // let limit = parseInt(req.query.limit)
  // let items = await Item.find({ 'group_id': group_id }).skip(offset).limit(limit)
  const group_id = req.query.group_id
  const items = await Item.find({ group_id: group_id })
  res.json({
    message: "success",
    items: items,
    status_code: 200
  });
}
exports.getItemById = async (req, res) => {
  console.log("req",req)
  const item_id = req.query._id
  const items = await Item.find({ _id: item_id })
  res.json({
    message: "success",
    items: items,
    status_code: 200
  });
}



// exports.delete_category = async (req, res) => {

//   Groups.deleteOne({ "category_id": req.body.category_id })
//   res.json({
//     message: "success",

//     status_code: 200,
//   });
// }


// exports.cart_item_create = async (req, res) => {
//   ItemCart.create(req.body)
//   res.json({
//     message: "success",
//     status_code: 200,
//   });
// }

exports.get_cart_items = async (req, res) => {
  // let offset = req.query.offset
  // let limit = req.query.limit
  ItemCart.find({ 'email': req.body.email }, function (error, response) {
    if (error) {
      console.log('Error occurred while inserting');
      // return 
    } else {
      // return 
      res.json({
        message: "success",
        result: response,
        status_code: 200,
      });
    }
  });
}

exports.create_support = async (req, res) => {
  const payload = Object.assign(req.body);
  Support.create(payload, function (error, response) {
    if (error) {
      console.log('Error occurred while inserting');
      // return 
    } else {
      // return 
      res.json({
        message: "success",
        result: response,
        status_code: 200,
      });
    }
  });
}

exports.getSupport = async (req, res) => {
  Support.find(function (error, info) {
    if (error) {
      res.json({
        message: "error",
        status_code: 200,
      });
    } else {
      res.json({
        message: "success",
        items: info,
        status_code: 200,
      });
    }
  });
}
exports.getDashboard = async (req, res) => {
  try{
   const support = await Support.count();
   const item = await Item.count();
   const group = await Groups.count();
   const user = await User.count();
   const category = await Categories.count();
   res.json({
    message: "success",
    items: {support:support,item:item,group:group,user:user,category:category},
    status_code: 200,
  });
  }
  catch(error){
    res.json({
      message: "error",
      status_code: 200,
    });
  }
}