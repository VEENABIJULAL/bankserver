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
    const login=(req,acno,password)=>{
      var acno=parseInt(acno);
      console.log(acno);
      return db.User.findOne({acno,password})
      .then(user=>{
        if(user){
          req.session.currentuser=user[acno]
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
    const deposit=(req,acno,pswd,amt)=>{
      if(!req.session.currentuser){
        return{
          statusCode:401,
          status:false,
          message:"please login"
        }
      }
      var amount=parseInt(amt);
      var user=accountdetails;
      if(acno in user){
        if(pswd==user[acno]["password"]){
          user[acno]["balance"]+=amount;
          return {
            status:true,
            statusCode:200,
            balance:user[acno]["balance"],
            message:amount+" credited and new balance is "+user[acno]["balance"]

          }
        }
        else{
          return{
            status:false,
            statusCode:422,
            message: "Incorrect password"
          }
        }
      }else{
        return {
          status:false,
            statusCode:422,
            message: "invalid account"
        }
      }  
  
    }  

    const withdraw=(acno,pswd,amt)=>{
      var amount=parseInt(amt);
      var user=accountdetails;
      if(acno in user){
        if(pswd==user[acno]["password"]){
          if(user[acno]["balance"]>amount){
            user[acno]["balance"]-=amount;
            return {
                status:true,
                statusCode:200,
                balance:user[acno]["balance"],
                message:amount+" debited and new balance is "+user[acno]["balance"]
            }
          }
          else{
            return{
              status:false,
            statusCode:422,
            message: "insufficient balance"
            }
          }
          
        }
        else{
          return{
            status:false,
            statusCode:422,
            message: "incorrct password"
          }
        }
      }else{
        return {
          status:false,
          statusCode:422,
          message: "invalid account"
        }
      }  
  
    }

  module.exports={
      register,
      login,
      deposit,
      withdraw

  }
