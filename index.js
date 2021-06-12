const express=require('express');
const session=require('express-session');
const dataservice=require('./services/data.services');
const app=express();

app.use(session({
    secret:'randomsecurestring',
    resave:false,
    saveUninitialized:false
}));

app.use(express.json());

app.use((req,res,next)=>{
    console.log("Middleware");
    next();
})

const logMiddleware=(req,res,next)=>{
    console.log(req.body);
    next();
}

app.use(logMiddleware);

const authMiddleware=(req,res,next)=>{
    if(!req.session.currentuser){
        return res.json({
            statusCode:401,
            status:false,
            message:"please login"
        })
    }
    else{
        next();
    }
}

app.get('/',(req,res)=>{
    res.send("THIS IS A GET METHOD");
})

app.post('/',(req,res)=>{
    res.send("THIS IS A POST METHOD");
})
app.post('/register',(req,res)=>{
    dataservice.register(req.body.uname,req.body.acno,req.body.pswd)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
      
});
app.post('/login',(req,res)=>{
    dataservice.login(req,req.body.acno,req.body.pswd)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
});
    

app.post('/deposit',authMiddleware,(req,res)=>{
    const result=dataservice.deposit(req,req.body.acno,req.body.pswd,req.body.amount);
    res.status(result.statusCode).json(result)
})

app.post('/withdraw',authMiddleware,(req,res)=>{
    const result=dataservice.withdraw(req.body.acno,req.body.pswd,req.body.amount);
    res.status(result.statusCode).json(result)
})

app.put('/',(req,res)=>{
    res.send("THIS IS A PUT METHOD");
})

app.patch('/',(req,res)=>{
    res.send("THIS IS A PATCH METHOD");
})

app.delete('/',(req,res)=>{
    res.send("THIS IS A DELETE METHOD");
})

app.listen(3000,()=>{
    console.log("server created at port 3000");
})