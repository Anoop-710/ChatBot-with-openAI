import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat-container');

let loadInterval;

// function to load messages
function loader(element){
    element.textContent = '';

    loadInterval = setInterval(() =>{
        element.textContent += '.';

        if(element.textContent === '....'){
            element.textContent = '';
        }
        //if loading reaches 4 dots reset it to empty string
    },300)
}


//function to set interval for the bot to return a message/solution
function typeText(element,text){
    let index = 0;
    let interval = setInterval(()=>{
        if(index < text.length){
            // bot still typing
            element.innerHTML += text.charAt(index);
            // returns char at that index
            index++;
        }
        else{
            clearInterval(interval);
        }
    },20)
}


function generateUID(){
    // Mostly unique id is generated by timestamps
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexaDecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexaDecimalString}`;
}


function chatStripe(isAI, value, uid){
    return(
        `
        <div class="wrapper ${isAI && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img
                        src=${isAI ? bot: user}
                        alt="${isAI ? 'bot': 'user'}"
                    />
                </div>

                <div class="message" id=${uid}>${value}</div>
            </div>
        </div>
        
        `
    )
}

const handleSubmit = async   (e) => {
    e.preventDefault();

    const data = new FormData(form) //form from query selector above

    //user's chat
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))    //false indicates that its users query not ai's chat

    form.reset();


    //bot's chat
    const uniqueID = generateUID();
    chatContainer.innerHTML += chatStripe(true, "", uniqueID);
    
    chatContainer.scrollTop = chatContainer.scrollHeight;

    //to fetch newly created div
    const messageDiv = document.getElementById(uniqueID);
    
    loader(messageDiv)
}


form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if(e.keyCode === 13) {
        handleSubmit(e);
    }
})