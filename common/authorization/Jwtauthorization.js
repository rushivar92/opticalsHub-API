const jwt = require('jsonwebtoken')
exports.createToken =(user)=>jwt.sign({ user: user}, 'ztborpwfphamtbrfwiowylnicpjwkxlotetmuvzdzf', {expiresIn: '1h'});


exports.verifyToken = (req, res, next) => jwt.verify(req.token, 'ztborpwfphamtbrfwiowylnicpjwkxlotetmuvzdzf', function(err, data){
    if(err){
      const result={message:"unauthorized user",code:401};
        res.status(401).json(result)
      }
    else{
      next() 
    }   
});