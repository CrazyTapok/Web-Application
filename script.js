let form = document.forms.myForm
let errorMessage = document.querySelector('#errorMessage')

form.addEventListener('submit', e => {
    e.preventDefault()

    const startDate = form.date1.value
    const endDate = form.date2.value

    if (startDate < endDate) {
        let arrayDate = getAllDate(startDate, endDate)
        requests(arrayDate)
    } else {
        
        form.date1.classList.add('invalid')
        form.date2.classList.add('invalid')

        errorMessage.innerHTML = 'Range is not correct'
        
        return
    }
})

function addInvalid(input) {
    input.classList.add('invalid');
}

form.addEventListener('focus', (event) => {
    if (event.target.tagName === 'INPUT') {
        document.querySelectorAll('input').forEach(item => item.classList.remove('invalid'))
        errorMessage.innerHTML = ''

        event.target.classList.add('focus');
    }
}, true);

form.addEventListener('blur', (event) => {
    if (event.target.tagName === 'INPUT') {
        event.target.classList.remove('focus');
    }
    
}, true);

function getAllDate(startDate, endDate) {
    let result = []
    startDate = Date.parse(startDate)
    endDate = Date.parse(endDate) 

    for (let i = startDate; i <= endDate; i = i + 24*60*60*1000){
        result.push(new Date(i).toString().substring(0, 10))
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
        .catch(error => alert(`Whoops! Request error: ${error.message}`))
}

function solution(array) {
    // array.sort(mySort('cur'))

    array.sort((a,b) => {

        if(a.cur < b.cur) return -1;
        if (a.cur > b.cur) return 1;

        // при равных курсах (cur) сортируем по дате (date)
        if(a.date < b.date) return -1;
        if (a.date > b.date) return 1;
            
        return 0;
    })

    console.log(array)
    form.answer.value = `Min rate: ${array[0].cur} Date: ${array[0].date}\n\nMax rate: ${array[array.length-1].cur} Date: ${array[array.length-1].date}`
}


// function mySort(field) {
//     return (a, b) => a[field] > b[field] ? 1 : -1;
// }


