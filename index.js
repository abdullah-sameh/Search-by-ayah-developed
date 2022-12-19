const userInput = document.querySelector('input[type="search"]')
// const inputBtn = document.querySelector('input[type="button"]')
const resultsOfAyahs = document.querySelectorAll('ul')[0]
const navBtns = document.querySelectorAll('ul')[1]
const allQuran = [] //* for ayah with audio
const whatNeed = []
const form = document.querySelector('form')

fetch('https://api.alquran.cloud/v1/quran/ar.minshawi')
	.then(resp => resp.json())
	.then(data => allQuran.push(...Object.entries(data)))
	.catch(err => {})


form.addEventListener('submit', (e) => {
	e.preventDefault()
	searchByInput(userInput.value)
})


function searchByInput(userInput) {
	resultsOfAyahs.innerHTML = ''
	navBtns.innerHTML = ''
	fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranuthmanihaf1.min.json')
		.then(resp => resp.json())
		.then(data => {
			whatNeed.length = 0
			// get array of number of surahs and ayahs
			for (let i = 0; i < data.quran.length; i++) {
				if (data.quran[i].text.includes(userInput)) {
					whatNeed.push([data.quran[i].chapter, data.quran[i].verse])
				}
			}
			resultsOfAyahs.innerHTML += `<p class="numResult">النتائج : ${whatNeed.length} آية</p>`
			if (whatNeed.length > 10) {
				const numOfPages = Math.ceil(whatNeed.length / 10)
				console.log(numOfPages)
				let currentPage = 1
				showAyahs(currentPage)

				const htlelement = `
					<button id="pre" disabled>السابق</button>
					<div id="nums">
					
					</div>
					<button id="next">التالي</button>
				`
				navBtns.innerHTML += `<p id="pageNumber">page #${currentPage} of ${numOfPages} Pages</p>`        
				navBtns.innerHTML += htlelement
				const pageNumber = document.getElementById('pageNumber')

				const preBtn = document.getElementById('pre')
				const nextBtn = document.getElementById('next')
				preBtn.addEventListener('click', () => {
					currentPage--
					if (currentPage === 1) {
						preBtn.setAttribute('disabled', '')
						pageNumber.innerHTML = `page #${currentPage} of ${numOfPages}`
						showAyahs(currentPage)
					} else {
						pageNumber.innerHTML = `page #${currentPage} of ${numOfPages}`
						nextBtn.removeAttribute('disabled')
						showAyahs(currentPage)
					}
				})
				nextBtn.addEventListener('click', () => {
					currentPage++
					if (currentPage === numOfPages) {
						nextBtn.setAttribute('disabled', '')
						pageNumber.innerHTML = `page #${currentPage} of ${numOfPages}`
						showAyahs(currentPage)
					} else {
						pageNumber.innerHTML = `page #${currentPage} of ${numOfPages}`
						preBtn.removeAttribute('disabled')
						showAyahs(currentPage)
					}
				})

				const btns = document.getElementById('nums')
				for (let i = 0; i < numOfPages; i++) {
					btns.innerHTML += `<button data-set="${i+1}">${i+1}</button>`
				}
				const btnsB = document.querySelectorAll('[data-set]')
				for (let i = 0; i < btnsB.length; i++) {
					btnsB[i].addEventListener('click', (e) => {
						currentPage = btnsB[i].dataset.set
						pageNumber.innerHTML = `page #${currentPage} of ${numOfPages} Pages`
						showAyahs(currentPage)
						if (currentPage != 1) {
							preBtn.removeAttribute('disabled')
						}
						if (currentPage != numOfPages) {
							nextBtn.removeAttribute('disabled')
						}
						if (currentPage === '1') {
							preBtn.setAttribute('disabled', '')
						}
						if (Number(currentPage) === numOfPages) {
							nextBtn.setAttribute('disabled', '')
						}
					})
				}
			} else {
				for (let j = 0; j < whatNeed.length; j++) {
					const ayah = getAyah(whatNeed[j][0]-1, whatNeed[j][1]-1, allQuran)
					
					html = `
						<li>
							<span class="ayah">${ayah[0].text}</span>
							<span class="surah">${ayah[1]}</span>
							<audio src=${ayah[0].audio} controls></audio>
						</li>
					`
					resultsOfAyahs.innerHTML += html
				}
			}
			
		}).catch(err => {
			html = `
				<li id="not-found">
				لا يوجد نتائج
				</li>
			`
			resultsOfAyahs.innerHTML += html
			console.log(err)
		})
}

// returnn [ayah, its surah]
function getAyah(surahNumber, ayahNumber, allQuran) {
	return [allQuran[2][1].surahs[surahNumber].ayahs[ayahNumber], allQuran[2][1].surahs[surahNumber].name]
}

function check(currentPage, preBtn, nextBtn) {
	if (currentPage === 1) {
		preBtn.setAttribute('disabled', '')
	} else if (currentPage === whatNeed.length) {
		console.log('hey')
		nextBtn.setAttribute('disabled', '')
	} else {
		preBtn.removeAttribute('disabled')
		nextBtn.removeAttribute('disabled')
	}
}


function showAyahs(currentPage) {
	const ele = (currentPage - 1) * 10
	resultsOfAyahs.innerHTML = ''
	resultsOfAyahs.innerHTML += `<p class="numResult">النتائج : ${whatNeed.length} آية</p>`
	for (let j = ele; j < ele+10 && j < whatNeed.length; j++) {
		const ayah = getAyah(whatNeed[j][0]-1, whatNeed[j][1]-1, allQuran)
		html = `
			<li>
				<span class="ayah">${ayah[0].text}</span>
				<span class="surah">${ayah[1]}</span>
				<audio src=${ayah[0].audio} controls></audio>
				<span>النتيجة #${j+1}</span>
			</li>
		`
		resultsOfAyahs.innerHTML += html
	}
}


