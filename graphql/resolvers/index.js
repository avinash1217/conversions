const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');
const helper = require('../../utils/helpers');
const User = require('../../models/user');
const constants = require('../../utils/constants');
const base = 1;
const toCurr = "SEK";
const secret = constants.secret;

const events = [];
const users = [];
const saltOrRounds = 10;

module.exports = {
    createUser: async (args) => {
        return User.findOne({
            username: args.userInput.username
        }).then(user => {
            if (user) {
                throw new Error('User exists already')
            }
            return bcrypt.hash(args.userInput.password, saltOrRounds)
        })
        .then(hashedPwd => {
                const user = new User({
                    username: args.userInput.username,
                    password: hashedPwd
                });
                return user.save()
            })
            .then(result => {
                return {...result._doc, password: null, _id: result.id};
            })
            .catch(err => {
            throw err;
        })
    },
    login: async (args) =>{
        const user = await User.findOne({
            username: args.userInput.username
        });
        if(!user) {
            throw new Error('Username does not exist')
        }
        const pwdMatch = await bcrypt.compare(args.userInput.password, user.password);
        if(!pwdMatch){
            throw new Error('Invalid credentials');
        }
        const token = jwt.sign({username: user.username}, secret , {
            expiresIn: '1h'
        })
        return {
            username: user.username,
            token: token,
            tokenExpiry: 1
        };
    },
    fetchCountryDetails: async (args, req) => {
        if(!req.isAuthenticated){
            throw new Error('User is not authenticated')
        }
        let fromCurr, respRates, toCurr, toRate;
        const name = args.countryInput.name;
        const response = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
        const result = response.data[0];
        let data = {}
        data["fullname"] = result["name"]["official"];
        data["population"] =  result["population"];
        data["currencies"]= JSON.stringify(result["currencies"]);

        const resp = await helper.generateExchanges();
        fromCurr = Object.keys(JSON.parse(data.currencies))[0];
        respRates = JSON.parse(resp.data);
        toCurr = "SEK";
        const conversion = await helper.calculateConversion(base, respRates["rates"][fromCurr], respRates["rates"][toCurr]);
        data["exchangeRate"] = conversion;
        return data;
    }
}