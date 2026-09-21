import  jwt  from 'jsonwebtoken';

const authMiddleware = async (req, res, next) =>{
    const {token} = req.headers;
    if(!token){
        return res.status(401).json({success:false, message:'Not authorized. Please sign in again.'})
    }

    try {
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        req.user = { id: token_decode.id, role: token_decode.role };
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({success:false, message:'Not authorized. Please sign in again.'})
    }
}

export default authMiddleware;
