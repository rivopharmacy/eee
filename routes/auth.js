const { Router } = require("express");
const { 
    
    forgotPassword, 
    resetPassword, 
    sendEmailVerification, 
    signIn, 
    signOut, 
    signUp, 
    socialAuth, 
    verifyEmail 
} = require("../controllers/auth");
const { checkNecessaryParameters } = require("../middlewares/check_param");


const router = Router();

router.post("/login", checkNecessaryParameters(["email", "password", "isAdmin"]), signIn);

router.post("/signUp", checkNecessaryParameters(["email", "password"]), signUp);

router.post(
    "/social", 
    checkNecessaryParameters(["email", "firstName"]), 
    socialAuth,
);

router.post('/email', sendEmailVerification);

router.post('/email/verify', verifyEmail);

router.post('/forget-password', forgotPassword);

router.post('/reset-password', resetPassword);

router.post("/signout", signOut);

module.exports = { authRouter: router };
