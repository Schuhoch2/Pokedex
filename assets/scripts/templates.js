function pokeCardHTMLTemplate(p) {
    return `<div class="pokecard" onclick="toggleModal(${p.id})">
                <div class="flip-card-inner" id="flipcard-${p.id}">
                    <div class="pokecard flip-card-front bg_${p.types[0].type.name}" id="innerpokecard-${p.id}">
                         <h3 id="pokename">${p.name}</h3>
                         <img id="pokepic" src="${p.sprites.front_default}"alt="">   
                         <div id="poketype-${p.id}" class="poketype">           
                         </div>        
                    </div>
                </div>     
            </div>`
}

function pokeCardLoadingHTMLTemplate() {
    return `<div class="pokecard" id="loadcard">
                <div class="flip-card-inner no-flip">    
                    <button class="loadbtn" onclick="getPokemon()">Load More</button>
                </div>
            </div>`
}

function pokeCardTypeHTMLTemplate(t) {
    return `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vii/lets-go-pikachu-lets-go-eevee/${t}.png"alt="Type">`
}

function pokeStatsHTMLTemplate(s) {
    return `<div class="pokecard flip-card-back bg_${s.types[0].type.name}">
                <div class="pokestats">
                    <h3 id="pokename">${s.name.toUpperCase()}</h3>
                    <div class="stat">
                        <label for="hp">HP</label>
                        <p>${s.stats[0].base_stat}</p>
                    </div>
                    <progress value="${s.stats[0].base_stat}" max="255" id="hp">HP</progress>
                    <div class="stat">
                        <label for="atk">ATK</label>
                        <p>${s.stats[1].base_stat}</p>
                    </div>
                    <progress value="${s.stats[1].base_stat}" max="255" id="atk">49</progress>
                    <div class="stat">
                        <label for="def">DEF</label>
                        <p>${s.stats[2].base_stat}</p>
                    </div>
                    <progress value="${s.stats[2].base_stat}" max="255" id="def">49</progress>
                    <div class="stat">
                        <label for="satk">S-ATK</label>
                        <p>${s.stats[3].base_stat}</p>
                    </div>
                    <progress value="${s.stats[3].base_stat}" max="255" id="satk">65</progress>
                    <div class="stat">
                        <label for="sdef">S-DEF</label>
                        <p>${s.stats[4].base_stat}</p>
                    </div>
                    <progress value="${s.stats[4].base_stat}" max="255" id="sdef">65</progress>
                    <div class="stat">
                        <label for="spd">SPD</label>
                        <p>${s.stats[5].base_stat}</p>
                    </div>
                    <progress value="${s.stats[5].base_stat}" max="255" id="spd">45</progress>
                </div> 
            </div> `
}

function pokeGenInfoHTMLTemplate(p) {
    return `<div class="deep-info" id="deep-info">    
                <div>
                    <img src="${p.sprites.front_default}"alt="">
                </div>
                <div class="geninfo">    
                    <h3>Height<br>${p.height * 10}cm</h3>
                    <h3>Weight<br>${p.weight * 10}g</h3>
                    <h3>BaseXP<br>${p.base_experience}</h3>
                </div> 
            </div>`
}

function pokeEvoChainHTMLTemplate(p) {
    return `<img src="${p.sprites.front_default}" alt="evo">`
}

function overlayHeaderHTMLTemplate(p) {
    return `<div class="overlay-header" id="overlay-header" onclick="preventBubbling(event)">
                <div class="navbuttons">            
                    <button id="minus" ${p.id === 1 && "disabled"} onclick="navigateToCard(${p.id - 1})">←</button>
                    <button id="plus" ${p.id > 1309 && "disabled"} onclick="navigateToCard(${p.id + 1})">→</button>
                </div>
                <div class="header-inner-container">
                    <span class="pokemon-identifier">#${p.id}</span>
                    <h3>${p.name}</h3>
                </div>
                <button id="close" onclick="toggleModal()">x</button>
            </div>
            <div class="tabs" onclick="preventBubbling(event)">
                <button id="gentab" onclick="toggleGenInfoTab(${p.id})">
                    <h4 class="" id="tab-geninfo">Gen. info</h4>
                </button>
                <button id="statstab" onclick="toggleStatsTab(${p.id})">
                    <h4 class="" id="tab-stats">Stats</h4>
                </button>
                <button id="evotab" onclick="toggleEvoTab(${p.id})">
                    <h4 class="" id="tab-evochain">Evo Chain</h4>
                </button>
            </div>`
}

function pokeOverlayStatsHTMLTemplate(s) {
    return `<div class="pokestats">
                <div class="stat">
                    <label for="hp">HP</label>
                    <p>${s.stats[0].base_stat}</p>
                </div>
                <progress value="${s.stats[0].base_stat}" max="255" id="hp">HP</progress>
                <div class="stat">
                    <label for="atk">ATK</label>
                    <p>${s.stats[1].base_stat}</p>
                </div>
                <progress value="${s.stats[1].base_stat}" max="255" id="atk">49</progress>
                <div class="stat">
                    <label for="def">DEF</label>
                    <p>${s.stats[2].base_stat}</p>
                </div>
                <progress value="${s.stats[2].base_stat}" max="255" id="def">49</progress>
                <div class="stat">
                    <label for="satk">S-ATK</label>
                    <p>${s.stats[3].base_stat}</p>
                </div>
                <progress value="${s.stats[3].base_stat}" max="255" id="satk">65</progress>
                <div class="stat">
                    <label for="sdef">S-DEF</label>
                    <p>${s.stats[4].base_stat}</p>
                </div>
                <progress value="${s.stats[4].base_stat}" max="255" id="sdef">65</progress>
                <div class="stat">
                    <label for="spd">SPD</label>
                    <p>${s.stats[5].base_stat}</p>
                </div>
                <progress value="${s.stats[5].base_stat}" max="255" id="spd">45</progress>
            </div>`
}

function loaderHTMLTemplate() {
    return `<div id="loading_ball">
    <img class="loading_ball" src="./assets/img/loading_pokeball.png">
    </div>`
}

function noPokemonNamesHTMLTemplate() {
    return `<span style="font-size: 24px;">
                ¯\\_(ツ)_/¯ No Pokemons with this name ¯\\_(ツ)_/¯
            </span>`
}