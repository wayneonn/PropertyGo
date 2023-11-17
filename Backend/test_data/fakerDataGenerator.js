// This is the faker data generator for Transactions (and other data points as needed).
// I am using this when I need to piss fake values into the DB.

const { faker }  = require('@faker-js/faker');
const {Transaction, Property, Request, Invoice, User, Chat} = require("../models")
const { Op, Sequelize } = require('sequelize');


const getRandomPropertyId = async (USER_ID) => {
  const properties = await Property.findAll({
    attributes: ["propertyListingId"],
  });
  const propertyIds = properties.map((p) => p.propertyListingId);
  return faker.helpers.arrayElement(propertyIds);
};

const getRandomInvoiceId = async (USER_ID) => {
  const invoices = await Invoice.findAll({ attributes: ["invoiceId"] });
  const invoicesId = invoices.map((p) => p.invoiceId);
  return faker.helpers.arrayElement(invoicesId);
};

const getRandomRequestId = async (USER_ID) => {
  const requests = await Request.findAll({ attributes: ["requestId"] });
  const requestId = requests.map((p) => p.requestId);
  return faker.helpers.arrayElement(requestId);
};

const one_year_ago = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0]
const today = new Date().toISOString().split('T')[0]


exports.createFakeRequests = async (numOfRecords, User, Chat) => {
    const requests = [];
    const transactions = [];
    for (let i = 0; i < numOfRecords; i++) {
        // Assuming User and Chat models have some records to associate with
        // const randomUser = await User.findOne({ order: Sequelize.random(), attributes: ['id'] });
        // const randomChat = await Chat.findOne({ order: Sequelize.random(), attributes: ['id'] });

        const fakeRequest = {
            price: faker.finance.amount(50, 5000, 2),
            createdAt: faker.date.between({from:one_year_ago, to:today}),
            jobTitle: faker.person.jobTitle(),
            jobDescription: faker.lorem.paragraph(),
            userId: faker.helpers.arrayElement([2,3,4,7,8,9]), // Assuming User model is available and has some records
            chatId: null // Optional, based on available Chat records
        };
        requests.push(fakeRequest);

        // Then we push the transactions in?
        const fakeTransaction = {
            onHoldBalance: faker.finance.amount(300, 1000, 2),
            status: faker.helpers.arrayElement(['PENDING', 'PAID']),
            buyerId: faker.number.int({min: 3, max:6}),
            requestId: i + 2,
            transactionItem: "SERVICE",
            invoiceId: faker.number.int({min:1, max:6}),
            createdAt: faker.date.between({from:one_year_ago, to:today}),
            quantity: 1
        };
        transactions.push(fakeTransaction);
    }
    try {
        await Request.bulkCreate(requests);
        await Transaction.bulkCreate(transactions)
        console.log('Fake requests + transactions created successfully.');
    } catch (error) {
        console.error('Error creating fake requests:', error);
    }
};

exports.createFakeTransactions = async (numOfRecords) => {
    const transactions = [];
    for (let i = 0; i < numOfRecords; i++) {
        // const requestId = await getRandomRequestId()
        // const invoiceId = await getRandomInvoiceId()
        // const propertyId = await getRandomPropertyId()
        const transactionItem = faker.helpers.arrayElement(["Token Purchase", "Option Fee"]);
        const fakeTransaction = {
            onHoldBalance: faker.finance.amount(300, 1000, 2),
            status: faker.helpers.arrayElement(['PENDING', 'PAID']),
            buyerId: faker.number.int({min: 3, max:6}),
            propertyId: faker.number.int({min:1, max:29}),
            transactionItem: transactionItem,
            invoiceId: faker.number.int({min:1, max:6}),
            createdAt: faker.date.between({from:one_year_ago, to:today}),
            quantity: transactionItem === "Token Purchase" ? faker.helpers.arrayElement([5, 10, 15, 20, 25,30, 40, 50]): 1
        };
        transactions.push(fakeTransaction);
    }

  try {
    await Transaction.bulkCreate(transactions);
    console.log("Fake transactions created successfully.");
  } catch (error) {
    console.error("Error creating fake transactions:", error);
  }
};

exports.generateFakeProperties = async (numOfRecords) => {
  const properties = [];

  for (let i = 0; i < numOfRecords; i++) {
    const fakeProperty = {
      propertyListingId: null, // Auto-incremented by database
      postedAt: faker.date.between({ from: "2023-01-01", to: "2023-12-31" }),
      description: faker.lorem.sentence(),
      price: parseFloat(faker.finance.amount(10000, 100000, 2)),
      offeredPrice: faker.datatype.boolean()
        ? parseFloat(faker.finance.amount(9000, 95000, 2))
        : null,
      title: faker.lorem.words(5),
      bed: faker.number.int({ min: 1, max: 5 }),
      bathroom: faker.number.int({ min: 1, max: 4 }),
      size: faker.number.int({ min: 500, max: 2000 }),
      tenure: faker.number.int({ min: 30, max: 99 }),
      propertyType: faker.helpers.arrayElement(["RESALE", "NEW_LAUNCH"]),
      propertyStatus: faker.helpers.arrayElement([
        "ACTIVE",
        "ON_HOLD",
        "COMPLETED",
      ]),
      postalCode: faker.number.int({ min: 1, max: 999999 }),
      unitNumber: faker.number.int({ min: 1, max: 1000 }).toString(),
      address: faker.location.streetAddress(),
      area: faker.location.city(),
      region: faker.location.state(),
      boostListingStartDate: faker.datatype.boolean()
        ? faker.date.between({ from: "2023-01-01", to: "2023-12-31" })
        : null,
      boostListingEndDate: faker.datatype.boolean()
        ? faker.date.between({ from: "2023-01-01", to: "2023-12-31" })
        : null,
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      sellerId: faker.number.int({ min: 1, max: 5 }),
    };

    properties.push(fakeProperty);
  }
  try {
    await Property.bulkCreate(properties);
    console.log("Fake properties created successfully.");
  } catch (error) {
    console.error("Error creating fake properties:", error);
  }
};
