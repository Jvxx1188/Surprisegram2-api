const express = require('express')
const bcrypt = require('bcrypt')
const app = express()

//MODELS
const User =require('../../database/models/User')

//REGISTER
module.exports = 