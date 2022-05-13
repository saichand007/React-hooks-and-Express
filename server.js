const express = require('express');
const connectDB = require('./config/db.js');
const path = require('path');

const app = express();

// app.get('/', (req, res) => res.json({ message :" welome to the new app user"}));

connectDB();

app.use(express.json({ extended: false }));

app.use('/api/users', require('./routes/users.js'));
app.use('/api/contacts', require('./routes/contacts.js'));
app.use('/api/auth', require('./routes/auth.js'));

//serve static assets in production
if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on  ${PORT}`));
