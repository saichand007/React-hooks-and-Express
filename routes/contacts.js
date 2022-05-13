const express = require('express');
const router = express.Router();
const config = require('config');
const UserModel = require('../models/user');
const ContactModel = require('../models/contact');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Contact = require('../models/contact');

//@route  Get api/contacts
//@desc   Get all user contatcts
//@access  Private
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await ContactModel.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//@route  Post api/contact
//@desc   Add a contact to a user
//@access  Private
router.post(
  '/',
  [auth, [check('fullname', 'Name is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, phone, type } = req.body;
    try {
      const newContact = new Contact({
        fullname,
        email,
        phone,
        type,
        user: req.user.id,
      });
      const contact = await newContact.save();
      res.json(contact);
    } catch (err) {
      console.log('err=', err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route  Put api/conatct
//@desc   Update a contact of user
//@access  Private
router.put(
  '/:id',
  [auth, [check('fullname', 'Name is required').not().isEmpty()]],
  async (req, res) => {
    const { fullname, email, phone, type } = req.body;
    const contactFields = {};
    if (fullname) contactFields.fullname = fullname;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;
    if (type) contactFields.type = type;

    try {
      let contact = await ContactModel.findById(req.params.id);
      if (!contact) return res.status(404).json({ msg: 'Contact not found' });

      if (contact.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      contact = await ContactModel.findByIdAndUpdate(
        req.params.id,
        { $set: contactFields },
        { new: true }
      );
      res.json(contact);
    } catch (err) {
      console.log('err=', err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route  Deletet api/conatct
//@desc   Update a contact of user
//@access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await ContactModel.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: 'Contact Not found' });
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await ContactModel.findByIdAndRemove(req.params.id);
    res.json({ message: 'Contact removed' });
  } catch (err) {
    console.log('err=', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
