const BASE_URL = "https://api.coingecko.com/api/v3";
const loader = document.querySelector('.loader');
const tablebody = document.querySelector("#crypto_table tbody");
const previousButton = document.querySelector('#Prev');
const nextButton = document.querySelector('#Next');
const searchit=document.querySelector('#Search-box');
const sortasc=document.getElementById('sort_asc');
const sortdesc=document.getElementById('sort_desc');

const volumeasc=document.getElementById('volume_asc');
const volumedesc=document.getElementById('volume_desc');

const marketasc=document.getElementById('market_asc');
const marketdesc=document.getElementById('market_desc');


let coins = [];
const itemsPerPage = 10;
let currentPage = 1;

const options = {
    method: 'GET',
    headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-8WNeXqDKiAbbXTgymYgzt3wy",
    },
};

const fetchCoins = async (page) => {
    try {
        showLoader();
        const response = await fetch(`${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${itemsPerPage}&page=${page}&sparkline=false`, options);
        coins = await response.json();
        console.log(coins);
        return coins;
    } catch (err) {
        console.error(err);
    } finally {
        hideLoader();
    }
};

const showLoader = () => {
    loader.style.display = "block";
};

const hideLoader = () => {
    loader.style.display = "none";
};

const renderCoins = (coinsToDisplay) => {
    tablebody.innerHTML = "";
    coinsToDisplay.forEach((coin, index) => {
        const row = document.createElement("tr");
        row.className = "bordered-row";
        row.innerHTML = `
            <td>${(currentPage - 1) * itemsPerPage + index + 1}</td>
            <td><img src="${coin.image}" alt="${coin.name}" width="24" height="24"></td>
            <td>${coin.name}</td>
            <td>$${coin.current_price.toLocaleString()}</td>
            <td>$${coin.total_volume.toLocaleString()}</td>
            <td>$${coin.market_cap.toLocaleString()}</td>
            <td><i class="fa-solid fa-star"></i></td>
        `;
        tablebody.appendChild(row);
    });
};

const handlePrevButtonClicked = async () => {
    if (currentPage > 1) {
        currentPage--;
        const newCoins = await fetchCoins(currentPage);
        renderCoins(newCoins);
        updatePaginationControls();
    }
};

const handleNextButtonClicked = async () => {
    showLoader(); // Show the loader
    currentPage++;
    const newCoins = await fetchCoins(currentPage);
    coins = newCoins; // Update the coins array
    renderCoins(newCoins);
    hideLoader(); // Hide the loader
    updatePaginationControls();
};

const updatePaginationControls = () => {
    previousButton.disabled = currentPage === 1;
    previousButton.classList.toggle("disabled", currentPage === 1);
    nextButton.disabled = coins.length < itemsPerPage;
    nextButton.classList.toggle("disabled", coins.length < itemsPerPage);

   
};

const fetchSearchCoinByIds=async(coinIds)=>{
    try{
        showLoader();
        const response=await fetch(`${BASE_URL}/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}`, options);
        const data=await response.json();
        return data;  
        

    }
    catch(err){
      console.log(err);

    }
     finally{
        hideLoader();
     }    
}






const fetchsearchquery=async(searchQuery)=>{
    try{
        showLoader();
        const response=await fetch(`${BASE_URL}/search?query=${searchQuery}`,options);
        const data=await response.json();
        const filteredcoins=data.coins.map((coin)=>coin.id);
        const finalcoinsdata=await fetchSearchCoinByIds(filteredcoins);
        return finalcoinsdata;
     

    }
    catch(err){
        console.log(err);
         
    }
    finally{
        hideLoader();
    }
   

}


const handleSearchInput=async (e)=>{

    let searchQuery=e.target.value;

    if(searchQuery.length>1){
   const coinsdata= await fetchsearchquery(searchQuery);
   renderCoins(coinsdata,1);
   updatePaginationControls();
   previousButton.style.display="none";
   nextButton.style.display="none";
}
}




const sortCoinsByPrice = (order) => {
    coins.sort((a, b) =>
      order === "asc" ? a.current_price - b.current_price : b.current_price - a.current_price
    );
    renderCoins(coins,currentPage)
    updatePaginationControls()
  };



  const sortVolumeCoinsByPrice = (order) => {
    coins.sort((a, b) =>
      order === "asc" ? a.total_volume - b.total_volume : b.total_volume- a.total_volume
    );
    renderCoins(coins,currentPage)
    updatePaginationControls()
  };




  const sortMarketCoinsByPrice = (order) => {
    coins.sort((a, b) =>
      order === "asc" ? a.market_cap - b.market_cap : b.market_cap - a.market_cap
    );
    renderCoins(coins,currentPage)
    updatePaginationControls()
  };









searchit.addEventListener("keyup",handleSearchInput);

previousButton.addEventListener("click", handlePrevButtonClicked);
nextButton.addEventListener("click", handleNextButtonClicked);

sortasc.addEventListener("click",()=>sortCoinsByPrice("asc"));
sortdesc.addEventListener("click",()=>sortCoinsByPrice("desc"));

volumeasc.addEventListener("click",()=>sortVolumeCoinsByPrice("asc"));
volumedesc.addEventListener("click",()=>sortVolumeCoinsByPrice("desc"));

marketasc.addEventListener("click",()=>sortMarketCoinsByPrice("asc"));
marketdesc.addEventListener("click",()=>sortMarketCoinsByPrice("desc"));


window.onload = async () => {
    const newCoins = await fetchCoins(1);
    renderCoins(newCoins);
    updatePaginationControls();
};