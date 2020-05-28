import {
  validateEmail, isValidDate, validateEmpty,
  validateLengthNames, validateConsecutiveChar, validateAlphabets
} from 'utils/validators';

class FHC {
  constructor(props = {}) {
    Object.assign(this, {
      family_status: {},
    }, props);
  }

  get dob() {
    return this._dob;
  }
  set dob(val) {
    this._dob = val;
    this.age = this.calculateAge();
  }

  get num_kids() {
    const children = this.family_status.children;
    return (`${children || 0}`);
  }
  set num_kids(val) {
    Object.assign(this.family_status, { children: val });
  }

  get is_married() {
    return this.family_status.spouse;
  }
  set is_married(val) {
    this.family_status.spouse = val;
  }

  getCopy() {
    return JSON.parse(JSON.stringify(this));
  }

  calculateAge() {
    const birthday = this.dob.replace(/\\-/g, '/').split('/').reverse().join('/');
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  isValidName() {
    if (
      (this.name.split(" ").filter(e => e).length < 2) ||
      !validateEmpty(this.name)
    ) {
      this.name_error = 'Enter valid full name';
    } else if (!validateConsecutiveChar(this.name)) {
      this.name_error = 'Name can not contain more than 3 same consecutive characters';
    } else if (!validateAlphabets(this.name)) {
      this.name_error = 'Name can contain only alphabets';
    } else {
      this.name_error = '';
    }
    return (this.name_error ? false : true);
  }

  isValidDOB() {
    if (!isValidDate(this.dob)) {
      this.dob_error = 'Please select valid date';
    } else if (this.age < 0) {
      this.dob_error = 'Future date is not allowed';
    } else {
      this.dob_error = '';
    }
    return (this.dob_error ? false : true);
  }

  isValidEmail() {
    if (this.email.length < 10 || !validateEmail(this.email)) {
      this.email_error = 'Please enter valid email';
    } else {
      this.email_error = '';
    }
    return (this.email_error ? false : true);
  }
}

export default FHC;