const {Router} = require('express'); 
const router = Router();
const {protect} = require('../middleware/userControl');
const {User} = require('../models/user');
const {Entry} = require('../models/entries');
const { validateEntryInput } = require('../middleware/entryControl');
const { viewsCounter } = require('../models/viewscounter');

const createViewsCounter = async () => {
    //runs once to create the viewCounter
    const viewsTable = await viewsCounter.find({});
    //make just one table to save the views counter. 
    if (viewsTable === undefined || viewsTable.length === 0) {
        viewsCounter.create({
            viewsCount: 0
        });
    }

} 
createViewsCounter();
//public route
router.get('/', async (req,res)=> {
    const limit = req.query.limit;
    const page = req.query.page; 
    const totalEntries = await Entry.countDocuments();
    const entries = await Entry.find({}).sort({_id:-1}).limit(parseInt(limit)).skip(page).select('-_id id userId username country comment createdAt');
    const response = {
        success:true,
        total_entries:totalEntries, 
        entries:entries,
    }
    
    res.json(response);
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
            comment:comment,
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

router.get('/documents',async (req,res)=> {
    let count = await Entry.countDocuments().exec();
    res.json({Entries:count});
})

router.delete('/delete/:id',protect,async (req,res)=> {
    const commentId = req.params?.id;
    const entry = await Entry.findOne({id:commentId});
    if(entry){
        if(entry.userId == req.user.userId){
             await Entry.deleteOne({id:entry.id}); 
            res.json({success:true,message:req.user.username, deletedComment:entry.comment});
        }else {
            res.json({success:false,message:'not authorized'});
        }
    }else {
        res.json({success:false,message:'No Entry found'});
    }

      
});

router.get('/session',async (req,res)=> {
    let clientIp = req.header('x-forwarded-for') || req.socket.remoteAddress;
     await viewsCounter.updateOne({},{$inc:{viewsCount:1}}); 
      const views = await viewsCounter.findOne({});

    res.json({
        ipadress:clientIp,
        views_counts:views?.viewsCount
    });
});

module.exports = router; 