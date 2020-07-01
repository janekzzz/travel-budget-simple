import axios from 'axios';
export const getRates = async (cur) => {
    try {
        const res = await axios(`https://api.exchangeratesapi.io/latest?base=${cur}`)
    } catch (error) {
        console.log(error)
    }
}