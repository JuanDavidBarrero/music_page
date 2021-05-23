const form = document.getElementById('form')
const search = document.getElementById('search')
const results = document.getElementById('results')
const more = document.getElementById('more')


const apiURL = 'https://api.lyrics.ovh';

/* Functions */

async function searchSongs(term) {
    const resp = await fetch(`${apiURL}/suggest/${term}`);
    const data = await resp.json();

    showData(data);
}

function showData(data) {
    results.innerHTML = `
    <ul class="song">
        ${data.data.map(song => `<li> 
                                    <span> <strong> ${song.artist.name} </strong> - ${song.title} </span>
                                    <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}"> Get lyrics </button>
                                </li>`).join('')}
    </ul>`;


    if(data.next || data.prev){
        more.innerHTML = `
            ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')"> Prev </button>`: ''}
            ${data.next ? `<button class="btn "onclick="getMoreSongs('${data.next}')"> Next </button>`: ''}
        `;
    }
    else {
        more.innerHTML = '';
    }
}


async function getMoreSongs(url) {
    
    resp = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    data = await resp.json();

    showData(data);
    
}

async function getLyrics(artist,songtitle) {

    resp = await fetch(`${apiURL}/v1/${artist}/${songtitle}`);
    data = await resp.json();


    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g,'<br>');

    results.innerHTML = `<h2><strong>${artist} - ${songtitle}</strong></h2>
    <span> ${lyrics}</span>
    `;

    more.innerHTML = '';
    
}


/* Event lister */
form.addEventListener('submit', e => {
    e.preventDefault();

    const term = search.value.trim();

    if (!term) {
        alert('plese type an artist or a song')
    }
    else {
        searchSongs(term);
    }
});

results.addEventListener('click',e =>{
    const clickElementet = e.target;

    if(clickElementet.tagName === 'BUTTON'){
        const artist = clickElementet.getAttribute('data-artist');
        const songTitle = clickElementet.getAttribute('data-songtitle');

        getLyrics(artist,songTitle);
    }
});
