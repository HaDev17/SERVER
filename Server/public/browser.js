function itemTemplate(item) {
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                <span class="item-text">${item.text}</span>
            <div>
                <button data-id="${item._id.valueOf()}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                <button class="delete-me btn btn-danger btn-sm">Delete</button>
            </div>
            </li>`
}
let htmlOutput = items.map((item)=> {
    return itemTemplate(item)
}).join("")
console.log(items)
document.querySelector("#item-list").insertAdjacentHTML('beforeend', htmlOutput)
let inputField = document.querySelector("#input-field")
let createForm = document.querySelector("#create-form")
createForm.addEventListener("submit", (e)=> {
    e.preventDefault()
    if(inputField.value.split(" ").join("") != ""){
        axios.post('/add-item', { text: inputField.value }).then((response) => {
            document.querySelector('#item-list').insertAdjacentHTML("beforeend", itemTemplate(response.data))
        }).catch((e) => {
            console.log(e)
        })
        inputField.value =""
        inputField.focus()
    }
})
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-me")) {
        let userInput = prompt("write your message pls", e.target.parentElement.parentElement.children[0].textContent)
        if (userInput) {
            axios.post('/update-item', { text: userInput, id: e.target.getAttribute("data-id") }).then(() => {
                e.target.parentElement.parentElement.children[0].innerHTML = userInput
            }).catch((e) => {
                console.log(e.message)
            })
        }
    } else if (e.target.classList.contains("delete-me")) {
        if (confirm("Do you want to delete this item")) {
            let textItem = e.target.parentElement.parentElement.children[0].textContent
            axios.post('/delete-item', { text: textItem }).then(() => {
                e.target.parentElement.parentElement.remove()
                //console.log(e.target.parentElement.parentElement.children[0].textContent)
            }).catch((e) => {
                console.log(e.message)
            })
        }
    }

})

