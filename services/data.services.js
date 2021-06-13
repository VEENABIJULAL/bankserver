const db=require('./db');
//let currentuser;
let accountdetails={
    1000: {acno:1000, username:"userone", password:"userone", balance:50000},
    1001: {acno:1001, username:"usertwo", password:"usertwo", balance:5000},
    1002: {acno:1002, username:"userthree", password:"userthree", balance:10000},
    1003: {acno:1003, username:"userfour", password:"userfour", balance:6000},
}
const register=(uname,acno,pswd)=>{
  return db.User.findOne({acno})
  .then(user=>{
    if(user){
      return {
          status:false,
          statusCode:422,
          message: "user exist please login"
        }
      
    }
    else{
      const newUser=new db.User({
        acno,
        username:uname,
        password:pswd,
        balance:0
      })
      newUser.save();
      return{
        status:true,
        statusCode:200,
        message: "Registered succcessfully"
    }

  }
})
}
const login=(req,accno,password)=>{
    var acno=parseInt(accno);
    return db.User.findOne({acno,password})
    .then(user=>{
      if(user){
          req.session.currentuser=user;
          console.log(req.session.currentuser);
          return{
            status:true,
            statusCode:200,
            message:"login success"
          }
          
        }
        else{
          return{
            status:false,
            statusCode:422,
            message: "Invalid credentials"
          }
        }
    })
      
}
const deposit=(acno,password,amt)=>{
      
      var amount=parseInt(amt);
      return db.User.findOne({acno,password})
      .then(user=>{
        if(!user){
          return {
            status:false,
              statusCode:422,
              message: "invalid credentials"
          }
        }
        user.balance+=amount;
        user.save();
        return {
          status:true,
          statusCode:200,
          balance:user.balance,
          message:amount+" credited and new balance is "+user.balance

        }
      })
}
     

const withdraw=(acno,password,amt)=>{
   var amount=parseInt(amt);
   console.log(amount);
    return db.User.findOne({acno,password})
    .then(user=>{
      if(!user){
        return {
          status:false,
          statusCode:422,
          message: "invalid credentials"
        }
      }
     if(user.balance<amount){
        return {
          status:false,
          statusCode:422,
          message: "insufficient balance"
        }
      }
      user.balance-=amount;
      user.save();
      return {
        status:true,
        statusCode:200,
        balance:user.balance,
        message:amount+" debited and new balance is "+user.balance

      }
    })
}
      
     

  module.exports={
      register,
      login,
      deposit,
      withdraw

  }
