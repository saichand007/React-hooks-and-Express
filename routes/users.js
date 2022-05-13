const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const UserModel = require('../models/user');

//@route  Post api/users
//@desc Register a user
//@access Public
router.post(
  '/',
  [
    check('fullname', 'Name is Required').not().isEmpty(),
    check('email', 'Plz include a valid email').isEmail(),
    check('password', 'Password should be 6 or more chars').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { fullname, email, password } = req.body;

      let user = await UserModel.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      user = new UserModel({
        fullname,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log('error=', err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

module.exports = router;
