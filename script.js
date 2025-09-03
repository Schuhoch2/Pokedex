const BASE_URL = "https://pokeapi.co/api/v2/";
const loadManyPokemon = BASE_URL + "pokemon/"
const loadManyTypes = BASE_URL + "type/"
const loadManySpecies = BASE_URL + "pokemon-species/"
const typeSprites = "generation-vii"
const gen7 = "lets-go-pikachu-lets-go-eevee"
const typepic = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vii/lets-go-pikachu-lets-go-eevee/"



// https://pokeapi.co/api/v2/pokemon/1/
//     -> name
//     -> sprites -> other -> home -> front_default: x.png


async function loadData() {
    getData()
    await getPokemon();
    // getPokemonType();
    // getPokemonFrontCard()

}

async function getSinglePokemon(i) {
    const response = await fetch(loadManyPokemon + i)
    return response.json();
}


async function getData() {
    try {
        let requests = []
        for (let index = 1; index < 30; index++) {
            requests.push(getSinglePokemon(index))
        }
        return Promise.all(requests)
    } catch (error) {

    }
}


// Load 10 Pokemon
async function getPokemon() {
    let mainRef = document.getElementById('pokemons')
    mainRef.innerHTML = "";
    try {
        const data = await getData()
        for (let i = 0; i < data.length; i++) {
            mainRef.innerHTML += pokeCardHTMLTemplate(data[i])
            let pokeTypesElement = document.getElementById("poketype-" + data[i].id)
            data[i].types.forEach(t => {
                let typePicId = t.type.url.slice(31, -1) // Slice everything before and after initial number
                pokeTypesElement.innerHTML += pokeCardTypeHTMLTemplate(typePicId)
            })
            let cardContainer = document.querySelector("#flipcard-" + data[i].id)
            cardContainer.innerHTML += pokeStatsHTMLTemplate(data[i])
        }
    }
    catch (error) {
        console.error(error.message)
    }
}

async function getPokemonType() {
    try {
        i = 1;
        const response = await fetch(loadManyTypes + i)
        const result = await response.json();
        const typeresponse = await fetch(loadManyTypes + type.type.name)
        const typeresult = await typeresponse.json()
        console.log(result)
            // console.log(typeresult.sprites[typeSprites][gen7].name_icon)

            ;
    } catch (error) {

    }



}

async function getPokemonFrontCard() {
    let typeadd = document.getElementById('innerpokecard')
    try {
        const response = await fetch(loadManyPokemon);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result)
        console.log(result.name) // Pokemon-Name
        for (let i = 0; i < result.types.length; i++) {
            const type = result.types[i].type.url;
            try {
                const typeresponse = await fetch(type)
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }
                const typeresult = await typeresponse.json()
                typeadd.innerHTML = pokeCardTypeHTMLTemplate(typeresult.sprites[typeSprites][gen7].name_icon)


                console.log(typeresult.sprites[typeSprites][gen7].name_icon) // URL Type-Pictures
            } catch (error) {
                console.error(error.message);
            }
        }
        console.log(result.sprites.other.dream_world.front_default) // Pokemon-Look 

        // GET all stats - Order: HP,ATK,DEF,SATK,SDEF,SPD
        for (let index = 0; index < result.stats.length; index++) {
            console.log(result.stats[index].base_stat);
        }
    } catch (error) {
        console.error(error.message);
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

function closeModal() {
    let overlayRef = document.getElementById('overlay')
    overlayRef.classList.toggle('d_none')
}

function toggleModal(i) {
    let overlayRef = document.getElementById('overlay')
    let mainRef = document.getElementById('main')
    let bodyRef = document.getElementById('body')
    overlayRef.classList.toggle('d_none')
    if (!overlayRef.classList.contains('d_none')) {
        mainRef.classList.toggle('filter')
        bodyRef.classList.toggle('noscroll')
        buildModal(i)
    } else {
        mainRef.classList.toggle('filter')
        bodyRef.classList.remove('noscroll')
    }

}

async function toggleGenInfoTab(p) {
    let overlayInfoRef = document.getElementById("deep-info")
    if (overlayInfoRef.classList.contains('evo-chain')) {
        overlayInfoRef.classList.remove('evo-chain')
    }
    overlayInfoRef.innerHTML = "";
    const data = await getData();

    try {
        overlayInfoRef.innerHTML += pokeGenInfoHTMLTemplate(data[p - 1])
    } catch (error) {
        console.error(error.message)
    }
}

async function toggleStatsTab(p) {
    let overlayInfoRef = document.getElementById("deep-info")
    if (overlayInfoRef.classList.contains('evo-chain')) {
        overlayInfoRef.classList.remove('evo-chain')
    }
    const data = await getData();
    overlayInfoRef.innerHTML = "";
    try {
        overlayInfoRef.innerHTML += pokeOverlayStatsHTMLTemplate(data[p - 1])
    } catch (error) {
        console.error(error.message)
    }
}

async function request(url) {
    return (await fetch(url)).json()
}


async function toggleEvoTab(p) {
    const data = await getData()
    let overlayInfoRef = document.getElementById("deep-info")
    overlayInfoRef.classList.add('evo-chain')
    overlayInfoRef.innerHTML = "";
    try {
        const speciesResult = await request(loadManySpecies + p)
        const evoChainResult = await request(speciesResult.evolution_chain.url)
        const basePokemon = data.find((pokemon) => pokemon.name === evoChainResult.chain.species.name)

        overlayInfoRef.innerHTML += pokeEvoChainHTMLTemplate(basePokemon)

        if (evoChainResult.chain.evolves_to.length > 0) {
            const pokemon = await request(loadManyPokemon + evoChainResult.chain.evolves_to[0].species.name)
            overlayInfoRef.innerHTML += pokeEvoChainHTMLTemplate(pokemon)

            if (evoChainResult.chain.evolves_to[0].evolves_to.length > 0) {
                const pokemon = await request(loadManyPokemon + evoChainResult.chain.evolves_to[0].evolves_to[0].species.name)
                overlayInfoRef.innerHTML += pokeEvoChainHTMLTemplate(pokemon)
            }
        }
    } catch (error) {
        console.error(error.message)
    }
}


//WIP
function toggleTabs(i) {
    let tabRef = document.getElementById(i)
    tabRef.classList.toggle('active')
}

function preventBubbling(event) {
    event.stopPropagation();
}


