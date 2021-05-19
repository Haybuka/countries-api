let main = document.querySelector('main')
let form = document.querySelector('form')
let dark = document.querySelector('.dark-mode')
let selectRegion = document.querySelector('#filterSelect')
let loader = document.querySelector('.loader')
let results = document.createElement('section')
let darkMode = false;
results.remove()
//search by region
selectRegion.addEventListener('change',async function(){
    let region = this.value;
    let result = await axios.get(`https://restcountries.eu/rest/v2/region/${region}`)
    results.innerHTML = ' '
result.data.forEach(data =>{
    parseCountry(data);
    main.style.height = 'auto'
    let resultsDiv = [...document.querySelectorAll('.results-div')];
   resultsDiv.forEach(div=>{
     div.addEventListener('click',function (e){
        let chosenDiv = e.target.parentElement.parentElement;
        let countryName = chosenDiv.querySelector('h3').innerHTML;
        window.open("/pages/info.html");
        localStorage.setItem('country',`${countryName}`);
     })
   })
})
})
dark.addEventListener('click',(e)=>{
    darkMode = !darkMode;
    console.log(darkMode)
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


// results.setAttribute('class'," results contain")
results.setAttribute('class'," results")

//function to create elements

function createElements(element,value){
       let spanFirst = document.createElement('span');
       let spanSecond = document.createElement('span');
       let p = document.createElement('p');
       spanFirst.innerHTML = element;
       spanSecond.innerHTML = value;
    //    p.append(spanFirst,' ',spanSecond);
       p.append(spanSecond);
   return p;

}

//Parse Countries and destructure api data

function parseCountry ({flag,name,population,region,capital,nativeName,subregion,topLevelDomain,currencies,languages,borders}){
  
      let mainDiv = document.createElement('div')

       //flag and flag div handling
       let img = document.createElement('img')
       img.src = flag;
       img.setAttribute('alt',`${name}`)
       let imgDiv = document.createElement('div')
       imgDiv.setAttribute('class',"img-div")
       imgDiv.append(img)

       //name
       let header = document.createElement('h3')

       header.innerHTML = name;

       //population and number formatter
       let formatter = new Intl.NumberFormat('en-US');
       let populations = formatter.format(population); 
           let popParent = createElements('population',populations);

       //region 
       let regionParent = createElements('region',region);

       //capital
       let capitalParent = createElements('capital',capital)

       //Handling image display and appending
       let valueDiv = document.createElement('div')
       valueDiv.append(header,popParent,regionParent,capitalParent)
       valueDiv.setAttribute('class','value-div')
       mainDiv.append(imgDiv,valueDiv);
       mainDiv.setAttribute('class','results-div')
       mainDiv.setAttribute("data-aos","fade-up");
       mainDiv.setAttribute("data-aos-duration","1200");
       results.setAttribute("data-aos","fade-down");
       results.append(mainDiv)
       main.append(results)
}

//Handle search and call search

let searchCountry = async (input) =>{
    //try catch block for async usage

try {
    let result = await axios.get(`https://restcountries.eu/rest/v2/name/${input}`)
    //display none the preloader
    loader.classList.add('display')
    main.style.height = "80vh"
    let data = result.data;
    data.forEach(country => {
    parseCountry(country)     
 });
} catch (e) {
    //display none the preloader
    loader.classList.add('display')

    //data for failed searches 
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

//Display result on input used

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

       //open new window on click
        window.open("/assets/pages/info.html",'_blank');

        //closes the previous tab
        setTimeout(() => {
          window.close("/assets/pages/info.html");
        }, 5000);
    
        localStorage.setItem('country',`${countryName}`);
     })
   })
})


//Display results on page load 

async function defaultLoad (){
let result = await axios.get('https://restcountries.eu/rest/v2/all')
loader.classList.add('display')
result.data.forEach(async function(data){
    await parseCountry(data)
    //adapting the windows open on page load
   let resultsDiv = [...document.querySelectorAll('.results-div')];
   resultsDiv.forEach(div=>{
     div.addEventListener('click',function (e){
        let chosenDiv = e.target.parentElement.parentElement;
        let countryName = chosenDiv.querySelector('h3').innerHTML;
        // console.log(countryName)
        // window.open("/pages/info.html",'_blank');
        // localStorage.setItem('country',`${countryName}`);
     })
   })
   
})
}
//call page load data,uncomment to have all displayed at once
// defaultLoad();

AOS.init();