import {
  validateEmail, isValidDate, validateEmpty, validateNumber,
  validateConsecutiveChar, validateAlphabets,
} from 'utils/validators';

import { calculateAge } from 'utils/validators';

class FHC {
  name = '';
  email = '';
  age = '';
  gender = '';
  mobile_number = '';
  company = '';
  house = {};
  loan = {};
  salary = {};
  family_expence = '';
  family_status = { spouse: false, children: '0' };
  life_insurance = {};
  medical_insurance = {};
  tax_savings = {};
  investments = [];

  constructor(props = {}) {
    Object.assign(this, {
      family_status: { spouse: false, children: '0' },
      salary: {},
      loan: { car: {}, education: {} },
      house: {},
      life_insurance: {},
      medical_insurance: {},
      tax_savings: {},
      investments: [],
    }, props);
  }

  get dob() {
    return this._dob;
  }
  set dob(val) {
    this._dob = val;
    this.age = calculateAge(this._dob);
  }

  get num_kids() {
    const children = this.family_status.children;
    return `${children}`;
  }
  set num_kids(val) {
    const [kids] = val.toString().split('+'); // Remove 
    Object.assign(this.family_status, { children: kids });
  }

  get is_married() {
    return !!this.family_status.spouse;
  }
  set is_married(val) {
    this.family_status.spouse = val;
  }

  get annual_sal() {
    return this.salary.annual;
  }
  set annual_sal(val) {
    this.salary.annual = val.toString().replace(/\D/g, '');
    this['annual_sal_error'] = '';
  }

  get monthly_sal() {
    return this.salary.monthly;
  }
  set monthly_sal(val) {
    this.salary.monthly = val.toString().replace(/\D/g, '');
    this['monthly_sal_error'] = '';
  }

  get monthly_exp() {
    return this.family_expence;
  }
  set monthly_exp(val) {
    this.family_expence = val.toString().replace(/\D/g, '');
    this['monthly_exp_error'] = '';
  }

  get has_education_loan() {
    if (
      !this.loan.education ||
      [null, undefined, ''].includes(this.loan.education.is_present)
    ) return null;
    return this.loan.education.is_present;
  }
  set has_education_loan(val) {
    this.loan.education.is_present = val;
    this.has_education_loan_error = '';
    this.education_loan = 0;
  }

  get education_loan() {
    return this.loan.education.value;
  }
  set education_loan(val) {
    this.loan.education.value = val.toString().replace(/\D/g, '');
    this.education_loan_error = '';
  }

  get has_car_loan() {
    if (
      !this.loan.car ||
      [null, undefined, ''].includes(this.loan.car.is_present)
    ) return null;
    return this.loan.car.is_present;
  }
  set has_car_loan(val) {
    this.loan.car.is_present = val;
    this.has_car_loan_error = '';
    this.car_loan = 0;
  }

  get car_loan() {
    return this.loan.car.value;
  }
  set car_loan(val) {
    this.loan.car.value = val.toString().replace(/\D/g, '');
    this.car_loan_error = '';
  }

  get has_house_loan() {
    if (!this.house.type) return null;
    return this.house.type === 'own-house';
  }
  set has_house_loan(val) {
    this.house.type = val ? 'own-house' : 'none';
    this.has_house_loan_error = '';
    this.house_loan = 0;
  }
  get house_loan() {
    return ((this.house.type === 'own-house' && this.house.value) || 0);
  }
  set house_loan(val) {
    this.house.value = val.toString().replace(/\D/g, '');
    this.house_loan_error = '';
  }

  get pays_rent() {
    return this.house.type === 'rented-house';
  }
  set pays_rent(val) {
    this.house.type = val ? 'rented-house' : 'none';
    this.pays_rent_error = '';
    this.house_rent = 0;
  }
  get house_rent() {
    return ((this.house.type === 'rented-house' && this.house.value) || '');
  }
  set house_rent(val) {
    this.house.value = val.toString().replace(/\D/g, '');
    this.house_rent_error = '';
  }

  getCopy() {
    return JSON.parse(JSON.stringify(this));
  }

  isValidName() {
    if (!validateEmpty(this.name)) {
      this.name_error = 'Enter valid full name';
    } else if (!validateConsecutiveChar(this.name)) {
      this.name_error = 'Name can not contain more than 3 same consecutive characters';
    } else if (!validateAlphabets(this.name)) {
      this.name_error = 'Name can contain only alphabets';
    } else {
      this.clearErrors('name');
    }
    return (this.name_error ? false : true);
  }

  isValidDOB() {
    if (!isValidDate(this.dob)) {
      this.dob_error = 'Please select valid date';
    } else if (this.age < 0) {
      this.dob_error = 'Future date is not allowed';
    } else {
      this.clearErrors('dob');
    }
    return (this.dob_error ? false : true);
  }

  isValidEmail() {
    if (this.email.length < 10 || !validateEmail(this.email)) {
      this.email_error = 'Please enter valid email';
    } else {
      this.clearErrors('email');
    }
    return (this.email_error ? false : true);
  }

  isValidSalaryInfo() {
    let valid = true;
    const annual = Number(this.salary.annual);
    const monthly = Number(this.salary.monthly);
    if (!annual || !validateNumber(annual)) {
      this['annual_sal_error'] = 'Enter a valid Annual CTC';
      this['monthly_sal_error'] = 'Enter a valid Annual CTC first';
      valid = false;
    } else if (!monthly || !validateNumber(monthly)) {
      this['monthly_sal_error'] = 'Enter a valid Monthly Salary amount';
      valid = false;
    } else if (monthly > annual / 12) {
      this['monthly_sal_error'] = 'Monthly take home cannot be greater than CTC/12';
      valid = false;
    } else if (!Number(this.family_expence) || !validateNumber(this.family_expence)) {
      this['monthly_exp_error'] = 'Enter a valid Monthly Expense amount';
      valid = false;
    } else {
      this.clearErrors(['annual_sal', 'monthly_sal', 'monthly_exp']);
    }
    return valid;
  }

  isValidHouseInfo(prop) {
    let valid = true;
    if (prop === 'loan') {
      if (!this.house.type) {
        this.has_house_loan_error = 'Please select an option';
        valid = false;
      } else if (
        this.has_house_loan &&
        (!Number(this.house_loan) || !validateNumber(this.house_loan))
      ) {
        this.house_loan_error = 'Monthly EMI cannot be negative or 0';
        valid = false;
      } else {
        this.clearErrors(['has_house_loan', 'house_loan']);
      }
    } else if (prop === 'rent') {
      if (!this.house.type) {
        this.pays_rent_error = 'Please select an option';
        valid = false;
      } else if (
        this.pays_rent &&
        (!Number(this.house_rent) || !validateNumber(this.house_rent))
      ) {
        this.house_rent_error = 'Rent per month cannot be negative or 0';
        valid = false;
      } else {
        this.clearErrors(['pays_rent', 'house_rent']);
      }
    }
    return valid;
  }

  isValidLoanInfo(type) {
    let valid = true;
    if ([null, undefined, ''].includes(this.loan[type]['is_present'])) {
      this[`has_${type}_loan_error`] = 'Please select an option';
      valid = false;
    } else if (
      this[`has_${type}_loan`] &&
      (!Number(this[`${type}_loan`]) || !validateNumber(this[`${type}_loan`]))
    ) {
      this[`${type}_loan_error`] = 'Monthly EMI cannot be negative or 0';
      valid = false;
    } else {
      this.clearErrors([`has_${type}_loan`, `${type}_loan`]);
    }
    return valid;
  }

  isValidInsuranceInfo(type) {
    if (!type) return false;
    let valid = true;
    const { is_present, annual_premuim, cover_value } = this[`${type}_insurance`];
    
    if ([null, undefined, ''].includes(is_present)) {
      this[`${type}_is_present_error`] = 'Please select an option';
      valid = false;
    } else if (is_present && (!Number(annual_premuim) || !validateNumber(annual_premuim))) {
      this[`${type}_annual_premuim_error`] = 'Annual premium cannot be negative or 0';
      valid = false;
    } else if (is_present && (!Number(cover_value) || !validateNumber(cover_value))) {
      this[`${type}_cover_value_error`] = 'Coverage cannot be negative or 0';
      valid = false;
    } else {
      this.clearErrors([`${type}_is_present`, `${type}_annual_premuim`, `${type}_cover_value`]);
    }
    return valid;
  }

  isValidTaxes() {
    let { tax_saving_80C, tax_saving_80CCD, is_present } = this.tax_savings;
    tax_saving_80C = Number(tax_saving_80C);
    tax_saving_80CCD = Number(tax_saving_80CCD);
    let valid = true;
    
    if ([null, undefined, ''].includes(is_present)) {
      this.tax_is_present_error = 'Please select an option';
      valid = false;
    } else if (is_present) {
      if (!tax_saving_80C && !tax_saving_80CCD) {
        this.tax_saving_80C_error = 'Total tax saving cannot be negative or 0';
        this.tax_saving_80CCD_error = 'Total tax saving cannot be negative or 0';
        valid = false;
      } else if (tax_saving_80C > 150000) {
        this.tax_saving_80C_error = 'Please enter a valid value';
        valid = false;
      } else if (tax_saving_80CCD > 50000) {
        this.tax_saving_80CCD_error = 'Please enter a valid value';
        valid = false;
      } else if (tax_saving_80C && !validateNumber(tax_saving_80C)) {
        this.tax_saving_80C_error = 'Total tax saving cannot be negative or 0';
        valid = false;
      } else if (tax_saving_80CCD && !validateNumber(tax_saving_80CCD)) {
        this.tax_saving_80CCD_error = 'Total tax saving cannot be negative or 0';
        valid = false;
      }
    }
    if (valid) {
      this.clearErrors(['tax_saving_80C', 'tax_saving_80CCD', 'tax_is_present']);
    }
    return valid;
  }

  clearErrors(keys) {
    if (!Array.isArray(keys)) keys = [keys];
    keys.forEach(key => delete this[`${key}_error`]);
  }
}

export default FHC;