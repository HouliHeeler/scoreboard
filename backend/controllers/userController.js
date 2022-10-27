const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @description  Register New User
// @route        POST /api/users
// @access       Public
const registerUser = asyncHandler(async(req,res) => {
    const { name, email, password, favouriteTeam} = req.body

    if(!name || !email || !password) {
        res.status(400)
        throw new Error('Please add all fields');
    }
    
    //Check if user exists

    const userExists = await User.findOne({email})

    if(userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    //Hash password

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //Create User

    const user = await User.create({
        name,
        email,
        favouriteTeam,
        password: hashedPassword,
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            favouriteTeam: user.favouriteTeam,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid User Data')
    }
})

// @description  Authenticate User
// @route        POST /api/login
// @access       Public
const loginUser = asyncHandler(async(req,res) => {
    const {email, password} = req.body

    //Check for user email
    const user = await User.findOne({email})

    //Check password
    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            favouriteTeam: user.favouriteTeam,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid Credentials')
    }
})

// @description  Get User Data
// @route        GET /api/users/me
// @access       Private
const getUserData = asyncHandler(async(req,res) => {
    res.status(200).json(req.user)
})

//Generate JWT

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
} 

module.exports = {registerUser, loginUser, getUserData}