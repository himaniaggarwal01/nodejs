const express = require('express');

const router = express.Router()

const Model = require('../models/model');

const ImageModel = require('../models/imagemodel');

var multer  = require('multer')

const jwt = require('jsonwebtoken');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

module.exports = router;

//Post Method
router.post('/post', async (req, res) => {
    let jwtToken = process.env.JWT_TOKEN;
    const data = new Model({
        user_id: req.body.user_id,
        course_module_id: req.body.course_module_id,
        parent_id: req.body.parent_id,
        content: req.body.content
    })

    try {
        const token = req.headers['authorization'];
        if(token!==null && token==jwtToken){
            const dataToSave = await data.save();
            res.status(200).json(dataToSave)
        }
        else
        {
             res.status(400).json({message: 'Authentication failed'})
        }
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.post('/profile-upload-single', upload.single('profile-file'), function (req, res, next) {
  console.log(JSON.stringify(req.file))
  var response = "Files uploaded successfully.<br>"
  response += `<img src="${req.file.path}" /><br>`
  const data = new ImageModel({
        user_id: req.body.user_id,
        course_module_id: req.body.course_module_id,
        parent_id: req.body.parent_id,
        content: req.file.path,
        type: req.body.type
    })

    try {
        const dataToSave = data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//for creating secret token that we have stored in env file
router.post("/generateToken", (req, res) => {
    const token_secret = require('crypto').randomBytes(64).toString('hex');

    res.send(token_secret);
});

router.post("/generateJwtToken", (req, res) => {
    // Validate User Here
    // Then generate JWT Token
  
    let jwtSecretKey = process.env.TOKEN_HEADER_KEY;
    let data = {
        time: Date()
    }
  
    const token = jwt.sign(data, jwtSecretKey);
  
    res.send(token);
})

router.post('/profile-upload-multiple', upload.array('files', 12), function (req, res, next) {
    for(var i=0;i<req.files.length;i++){
        const data = new ImageModel({
            discussion_id: req.body.discussion_id,
            content: req.files[i].path
        })
        const dataToSave = data.save();
    }
})

//Get all Method
router.get('/getAll', async (req, res) => {
    try{
        const data = await Model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
    try{
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
//Update by ID Method
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.user_id} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})