const BASE_URL = "https://pokeapi.co/api/v2/";
const loadManyPokemon = BASE_URL + "pokemon/"
const loadManySpecies = BASE_URL + "pokemon-species/"
const typepic = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vii/lets-go-pikachu-lets-go-eevee/"
let allPokemonNames = []
let currentPokemonNames = []
let page = 1;


async function loadData() {
    await getPokemon()
    await loadAllPokemons()
}

function filterPokemon() {
    let searchbar = document.getElementById('searchbar')
    if (searchbar.value.length > 2) {
        currentPokemonNames = allPokemonNames.filter(pokemon => pokemon.startsWith(searchbar.value))
        renderFilteredPokemon()

    } else if (searchbar.value.length < 1) {
        page = 1
        const mainRef = document.getElementById("pokemons")
        mainRef.innerHTML = ""
        getPokemon()
    }
}

async function renderFilteredPokemon() {
    try {
        let mainRef = document.getElementById('pokemons')
        mainRef.innerHTML = "";
        for (let index = 0; index < currentPokemonNames.length; index++) {
            const response = await fetch(loadManyPokemon + currentPokemonNames[index])
            const result = await response.json()
            mainRef.innerHTML += pokeCardHTMLTemplate(result)
            let pokeTypesElement = document.getElementById("poketype-" + result.id)
            result.types.forEach(t => {
                let typePicId = t.type.url.slice(31, -1) // Slice everything before and after initial number
                pokeTypesElement.innerHTML += pokeCardTypeHTMLTemplate(typePicId)
            })
            let cardContainer = document.querySelector("#flipcard-" + result.id)
            cardContainer.innerHTML += pokeStatsHTMLTemplate(result)
        }
    } catch (error) {
        console.error(error.message);
    }
}

async function getAllPokemonNames() {
    try {
        const response = await fetch(loadManyPokemon + "?limit=1400")
        return response.json()
    } catch (error) {
        console.error(error.message)
    }
}

async function loadAllPokemons() {
    try {
        const pokemonNames = await getAllPokemonNames()
        for (let index = 0; index < pokemonNames.results.length; index++) {
            allPokemonNames.push(pokemonNames.results[index].name)
        }
    } catch (error) {
        console.error(error.message)
    }
}

async function getSinglePokemon(i) {
    const response = await fetch(loadManyPokemon + i)
    return response.json();
}

async function getData(page) {
    try {
        let requests = []
        for (let i = page; i <= page + 15; i++) {
            requests.push(getSinglePokemon(i))
        }
        return Promise.all(requests)
    } catch (error) {
        console.error(error.message)
    }
}

async function getPokemon() {
    try {
        let mainRef = document.getElementById('pokemons')
        let loadBtn = document.getElementById('loadcard')
        if (loadBtn) {
            mainRef.removeChild(loadBtn)
        }
        mainRef.innerHTML += loaderHTMLTemplate()

        const data = await getData(page)
        for (let i = 0; i < data.length; i++) {
            mainRef.innerHTML += pokeCardHTMLTemplate(data[i])
            let pokeTypesElement = document.getElementById("poketype-" + data[i].id)
            data[i].types.forEach(t => {
                let typePicId = t.type.url.slice(31, -1) // Slice URL before and after Pokemon-ID
                pokeTypesElement.innerHTML += pokeCardTypeHTMLTemplate(typePicId)
            })
            let cardContainer = document.querySelector("#flipcard-" + data[i].id)
            cardContainer.innerHTML += pokeStatsHTMLTemplate(data[i])
            page++
        }
        mainRef.innerHTML += pokeCardLoadingHTMLTemplate()
        let loader = document.getElementById('loading_ball')
        if (loader) {
            mainRef.removeChild(loader)
        }
    }
    catch (error) {
        console.error(error.message)
    }
}

function buildModal(p) {
    let overlayRef = document.getElementById('overlay')
    getModalInner(p);
    overlayRef.innerHTML = ""
    overlayRef.innerHTML += overlayHeaderHTMLTemplate(p)
}

async function getModalInner(p) {
    try {
        const response = await fetch(loadManyPokemon + p)
        const result = await response.json();
        let overlayRef = document.getElementById('overlay')
        overlayRef.innerHTML = ""
        overlayRef.innerHTML += overlayHeaderHTMLTemplate(result)
        overlayRef.innerHTML += pokeGenInfoHTMLTemplate(result)
    } catch (error) {
        console.error(error.message)
    }
}

function toggleModal(i) {
    let overlayRef = document.getElementById('overlay')
    let mainRef = document.getElementById('main')
    let bodyRef = document.getElementById('body')
    let overlayWrapper = document.getElementById('overlaywrapper')
    overlayRef.classList.toggle('d_none')
    if (!overlayRef.classList.contains('d_none')) {
        mainRef.classList.toggle('filter')
        bodyRef.classList.toggle('noscroll')
        overlayWrapper.classList.remove('d_none')
        buildModal(i)
    } else {
        mainRef.classList.toggle('filter')
        bodyRef.classList.remove('noscroll')
        overlayWrapper.classList.add('d_none')
    }
}

async function toggleGenInfoTab(p) {
    let overlayInfoRef = document.getElementById("deep-info")
    if (overlayInfoRef.classList.contains('evo-chain')) {
        overlayInfoRef.classList.remove('evo-chain')
    }
    overlayInfoRef.innerHTML = "";
    const data = await getSinglePokemon(p);
    try {
        overlayInfoRef.innerHTML += pokeGenInfoHTMLTemplate(data)
    } catch (error) {
        console.error(error.message)
    }
}

async function toggleStatsTab(p) {
    let overlayInfoRef = document.getElementById("deep-info")
    if (overlayInfoRef.classList.contains('evo-chain')) {
        overlayInfoRef.classList.remove('evo-chain')
    }
    overlayInfoRef.innerHTML = "";
    const data = await getSinglePokemon(p);
    try {
        overlayInfoRef.innerHTML += pokeOverlayStatsHTMLTemplate(data)
    } catch (error) {
        console.error(error.message)
    }
}

async function request(url) {
    return (await fetch(url)).json()
}

async function getEvo(p) {
    try {
        let overlayInfoRef = document.getElementById("deep-info")
        overlayInfoRef.innerHTML = loaderHTMLTemplate()
        const speciesResult = await request(loadManySpecies + p)
        const evoChainResult = await request(speciesResult.evolution_chain.url)
        const basePokemon = await getSinglePokemon(evoChainResult.chain.species.name)
        let template = ""

        template += pokeEvoChainHTMLTemplate(basePokemon)
        if (evoChainResult.chain.evolves_to.length > 0) {
            const pokemon = await request(loadManyPokemon + evoChainResult.chain.evolves_to[0].species.name)
            template += pokeEvoChainHTMLTemplate(pokemon)

            if (evoChainResult.chain.evolves_to[0].evolves_to.length > 0) {
                const pokemon = await request(loadManyPokemon + evoChainResult.chain.evolves_to[0].evolves_to[0].species.name)
                template += pokeEvoChainHTMLTemplate(pokemon)
            }
        }
        overlayInfoRef.innerHTML = template
    } catch (error) {
        console.error(error.message)
    }
}

async function toggleEvoTab(p) {
    let overlayInfoRef = document.getElementById("deep-info")
    overlayInfoRef.classList.add('evo-chain')
    overlayInfoRef.innerHTML = "";
    await getEvo(p)
}

function preventBubbling(event) {
    event.stopPropagation();
}

function navigateToCard(id) {
    let minusBtn = document.getElementById('minus')
    let plusBtn = document.getElementById('plus')
    if (id < 1) {
        minusBtn.classList.add('disable')
        return
    } else if (id > 1309) {
        plusBtn.class.add('disable')
    }
    getModalInner(id)
}
