// // for testing
// module.exports = (sequelize, DataTypes) => {
//     const Vehicles = sequelize.define('Vehicles', {
//         type: {
//           type: DataTypes.STRING,
//         },
//         make: {
//           type: DataTypes.STRING,
//         },
//         model: {
//           type: DataTypes.STRING,
//         },
//         year: {
//           type: DataTypes.INTEGER,
//         },
//       });
      
//       const Cars = sequelize.define('Cars', {
//         wheels: {
//           type: DataTypes.INTEGER,
//         },
//       });
      
//       const Trucks = sequelize.define('Trucks', {
//         bedSize: {
//           type: DataTypes.FLOAT,
//         },
//       });
      
//       const Bikes = sequelize.define('Bikes', {
//         engineSize: {
//           type: DataTypes.FLOAT,
//         },
//       });
      
//       Vehicles.hasMany(Cars, { as: 'cars', foreignKey: 'VehicleId', sourceKey: 'id', scopes: { type: 'car' } });
//       Vehicles.hasMany(Trucks, { as: 'trucks', foreignKey: 'VehicleId', sourceKey: 'id', scopes: { type: 'truck' } });
//       Vehicles.hasMany(Bikes, { as: 'bikes', foreignKey: 'VehicleId', sourceKey: 'id', scopes: { type: 'bike' } });

//       return Vehicles;
// }
