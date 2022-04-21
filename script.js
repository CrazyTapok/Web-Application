let form = document.forms.myForm

form.addEventListener('submit', e => {
    e.preventDefault()
    try {
        const startDate = form.date1.value
        const endDate = form.date2.value

        if (startDate !== '' && endDate !== '' && startDate < endDate) {
            let arrayDate = getAllDate(startDate, endDate)
    
            requests(arrayDate)
        } else{
            throw new Error('error')
        }
    } catch (error) {
        alert(error.message)
    }
})


function getAllDate(startDate, endDate) {
    let result = []
    startDate = Date.parse(startDate)
    endDate = Date.parse(endDate) 

    for (let i = startDate; i <= endDate; i = i + 24*60*60*1000){
        result.push(new Date(i).toISOString().substr(0, 10))
    }

    return result
}

function requests(array) {
    let requests = array.map(date => fetch(`https://www.nbrb.by/api/exrates/rates/USD?parammode=2&ondate=${date}`))

    Promise.all(requests)
        .then(responses => Promise.all(responses.map(item => item.json())))
        .then(dates => {
            let result = []

            dates.forEach(date => {
                result.push({
                    date: date.Date.toString().substr(0, 10), 
                    cur: date.Cur_OfficialRate
                })
            })

            solution(result)
        })
}

function solution(array) {
    array.sort(mySort('cur'))

    console.log(array)
    document.querySelector('#answer').innerHTML = `Мин курс доллара: ${array[0].date} (${array[0].cur})`
}


function mySort(field) {
    return (a, b) => a[field] > b[field] ? 1 : -1;
}


