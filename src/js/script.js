const API_KEY = "api_key=05ddfe43c58a397f2785d55e4225fa05";
const BASE_URL = "https://api.themoviedb.org/3/";
const IMG_URL = "https://image.tmdb.org/t/p/w500/";
const LANGUAGE = "language=pt-BR";

const pesquisaForm = document.getElementById('pesquisa-form');
const filmesContainer = document.getElementById('filmes-container');
const generoSelect = document.getElementById('genero-select');

window.addEventListener('DOMContentLoaded', () => {
    carregarFilmesIniciais();
    carregarGeneros();
});


function carregarFilmesIniciais() {
    fetch(`${BASE_URL}movie/popular?${API_KEY}&${LANGUAGE}`)
        .then(response => response.json())
        .then(json => {
            const filmesEmbaralhados = embaralharFilmes(json.results);
            carregaLista(filmesEmbaralhados);
        })
        .catch(error => console.error('Erro ao carregar filmes iniciais:', error));
}


function carregarGeneros() {
    fetch(`${BASE_URL}genre/movie/list?${API_KEY}&${LANGUAGE}`)
        .then(response => response.json())
        .then(json => {
            const generos = json.genres;
            popularGeneros(generos);
        })
        .catch(error => console.error('Erro ao carregar gêneros:', error));
}


function popularGeneros(generos) {
    generos.forEach(genero => {
        const option = document.createElement('option');
        option.value = genero.id;
        option.textContent = genero.name;
        generoSelect.appendChild(option);
    });
}


generoSelect.addEventListener('change', (event) => {
    const generoId = event.target.value;

    if (generoId === "") {
        carregarFilmesIniciais(); 
    } else {
        fetch(`${BASE_URL}discover/movie?${API_KEY}&${LANGUAGE}&with_genres=${generoId}`)
            .then(response => response.json())
            .then(json => {
                const filmesEmbaralhados = embaralharFilmes(json.results);
                carregaLista(filmesEmbaralhados);
            })
            .catch(error => console.error('Erro ao buscar filmes por gênero:', error));
    }
});


function embaralharFilmes(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
}

function carregaLista(filmes) {
    filmesContainer.innerHTML = "";

    if (filmes.length === 0) {
        alert('Nenhum resultado encontrado.');
        return;
    }

    filmes.forEach(element => {
        let item = document.createElement("div");
        item.classList.add("movie-item");

        const imagem = document.createElement("img");
        imagem.src = `${IMG_URL}${element.poster_path}`;
        imagem.alt = element.title;

        imagem.onload = () => {
            item.appendChild(imagem);
        };

        filmesContainer.appendChild(item);
    });
}

pesquisaForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const termo = event.target.pesquisa.value;

    if (termo === "") {
        alert('Por favor, insira um termo de pesquisa.');
        return;
    }

    fetch(`${BASE_URL}search/movie?${API_KEY}&${LANGUAGE}&query=${termo}`)
        .then(response => response.json())
        .then(json => {
            const filmesEmbaralhados = embaralharFilmes(json.results);
            carregaLista(filmesEmbaralhados);
        })
        .catch(error => console.error('Erro ao buscar filmes:', error));
});


window.addEventListener('scroll', () => {
    const header = document.querySelector('header');

    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});