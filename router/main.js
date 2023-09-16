const {Router} = require('express'); 
const router = Router();
const {protect} = require('../middleware/validate');
const {User} = require('../models/user'); 


//public route
router.get('/', protect, async (req,res)=> {
    res.json({status:'success',message:`Hello ${req.user.username} You are on the home`});
}); 





module.exports = router; 