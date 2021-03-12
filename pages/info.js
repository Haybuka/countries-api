
let dark = document.querySelector('.dark-mode')
let main = document.querySelector('main')
let loader = document.querySelector('.loader')
let results = document.createElement('section')

dark.addEventListener('click',(e)=>{
    let icon = dark.querySelector('i');
    let roots = document.querySelector(':root');
    if(icon.className.includes('far')){
        icon.setAttribute('class','fas fa-moon');
        document.documentElement.style.setProperty('--light-bg', 'hsl(209, 23%, 22%)');
        document.documentElement.style.setProperty('--main-bg', 'hsl(207, 26%, 17%)');
        document.documentElement.style.setProperty('--light-text', 'hsl(0, 0%, 100%)');
    }else{
        icon.setAttribute('class','far fa-moon');
        document.documentElement.style.setProperty('--light-bg', 'hsl(0, 0%, 98%)');
        document.documentElement.style.setProperty('--main-bg', 'hsl(0, 0%, 91.8%)');
        document.documentElement.style.setProperty('--light-text', 'hsl(200, 15%, 8%)');

    }
})

//creating elements
function createElements(element,value){
       let spanFirst = document.createElement('span');
       let spanSecond = document.createElement('span');
       let p = document.createElement('p');
       spanFirst.innerHTML = element;
       spanSecond.innerHTML = value;
       p.append(spanFirst,' : ',spanSecond);
   return p;

}

//getting country name from local storage
let input = localStorage.getItem('country');

function parseCountry ({flag,name,population,region,capital,nativeName,subregion,topLevelDomain,currencies,languages,borders}){
    // let boundary = [...borders]
    let borderAside = document.createElement('aside')
    borderAside.innerText="Border Countries "
    borderAside.setAttribute('class','boundaries')
    borders.forEach((border)=>{
        let span = document.createElement('span');
        borderAside.appendChild(span)
        span.innerHTML = `${border} `
        console.log(span.innerHTML)
    })

    let money = '';
    let language = '';
    let border = ''
    let domains = ''
     if(currencies){
        currencies.forEach((currency)=>{
            money +=  ' ' + currency.name + ' '
        })
     }
     if(languages){
        languages.forEach((speaks)=>{
            language += ' ' + speaks.name + ' ,'
        })
     }
     if(borders){
        // borders.forEach((bound)=>{
    //     border += ' ' + bound + ' '
    // })
     }
   

      let mainDiv = document.createElement('div')
       //flag
       let img = document.createElement('img')
       img.src = flag;
       let imgDiv = document.createElement('div')
       imgDiv.setAttribute('class',"img-div")
       imgDiv.append(img)
       //name
       let header = document.createElement('h3')
         if(name.length > 20){
            // let names = 'United Kingdom of Great Britain and Northern Ireland'
            let newName = [...name.split(' ')]
            let adjustedName =  newName.splice(0,3)
            name = adjustedName.toString().split(',').join(' ') + ' ...'
         }
       header.innerHTML = name;
       //    native name
       let natName = createElements('Native Name',nativeName);
   
        // subRegion
       let subReg = createElements('Sub Region',subregion);
     
       //population
       let popParent = createElements('population',population);
       // money
       let moneyShow = createElements('currencies',money);
         // language
       let lingua = createElements('languages',language);
        
        //  region
       let regionParent = createElements('region',region);
        //    top level
       let topLevel = createElements('Top Level Domain',topLevelDomain);
      
     //  capital
       let capitalParent = createElements('capital',capital)
    //   console.log(header.innerText, capitalParent.innerText)
      let valueDiv = document.createElement('div')
      let rightDiv = document.createElement('div')
      valueDiv.append(header,natName,popParent,regionParent,subReg,capitalParent)
      rightDiv.append(topLevel,moneyShow,lingua)
      valueDiv.setAttribute('class','value-div')
      rightDiv.setAttribute('class','right-div')
      mainDiv.append(imgDiv,valueDiv,rightDiv,borderAside);
      mainDiv.setAttribute('class','results-div contain')
    //   results.append(mainDiv)
      main.append(mainDiv)
}

let searchCountry = async (input) =>{
try {
    let result = await axios.get(`https://restcountries.eu/rest/v2/name/${input}`)
    //display none the preloader
    loader.classList.add('display')
    let data = result.data;
    data.forEach(country => {
    parseCountry(country)  
    console.log(country)
    // console.log(country.name)
    // console.log(country.topLevelDomain)
 });
} catch (e) {
    //display none the preloader
    loader.classList.add('display')
    country = {
        flag:'/image/error.jpg',
        name:input,
        population:'N/A',
        region:'N/A',
        capital:'N/A',
        nativeName: 'N/A',
        subregion:'N/A',
        topLevelDomain : 'N/A',
        borders:'N/A'

    }
    parseCountry(country)
 }
}
searchCountry(input)
