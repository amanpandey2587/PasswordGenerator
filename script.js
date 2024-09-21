const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkBox]");
const symbol='!"#$%&()*+,-./:;<=>?@[\]^_{|}';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
// let strength circle color is gray
setIndicator("#ccc");

function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min)) +"% 100%"
}
function setIndicator(color){
    indicator.style.backgroundColor=color;
    // shadow
    indicator.style.textShadow='0px 0px 12px 1px $(color)';
}

function getRndInterger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}
//math.random=0 to 1 ki beech mai ek random deta hai
//math.random*(max-min)=0 to max-min ke beech mai random no.
// math.floor to convert the floating no to int
// math.random*(max-min)+min = min to max ke beech mai random no.


function generateRandomNumber(){
    return getRndInterger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRndInterger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRndInterger(65,91));
}
function generateSymbol(){
    const randNum=getRndInterger(0,symbol.length);
    return symbol.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="fail";
    }
    // to make copy wala msg visible
    copyMsg.classList.add("active");
    setTimeout(()  => {
        copyMsg.classList.remove("active");
    },2000);
}
function shufflePassword(array){
    // fisher yates method
    for(let i=array.length-1;i>0;i--){
        // finding a random index in the range of 0 to i+1
        const j=Math.floor(Math.random()*(i+1));
        // swapping the no at i and j index
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })
    // Special Condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{
    // none of the checkbox are selected
    if(checkCount<=0){
        return;
    }
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    // let's start the journey of finding new Password 
    // remove old passWord
    password="";

    // let's put the stuff mentioned by checkboxes 
    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }

    let funcArr=[];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }
    // compulsory Addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    // remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex=getRndInterger(0,funcArr.length);
        password+=funcArr[randIndex]();
    }
    // shuffle the password
    password=shufflePassword(Array.from(password));
    // show in UI 
    passwordDisplay.value=password;
    // calling the strength function
    calcStrength();
})
