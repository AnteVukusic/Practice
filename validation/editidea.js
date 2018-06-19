const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateEditIdeaInput = data => {
  //  Init erros empty object and set current state of Validation
  let errors = {};
  let isValid = true;

  if (!isEmpty(data.title)) {
    if (!Validator.isLength(data.title, { min: 4, max: 30 })) {
      errors.title = "Name must be between 4 and 30 characters";
    }
  }

  if (!isEmpty(data.description)) {
    if (!Validator.isLength(data.description, { min: 15, max: 300 })) {
      errors.description = "description must be between 15 and 300 characters";
    }
  }

  //    If there are erros set validator to false
  if (Object.keys(errors).length > 0) {
    isValid = false;
  }

  return {
    errors,
    isValid
  };
};

module.exports = validateEditIdeaInput;
