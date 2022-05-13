import React, { useState, useEffect, useContext } from 'react';
import ContactContext from '../../context/contact/ContactContext';

const ContactForm = () => {
  const [contact, setContact] = useState({
    fullname: '',
    email: '',
    phone: '',
    type: 'personal',
  });

  const contactContext = useContext(ContactContext);
  const { addContact, updateContact, clearCurrent, current } = contactContext;

  useEffect(() => {
    if (current) {
      setContact(current);
    } else {
      setContact({
        fullname: '',
        email: '',
        phone: '',
        type: 'personal',
      });
    }
  }, [contactContext, current]);

  const onChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const clearAll = () => {
    clearCurrent();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!current) {
      addContact(contact);
    } else {
      updateContact(contact);
    }
    clearAll();
  };

  const { fullname, email, phone, type } = contact;

  return (
    <form onSubmit={onSubmit}>
      <h2 className='text-primary'>
        {current ? 'Edit Contact' : 'Add Contact'}
      </h2>
      <input
        name='fullname'
        type='text'
        placeholder='fullname'
        value={fullname}
        onChange={onChange}
      />
      <input
        name='email'
        type='email'
        placeholder='email'
        value={email}
        onChange={onChange}
      />
      <input
        name='phone'
        type='text'
        placeholder='phone'
        value={phone}
        onChange={onChange}
      />
      <h5>Contact Type</h5>
      <input
        type='radio'
        name='type'
        value='personal'
        onChange={onChange}
        checked={type == 'personal'}
      />
      Personal
      <input
        type='radio'
        name='type'
        value='professional'
        onChange={onChange}
        checked={type == 'professional'}
      />
      Professional
      <div>
        <input
          type='submit'
          value={current ? 'Edit Contact' : 'Add Contact'}
          className='btn btn-primary btn-block'
        />
      </div>
      {current && (
        <div>
          <button className='btn btn-light btn-block' onClick={clearAll}>
            Clear
          </button>
        </div>
      )}
    </form>
  );
};

export default ContactForm;
