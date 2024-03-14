// Opendatasoft Explore API v2 
// https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/controle_techn/records?limit=20&refine=code_postal%3A%2249100%22&refine=cct_code_commune%3A%22Angers%22
async function getTop10GarageLeastPricy(city, postalCode) {
    let offset = 0;
    let limit = 10;
    const url = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/controle_techn/records?limit=${limit}&refine=code_postal%3A%22${postalCode}%22&refine=cct_code_commune%3A%22${city}%22&offset=${offset}`
    console.log('URL : ', url);
    const response = await fetch(url);
    const data = await response.json();
    let nbTotal = data.total_count;
    let results = data.results;
    let denomination = [];
    results = results.filter((garage) => {
        if (denomination.indexOf(garage.cct_denomination) === -1) {
            denomination.push(garage.cct_denomination);
            return true;
        }
        return false;
    });
    console.log('Results : ', results.length);
    return results
}

// Opendatasoft Explore API v2
async function getGarages(city, postalCode) {
    let offset = 0;
    let limit = -1;
    const url = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/controle_techn/records?limit=${limit}&refine=code_postal%3A%22${postalCode}%22&refine=cct_code_commune%3A%22${city}%22&offset=${offset}`
    console.log('URL : ', url);
    const response = await fetch(url);
    const data = await response.json();
    let nbTotal = data.total_count;
    let results = data.results;
    while (nbTotal > 100 && nbTotal != results.length) {
        offset += 100;
        const url = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/controle_techn/records?limit=${limit}&refine=code_postal%3A%22${postalCode}%22&refine=cct_code_commune%3A%22${city}%22&offset=${offset}`
        console.log('URL : ', url);
        const response = await fetch(url);
        const data = await response.json();
        results = results.concat(data.results);
    }
    let denomination = [];
    results = results.filter((garage) => {
        if (denomination.indexOf(garage.cct_denomination) === -1) {
            denomination.push(garage.cct_denomination);
            return true;
        }
        return false;
    });
    console.log('Results : ', results.length);
    return results
}



export { getTop10GarageLeastPricy, getGarages };