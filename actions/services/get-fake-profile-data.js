const faker = require("faker");
const fs = require("fs");

async function getFakeProfile() {
  let person = {
    mobilePhone: { number: faker.phone.phoneNumber("##########") },
    personalEmail: { address: faker.internet.exampleEmail() },
    person: {
      name: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      },
    },
  };

  return person;
}

module.exports = { getFakeProfile };
