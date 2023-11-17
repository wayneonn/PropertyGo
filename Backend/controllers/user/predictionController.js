const sharp = require('sharp');
const { sequelize, Property, Image, User } = require('../../models');
const tf = require('@tensorflow/tfjs-node');
const csv = require('csv-parser');
const fs = require('fs');
const { Op } = require('sequelize');
const path = require('path');
const csvFilePath = path.join(__dirname, '../../assets/trainingData/ResaleflatpricesbasedonregistrationdatefromJan2017onwards.csv');
const data = [];
let minFloorArea = Infinity;
let maxFloorArea = -Infinity;
const inputs = []; // To store input features
const outputs = []; // To store resale prices
let FEATURE_RESULTS;
let INPUTS_TENSOR;
let OUTPUTS_TENSOR;
let model;

const lossHistory = {
    trainingLoss: [],
    validationLoss: [],
};

function loadModel() {
    // Load the model from the saved location
    const modelLoadPath = path.join(__dirname, 'trained_model/model.json');
    // console.log("modelLoadPath: ", modelLoadPath)
    return tf.loadLayersModel(`file://${modelLoadPath}`);
}

const calculateAveragePrices = async () => {
    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream('ResaleflatpricesbasedonregistrationdatefromJan2017onwards_appended copy.csv')
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                // Group by month and calculate average price
                const averagePrices = results.reduce((acc, val) => {
                    if (!acc[val.month]) {
                        acc[val.month] = { sum: 0, count: 0 };
                    }
                    acc[val.month].sum += parseFloat(val.resale_price);
                    acc[val.month].count += 1;
                    return acc;
                }, {});

                for (let month in averagePrices) {
                    averagePrices[month] = averagePrices[month].sum / averagePrices[month].count;
                }

                resolve(averagePrices);
            })
            .on('error', reject);
    });
};


// Route to get the average prices
async function averagePropertyPrices(req, res) {
    try {
        const averagePrices = await calculateAveragePrices();
        res.json(averagePrices);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Route to get the predicted price
async function predictPropertyPrices(req, res) {
    try {
        const { flatType, town, floor_area_sqm, year, month, lease_commence_date } = req.query;
        const input = [
            flatTypes.indexOf(flatType),
            towns.indexOf(town),
            // (parseFloat(floor_area_sqm) - minFloorArea) / (maxFloorArea - minFloorArea),
            parseFloat(floor_area_sqm),
            parseInt(year),
            parseInt(month),
            parseInt(lease_commence_date)
        ];
        console.log("input: ", input)

        // Load the pre-trained model
        const model = await loadModel();

        let newInput = normalize(tf.tensor2d([input]), FEATURE_RESULTS.MIN_VALUES, FEATURE_RESULTS.MAX_VALUES);
        let predictedPrice = model.predict(newInput.NORMALIZED_VALUES).dataSync()[0];

        // Make predictions using the trained model
        // const inputTensor = tf.tensor([input]);
        // const predictedPrice = model.predict(inputTensor).dataSync()[0];

        res.json({ predictedPrice });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}

const csvTownData = [
    "ANG MO KIO", 
    "BEDOK", 
    "BISHAN", 
    "BUKIT BATOK", 
    "BUKIT MERAH",
    "BUKIT PANJANG",
    "BUKIT TIMAH",
    "CENTRAL AREA",
    "CHOA CHU KANG",
    "CLEMENTI",
    "GEYLANG",
    "HOUGANG",
    "JURONG EAST",
    "JURONG WEST",
    "KALLANG/WHAMPOA",
    "MARINE PARADE",
    "PASIR RIS",
    "PUNGGOL",
    "QUEENSTOWN",
    "SEMBAWANG",
    "SENGKANG",
    "SERANGOON",
    "TAMPINES",
    "TOA PAYOH",
    "WOODLANDS",
    "YISHUN",
    //DATA NOT FOUND AGGREGATED BASED ON ONEMAPS DATA
    "Anson, Tanjong Pagar",
    "Telok Blangah, Harbourfront",
    "High Street, Beach Road (part)",
    "Middle Road, Golden Mile",
    "Little India",
    "Orchard, Cairnhill, River Valley",
    "Watten Estate, Novena, Thomson",
    "Macpherson, Braddell",
    "Katong, Joo Chiat, Amber Road",
    "Loyang, Changi",
    "Upper Bukit Timah, Clementi Park, Ulu Pandan",
    "Lim Chu Kang, Tengah",
    "Upper Thomson, Springleaf",
    "Seletar"
  ];
  

const flatTypes = ["1_ROOM", "2_ROOM", "3_ROOM", "4_ROOM", "5_ROOM", "EXECUTIVE", "MULTI-GENERATION"];
const csvFlatTypes = ["1 ROOM", "2 ROOM", "3 ROOM", "4 ROOM", "5 ROOM", "EXECUTIVE", "MULTI-GENERATION"];
const towns = [
    "Bishan, Ang Mo Kio", //ANG MO KIO
    "Bedok, Upper East Coast, Eastwood, Kew Drive", //BEDOK
    "Bishan, Ang Mo Kio", //BUKIT BATOK
    "Hillview, Dairy Farm, Bukit Panjang, Choa Chu Kang", //BUKIT PANJANG
    "Queenstown, Tiong Bahru", //BUKIT TIMAH
    "Hillview, Dairy Farm, Bukit Panjang, Choa Chu Kang", //CENTRAL AREA
    "Ardmore, Bukit Timah, Holland Road, Tanglin", //CHOA CHU KANG
    "Raffles Place, Cecil, Marina, People’s Park", //CLEMENTI
    "Hillview, Dairy Farm, Bukit Panjang, Choa Chu Kang", //GEYLANG
    "Pasir Panjang, Hong Leong Garden, Clementi New Town", //HOUGANG
    "Jurong", //JURONG EAST
    "Jurong", //JURONG WEST
    "Geylang, Eunos", //KALLANG/WHAMPOA
    "Bedok, Upper East Coast, Eastwood, Kew Drive", //MARINE PARADE
    "Tampines, Pasir Ris", //PASIR RIS
    "Serangoon Garden, Hougang, Punggol", //PUNGGOL
    "Queenstown, Tiong Bahru", //QUEENSTOWN
    "Yishun, Sembawang", //SEMBAWANG
    "Serangoon Garden, Hougang, Punggol", //SENGKANG
    "Balestier, Toa Payoh, Serangoon", //SERANGOON
    "Tampines, Pasir Ris", //TAMPINES
    "Balestier, Toa Payoh, Serangoon", //TOA PAYOH
    "Kranji, Woodgrove", //WOODLANDS
    "Yishun, Sembawang", //YISHUN
    "Anson, Tanjong Pagar",
    "Telok Blangah, Harbourfront",
    "High Street, Beach Road (part)",
    "Middle Road, Golden Mile",
    "Little India",
    "Orchard, Cairnhill, River Valley",
    "Watten Estate, Novena, Thomson",
    "Macpherson, Braddell",
    "Katong, Joo Chiat, Amber Road",
    "Loyang, Changi",
    "Upper Bukit Timah, Clementi Park, Ulu Pandan",
    "Lim Chu Kang, Tengah",
    "Upper Thomson, Springleaf",
    "Seletar"
];

// Define preprocessData function
function preprocessData(row) {

    const flatType = csvFlatTypes.indexOf(row.flat_type);
    const town = csvTownData.indexOf(row.town);

    // Normalize numerical feature floor_area_sqm
    // console.log("minFloorArea: ", minFloorArea)
    // console.log("maxFloorArea: ", maxFloorArea)

    // const floor_area_sqm = (parseFloat(row.floor_area_sqm) - minFloorArea) / (maxFloorArea - minFloorArea);
    const floor_area_sqm = parseFloat(row.floor_area_sqm);
    const lease_commence_date = parseInt(row.lease_commence_date);
    // Parse the month formatted as yyyy_mm
    const [year, month] = row.month.split('-').map(Number);

    return [flatType, town, floor_area_sqm, year, month, lease_commence_date];
}

fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        // Preprocess and add data to the array
        const processedRow = preprocessData(row);
        inputs.push(processedRow);
        outputs.push(parseFloat(row.resale_price));
        data.push({ features: processedRow, resale_price: parseFloat(row.resale_price) });

        // Track min and max floor_area_sqm
        const floorArea = parseFloat(row.floor_area_sqm);
        if (floorArea < minFloorArea) {
            minFloorArea = floorArea;
        }
        if (floorArea > maxFloorArea) {
            maxFloorArea = floorArea;
        }
    })
    .on('end', () => {

        // Split data into training, validation, and test sets
        tf.util.shuffleCombo(inputs, outputs);

        console.log("inputs: ", inputs)
        console.log("outputs: ", outputs)

        INPUTS_TENSOR = tf.tensor2d(inputs);
        OUTPUTS_TENSOR = tf.tensor1d(outputs);

        FEATURE_RESULTS = normalize(INPUTS_TENSOR);
        console.log('Normalized Values:');
        FEATURE_RESULTS.NORMALIZED_VALUES.print();


        console.log('Min Values:');
        FEATURE_RESULTS.MIN_VALUES.print();


        console.log('Max Values:');
        FEATURE_RESULTS.MAX_VALUES.print();

        INPUTS_TENSOR.dispose();

        model = tf.sequential();

        // Add a dense layer with 512 units and specify the input shape
        model.add(tf.layers.dense({ inputShape: [6], units: 512, activation: 'relu' }));

        // Add additional hidden layers with 'relu' activation for non-linearity
        model.add(tf.layers.dense({ units: 1024, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 512, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 256, activation: 'relu' }));

        // Add the output layer with 1 unit for regression output
        model.add(tf.layers.dense({ units: 1 }));

        model.summary();

        // train();
    });

function normalize(tensor, min, max) {
    const result = tf.tidy(function () {
        // Find the minimum value contained in the Tensor for each column.
        const MIN_VALUES = min || tf.min(tensor, 0);

        // Find the maximum value contained in the Tensor for each column.
        const MAX_VALUES = max || tf.max(tensor, 0);

        // Now subtract the MIN_VALUES from every value in the Tensor
        // And store the results in a new Tensor.
        const TENSOR_SUBTRACT_MIN_VALUE = tf.sub(tensor, MIN_VALUES);

        // Calculate the range size of possible values for each column.
        const RANGE_SIZE = tf.sub(MAX_VALUES, MIN_VALUES);

        // Calculate the adjusted values divided by the range size as a new Tensor.
        const NORMALIZED_VALUES = tf.div(TENSOR_SUBTRACT_MIN_VALUE, RANGE_SIZE);

        return { NORMALIZED_VALUES, MIN_VALUES, MAX_VALUES };
    });

    return result;
}

async function train() {
    const LEARNING_RATE = 0.0000005; // Choose a learning rate that’s suitable for the data we are using.

    // Compile the model with the defined learning rate and specify a loss function to use.
    model.compile({
        // optimizer: tf.train.sgd(LEARNING_RATE),
        optimizer: 'adam',
        loss: 'meanSquaredError'
    });

    let results = await model.fit(FEATURE_RESULTS.NORMALIZED_VALUES, OUTPUTS_TENSOR, {
        validationSplit: 0.15,
        shuffle: true,
        batchSize: 32,
        epochs: 200,
    });

    OUTPUTS_TENSOR.dispose();

    FEATURE_RESULTS.NORMALIZED_VALUES.dispose();

    lossHistory.trainingLoss.push(results.history.loss);
    lossHistory.validationLoss.push(results.history.val_loss);


    fs.writeFile('loss_history.json', JSON.stringify(lossHistory), (err) => {
        if (err) {
            console.error('Error writing loss history to file:', err);
        } else {
            console.log('Loss history saved to loss_history.json');
        }
    });

    const modelSavePath = path.join(__dirname, 'trained_model');
    if (true) {
        model.save(`file://${modelSavePath}`)
            .then(() => {
                console.log('Model saved locally.');
                modelCreated = true;
            })
            .catch((err) => {
                console.error('Error saving the model:', err);
            });
    }

    console.log("Average error loss: " + Math.sqrt(results.history.loss[results.history.loss.length - 1]));
    console.log("Average validation error loss: " +
        Math.sqrt(results.history.val_loss[results.history.val_loss.length - 1]));

    evaluate(); // Once trained evaluate the model.

}

function evaluate() {

    // Predict answer for a single piece of data.
    tf.tidy(function () {
        let newInput = normalize(tf.tensor2d([[2, 1, 74, 2019, 10, 1970]]), FEATURE_RESULTS.MIN_VALUES, FEATURE_RESULTS.MAX_VALUES);
        let output = model.predict(newInput.NORMALIZED_VALUES);
        output.print();
    });

    //Clean Tensor
    FEATURE_RESULTS.MIN_VALUES.dispose();
    FEATURE_RESULTS.MAX_VALUES.dispose();
    model.dispose();

    console.log(tf.memory().numTensors);
}

module.exports = {
    averagePropertyPrices,
    predictPropertyPrices,
};
