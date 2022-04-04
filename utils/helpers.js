const axios = require('axios');
const fs = require('fs');
const path = require('path');
const apiKey = '65a46a3c3c9c4a87ab07b6a72500b80d';
const app_id = 'da7832c0ca6348198c52bfe2392243b1';
const date = new Date().toISOString().substring(0, 10);

const generateExchanges = async () => {
    let result = {};
    // const exchangeRatesResp = await axios.get(`https://data.fixer.io/api/latest?access_key=${apiKey}`);
    const exchangeRatesResp = await axios.get(`https://openexchangerates.org/api/latest.json?app_id=${app_id}`);
    if (exchangeRatesResp.status == 200) {
        const exchangeRateJson = JSON.stringify(exchangeRatesResp.data);
        result["data"] = exchangeRateJson;
    } else {
        result["err"] = "Failed to get data"
    }
    return result;
}

calculateConversion = (base, from, to) => {
    from = parseFloat(from);
    to = parseFloat(to);
    const exchangeRate = Math.abs( to/from);
    return exchangeRate;
}

exports.generateExchanges = generateExchanges;
exports.calculateConversion = calculateConversion;