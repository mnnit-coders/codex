import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form =document.querySelector('form');
const chatcontainer=document.querySelector('#chat_container');

let loadinterval;
function loader(element){
  element.textContent='';
  loadinterval=setInterval(()=>{
   element.textContent+='.';
   if(element.textContent==='....'){
    element.textContent='';
   }
  },300)
}

function typetext(element,text){
  let index=0;
  let interval=setInterval(()=>{
    if(index<text.length){
      element.innerHTML+=text.charAt(index);
      index++;
    }
    else{
      clearInterval(interval);
    }
  },20)
}

function generateuniqueid(){
 const timestamp=Date.now();
 const randomnumber=Math.random();
 const hexadecimalstring=randomnumber.toString(16);
 return `id-${timestamp}-${hexadecimalstring}`
}


function chatstripe(isai,value,uniqueid){
  return (
    `
    <div class="wrapper ${isai&&'ai'}">
    <div class="chat">
    <div class="profile">
    <img
    src="${isai?bot:user}"
    alt="${isai?'bot':'user'}"
    />
    </div>
    <div class="message" id=${uniqueid}>
    ${value}</div>
    </div>
    </div>
    `
  )
}

const handlesubmit=async(e)=>{
  e.preventDefault();
   const data=new FormData(form);
   chatcontainer.innerHTML+=chatstripe(false,data.get('prompt'));
   form.reset();

   const uniqueid=generateuniqueid();
   chatcontainer.innerHTML+=chatstripe(true," ",uniqueid);
   chatcontainer.scrollTop=chatcontainer.scrollHeight;
   const messagediv=document.getElementById(uniqueid);
   loader(messagediv);
  const response =await fetch('https://fastcodex.onrender.com/',{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      prompt:data.get('prompt')
    })
  })
  clearInterval(loadinterval);
  messagediv.innerHTML="";
  // console.log(response);
   if(response.ok){
    const data=await response.json();
    const parsedata=data.bot.trim();
    // console.log(data.bot)
    typetext(messagediv,parsedata);
   }
   else{
    const err=await response.text();
    messagediv.innerHTML="something went wrong";
    alert(err);
   }
}

form.addEventListener('submit',handlesubmit);
form.addEventListener('keyup',(e)=>{
  if(e.keyCode===13){
    handlesubmit(e);
  }
})


