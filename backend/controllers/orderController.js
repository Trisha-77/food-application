import orderModel from './../models/orderModel.js';
import userModel from './../models/userModel.js';
import foodModel from './../models/foodModel.js';
import Stripe from "stripe"

const stripe =  new Stripe(process.env.STRIPE_SECRET_KEY)

// Placing user order for frontend
const placeOrder = async (req, res) =>{
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    try {
        if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        const requestedItems = new Map();
        for (const item of req.body.items) {
            const quantity = Number(item.quantity);
            if (!item._id || !Number.isInteger(quantity) || quantity < 1) {
                return res.status(400).json({ success: false, message: "Invalid cart item" });
            }
            const id = String(item._id);
            requestedItems.set(id, (requestedItems.get(id) || 0) + quantity);
        }

        const foods = await foodModel.find({ _id: { $in: [...requestedItems.keys()] } });
        if (foods.length !== requestedItems.size) {
            return res.status(400).json({ success: false, message: "One or more menu items are unavailable" });
        }

        const items = foods.map((food) => ({
            _id: food._id,
            name: food.name,
            price: food.price,
            quantity: requestedItems.get(String(food._id)),
        }));
        const deliveryFee = 2;
        const amount = items.reduce((total, item) => total + item.price * item.quantity, 0) + deliveryFee;

        const newOrder = new orderModel({
            userId: req.body.userId,
            items,
            amount,
            address: req.body.address
        })

        await newOrder.save();

        const line_items = items.map((item)=>({
            price_data :{
                currency: "usd",
                product_data:{
                    name: item.name
                },
                unit_amount:Math.round(item.price*100)
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data :{
                currency:"usd",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:deliveryFee*100
            },
            quantity:1
        })

        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:'payment',
            metadata: { orderId: String(newOrder._id) },
            success_url:`${frontendUrl}/verify?success=true&orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${frontendUrl}/verify?success=false&orderId=${newOrder._id}`
        })

        res.json({success:true, session_url:session.url})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }
}

const verifyOrder = async (req, res) =>{
    const {orderId, success, sessionId} = req.body;
    try {
        if(success=='true'){
            if (!sessionId) return res.status(400).json({success:false, message:"Missing payment session"});
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            if (session.payment_status !== 'paid' || session.metadata.orderId !== String(orderId)) {
                return res.status(400).json({success:false, message:"Payment has not completed"});
            }
            const order = await orderModel.findByIdAndUpdate(orderId,{payment:true}, { new: true });
            if (!order) return res.status(404).json({success:false, message:"Order not found"});
            await userModel.findByIdAndUpdate(order.userId,{cartData:{}});
            res.json({success:true, message:"Paid"})
        }else{
            res.json({success:false, message:"Not Paid"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }
}

// user orders for frontend
const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId})
        res.json({success:true, data:orders})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }
}

// listing orders for admin panel
const listOrders = async (req,res) =>{
   try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({success:true, data:orders})
   } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})  
   } 
}

// api for updating order status
const updateStatus = async (req, res) =>{
    try {
        const allowedStatuses = ['Food Processing', 'Out for delivery', 'Delivered'];
        if (!allowedStatuses.includes(req.body.status)) {
            return res.status(400).json({success:false, message:'Unsupported order status.'});
        }
        const order = await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status}, {new:true})
        if (!order) return res.status(404).json({success:false, message:'Order not found.'});
        res.json({success:true, message:"Order status updated successfully.", data:order})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:"Unable to update order status."})
    }
}

export {placeOrder, verifyOrder, userOrders,listOrders, updateStatus}
