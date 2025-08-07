"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Products",
      [
        {
          name: "Laptop",
          description: "High-performance laptop for work and gaming",
          price: 999.99,
          stock: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Smartphone",
          description: "Latest smartphone with advanced features",
          price: 699.99,
          stock: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Headphones",
          description: "Wireless noise-canceling headphones",
          price: 199.99,
          stock: 25,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
