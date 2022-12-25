import express, { request } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();
 
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

// create an instance of OpenAI

const openai = new OpenAIApi(configuration);

//initialize the express app
const app = express();

// set up the middleware
app.use(cors()); // allow to make cors origin requests and allows the server to be called from the frontend
app.use(express.json()) //allows to pass json from frontend to backend

app.get('/',async(req,res)=>{
    res.status(200).send({
        message: 'hello from ChatBot'
    })
})

app.post('/',async(req,res)=>{
    try {
        const prompt = req.body.prompt;
        //getting response from openApi
        const response = await openai.createCompletion({    //create completion is a function that accepts objects
            model: "text-davinci-003",
            prompt: `${prompt}`,    //from frontend i.e textarea
            temperature: 0,       //higher the temperature model will take more risks 
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,   //won't generate same response often
            presence_penalty: 0,
        });

        //after getting the response back , send the response to the frontend
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({error});
    }
})

// make sure that the server always listens to the requests
app.listen(5000, ()=> console.log('server running on port http://localhost:5000'));