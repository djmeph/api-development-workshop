const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const SALT_WORK_FACTOR = require('../config.json').SALT_WORK_FACTOR;

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
});

const reasons = UserSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1
};

UserSchema.methods.comparePassword = (candidatePassword, cb) => {

  bcrypt.compare(candidatePassword, this.password, (e, isMatch) => {
    if (e) return cb(e);
    cb(null, isMatch);
  });

}

UserSchema.statics.getAuthenticated = (email, password, cb) => {

  this
    .findOne({ email: email })
    .exec((e, user) => {

      if (e) return cb(e);
      if (!user) return cb(null, null, reasons.NOT_FOUND);

      user.comparePassword(password, (e, isMatch) => {
        if (e) return cb(e);
        if (isMatch) return cb(null, user);
      });

    });

}

UserSchema.pre('save', (next) => {

  var user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, (e, salt) => {

    if (e) return next(e);

    bcrypt.hash(user.password, salt, null, (e, hash) {
      if (e) return next(e);
      user.password = hash;
      next();
    });

  });

});

module.exports = mongoose.model('User', UserSchema);
