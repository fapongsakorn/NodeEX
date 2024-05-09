var express = require('express');
var router = express.Router();
var multer = require('multer')
const userSchema = require('../models/users.model')
const bcrypt = require('bcrypt');

/* ------- Config Upload file ------- */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/profile')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '_' + file.originalname)
  }
})
const upload = multer({ storage: storage })

/* ------- Start API Users ------- */
/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    let params = req.params
    let querys = req.query

    let users = await userSchema.find({ role: 'user' , status: 1})

    // let hash = await bcrypt.hash("1234",10);

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error.toString())
  }
});

/* POST */
router.post('/api/v1/register', upload.single('image'), async function (req, res, next) {
  try {
    let { username, password,name ,role,status } = req.body

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = new userSchema({
      username,
      password: hashedPassword,
      name,
      role,
      status,
      file: req.file.filename
    })

    let save = await user.save()

    res.status(200).send(save);
  } catch (error) {
    res.status(500).send(error.toString())
  }
});

// /* PUT */
// router.put('/:id', async function (req, res, next) {
//   try {
//     let { name, age } = req.body

//     let update = await userSchema.findByIdAndUpdate(req.params.id, { name, age }, { new: true })

//     res.status(200).send(update);
//   } catch (error) {
//     res.status(500).send(error.toString())
//   }

// });

// /* DELETE */
// router.delete('/:id', async function (req, res, next) {
//   try {
    
//     let delete_user = await userSchema.findByIdAndDelete(req.params.id)

//     res.status(200).send(delete_user);
//   } catch (error) {
//     res.status(500).send(error.toString())
//   }

// });

module.exports = router;
