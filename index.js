let main = document.querySelector('main')
let form = document.querySelector('form')
let dark = document.querySelector('.dark-mode')
let selectRegion = document.querySelector('#filterSelect')
let results = document.createElement('section')
results.remove()
//search by region
selectRegion.addEventListener('change',async function(){
    let region = this.value;
    let result = await axios.get(`https://restcountries.eu/rest/v2/region/${region}`)
    results.innerHTML = ' '
result.data.forEach(data =>{
    parseCountry(data)
    let resultsDiv = [...document.querySelectorAll('.results-div')];
   resultsDiv.forEach(div=>{
     div.addEventListener('click',function (e){
        let chosenDiv = e.target.parentElement.parentElement;
        let countryName = chosenDiv.querySelector('h3').innerHTML;
        // console.log(countryName)
        window.open("/pages/info.html",'_blank');
        localStorage.setItem('country',`${countryName}`);
     })
   })
})
})
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


results.setAttribute('class'," results contain")

function createElements(element,value){
       let spanFirst = document.createElement('span');
       let spanSecond = document.createElement('span');
       let p = document.createElement('p');
       spanFirst.innerHTML = element;
       spanSecond.innerHTML = value;
       p.append(spanFirst,' ',spanSecond);
   return p;

}

function parseCountry ({flag,name,population,region,capital,nativeName,subregion,topLevelDomain,currencies,languages,borders}){
    // console.log(`nativeName : ${nativeName}, subregion : ${subregion}`)

    let money = '';
    let language = '';
    let border = ''
    let domains = ''
    topLevelDomain.forEach((domain)=>{
        domains +=  ' ' + domain + ' '
     })
     currencies.forEach((currency)=>{
         money +=  ' ' + currency.name + ' '
     })
     languages.forEach((speaks)=>{
        language += ' ' + speaks.name + ' '
    })
    borders.forEach((bound)=>{
        border += ' ' + bound + ' '

    })
// console.log(`native name : ${nativeName} ,domain : ${domains} , currency : ${money}, language : ${language}, border : ${border}, subregion : ${subregion}`)
      
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
       //population
       let popParent = createElements('population',population);
       //region
       let regionParent = createElements('region',region);
       //capital
       let capitalParent = createElements('capital',capital)
    //   console.log(header.innerText, capitalParent.innerText)
      let valueDiv = document.createElement('div')
      valueDiv.append(header,popParent,regionParent,capitalParent)
      valueDiv.setAttribute('class','value-div')
      mainDiv.append(imgDiv,valueDiv);
      mainDiv.setAttribute('class','results-div')
      results.append(mainDiv)
      main.append(results)
}
let searchCountry = async (input) =>{
try {
    let result = await axios.get(`https://restcountries.eu/rest/v2/name/${input}`)
    //display none the preloader
    let data = result.data;
    data.forEach(country => {
    parseCountry(country)     
    // console.log(country)
 });
} catch (e) {
    //display none the preloader
    country = {
        flag:'/image/error.jpg',
        name:input,
        population:'N/A',
        region:'N/A',
        capital:'N/A'
    }
    parseCountry(country)
 }
}


form.addEventListener('submit',async function (e) {
    e.preventDefault();
    results.innerHTML = ' '
    let input = this.querySelector('input').value;
    
    await searchCountry(input);
  //adapting the windows open on the form search
  let resultsDiv = [...document.querySelectorAll('.results-div')];
   resultsDiv.forEach(div=>{
     div.addEventListener('click',function (e){
        let chosenDiv = e.target.parentElement.parentElement;
        let countryName = chosenDiv.querySelector('h3').innerHTML;
        // console.log(countryName)
        window.open("/pages/info.html",'_blank');
        localStorage.setItem('country',`${countryName}`);
     })
   })
})
//default search on load
async function defaultLoad (){
let result = await axios.get('https://restcountries.eu/rest/v2/all')
result.data.forEach(async function(data){
    await parseCountry(data)
    //adapting the windows open on page load
   let resultsDiv = [...document.querySelectorAll('.results-div')];
   resultsDiv.forEach(div=>{
     div.addEventListener('click',function (e){
        let chosenDiv = e.target.parentElement.parentElement;
        let countryName = chosenDiv.querySelector('h3').innerHTML;
        // console.log(countryName)
        window.open("/pages/info.html",'_blank');
        localStorage.setItem('country',`${countryName}`);
     })
   })
   
})
}
defaultLoad();
