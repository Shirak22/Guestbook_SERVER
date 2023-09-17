

const validateEntryInput = (req, res, next) => {

    const body = req.body;
    if (body.hasOwnProperty('comment')){
        if (body.comment.length < 1200 && body.comment.length > 20 ) {
            next();
        } else {
            res.status(401).json({
                success:false,
                message:'Please make sure your input data are valid',
                validInput: ['Your comment should be min 20 characters and max 1200','spaces included! ']
            });
        }

        
    }else {
        res.status(401).json({success:false,message:'Please make sure you have \'comment\' property in you data body '});
    }
}


module.exports = {
    validateEntryInput,
}