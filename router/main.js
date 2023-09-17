const {Router} = require('express'); 
const router = Router();
const {protect} = require('../middleware/userControl');
const {User} = require('../models/user');
const {Entry} = require('../models/entries');
const { validateEntryInput } = require('../middleware/entryControl');


//public route
router.get('/', async (req,res)=> {
    const entries = await Entry.find({}).select('-_id id username country comment');
    res.json(entries);
}); 


router.post('/sign',protect,validateEntryInput,async (req,res)=> {
    const {comment}= req.body;
    const {userId,username,email,country} = req.user; 
    try {
        const entry = await Entry.create({
            username,
            userId:userId,
            email,
            country,
            comment,
        });

        res.status(200).json({success:true,
        message: 'Your comment has been add successfully! ',
        yourcomment:entry.comment}) ; 
        
    } catch (error) {
        console.log(error.message);
    }
});

router.put('/update/:id',protect,validateEntryInput,async (req,res)=> {
    const commentId = req.params.id;
    try {
        const entry = await Entry.findOne({id:commentId});
        if(entry){
            if(entry.userId === req.user.userId){
                entry.comment = req.body.comment || entry.comment
                const updatedComment = await entry.save(); 
                res.json({success:true,message:req.user.username, updatedComment: updatedComment.comment});
            }else {
                res.json({success:false,message:'not authorized'});
    
            }
        }else {
            res.json({success:false,message:'No Entry found'});
        }
    
    } catch (error) {
        console.log(error.message);
    }
      
});

router.delete('/delete/:id',protect,async (req,res)=> {
    const commentId = req.params?.id;
    const entry = await Entry.findOne({_id:commentId});
    if(entry){
        if(entry.userId == req.user._id){
             await Entry.deleteOne({_id:entry._id}); 
            res.json({success:true,message:req.user.username, deletedComment:entry.comment});
        }else {
            res.json({success:false,message:'not authorized'});

        }
    }else {
        res.json({success:false,message:'No Entry found'});

    }

      
});


module.exports = router; 