const userInput = document.querySelector('input[type="search"]')
const inputBtn = document.querySelector('input[type="button"]')
const result = document.querySelector('ul')
const allQuran = [] //* for ayah with audio
const whatNeed = []
const endPoint = 'https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranuthmanihaf1.min.json'
const form = document.querySelector('form')

fetch(`https://api.alquran.cloud/v1/quran/ar.minshawi`)
    .then(resp => resp.json())
    .then(data => allQuran.push(...Object.entries(data)))
    .catch(err => {})

//* git number of ayah
function searchByInput(userInput) {
    result.innerHTML = ''

    fetch(endPoint)
        .then(resp => resp.json())
        .then(data => {
            whatNeed.length = 0
            for (let i = 0; i < data.quran.length; i++) {
                if (data.quran[i].text.includes(userInput)) {
                    whatNeed.push([data.quran[i].chapter, data.quran[i].verse])
                }
            }
            for (let j = 0; j < whatNeed.length; j++) {
                const ayah = getAyah(whatNeed[j][0]-1, whatNeed[j][1]-1, allQuran)
                
                html = `
                    <li>
                        <span class="ayah">${ayah[0].text}</span>
                        <span class="surah">${ayah[1]}</span>
                        <audio src=${ayah[0].audio} controls></audio>
                    </li>
                `
                result.innerHTML += html
            }

        }).catch(err => {
            console.log(err)
            html = `
                <li id="not-found">
                    لا يوجد نتائج
                </li>
                `
            result.innerHTML += html
        })
}


// * This function give me the ayah (with audio) of my number ayah;
function getAyah(surahNumber, ayahNumber, allQuran) {
    return [allQuran[2][1].surahs[surahNumber].ayahs[ayahNumber], allQuran[2][1].surahs[surahNumber].name]
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    searchByInput(userInput.value)
})
