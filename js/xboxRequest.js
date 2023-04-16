import axios from 'axios'
import { Authflow } from 'prismarine-auth'
import converters from '../js/converters.js'

const BASE_URL = 'https://profile.xboxlive.com'
const USER_IDENTIFIER = 'KejonaMC'
const CACHE_DIR = './cache'
const PARAMS = {
    "settings": "Gamertag,GameDisplayPicRaw"
}

async function requestWebHandler(extention, res) {
    try {
        const flow = new Authflow(USER_IDENTIFIER, CACHE_DIR)
        const response = await flow.getXboxToken()
        const header = {
            'Content-Type': 'application/json',
            'Authorization': `XBL3.0 x=${response.userHash};${response.XSTSToken}`,
            'x-xbl-contract-version': '3'
        }
        const xboxResponse = await axios.get(BASE_URL + extention, { headers: header, params: PARAMS })
        if (xboxResponse.status === 200) {
            const bedrockData = converters.jsonCreator(xboxResponse.data)
            res.render('pages/account-info', { bedrockData: bedrockData })
        } else {
            res.render('pages/404')
        }
    } catch (error) {
        console.error(error)
        res.render('pages/account-not-found')
    }
}

async function requestAPIHandler(extention, res) {
    try {
        const flow = new Authflow(USER_IDENTIFIER, CACHE_DIR)
        const response = await flow.getXboxToken()
        const header = {
            'Content-Type': 'application/json',
            'Authorization': `XBL3.0 x=${response.userHash};${response.XSTSToken}`,
            'x-xbl-contract-version': '3'
        }
        const xboxResponse = await axios.get(BASE_URL + extention, { headers: header, params: PARAMS })
        if (xboxResponse.status === 200) {
            res.status(200).send(converters.jsonCreator(xboxResponse.data))
        } else {
            res.status(401).json({ message: 'Could not get account details from xbox api.' })
        }
    } catch (error) {
        console.error(error)
        res.status(400).json({ message: 'User not found.' })
    }
}

export default { requestAPIHandler, requestWebHandler }