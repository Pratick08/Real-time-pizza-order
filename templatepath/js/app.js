
let cartButton = document.querySelectorAll(".cart-button")
let cartCounter = document.querySelector("#cartCounter")
let deleteButton = document.querySelector(".delete-button")
let seePassword = document.getElementById("seePassword")
let passwordInput = document.getElementById("exampleInputPassword1");
let inputRange = document.getElementById("input-range");
let price = document.querySelector("#totalPrice");
let incrementBtn = document.querySelectorAll(".incrementBtn");
let hiddenInput = document.querySelectorAll(".hiddenInput");

let slides = document.querySelectorAll(".home-bg .home .slide-container .slide");
let index = 0;
function next() {
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
}
function prev() {
    slides[index].classList.remove('active');
    index = (index - 1 + slides.length) % slides.length;
    slides[index].classList.add("active");
}

// console.log(seePassword);
window.addEventListener("scroll", () => {
    let header = document.querySelector("nav");
    header.classList.toggle("sticky", window.scrollY > 0)
})

//******************** FETCHING UPDATECART********************* */
async function updateCart(pizza) {
    try {
        let res = await fetch("/update-cart", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ pizza: pizza })
            // body: pizza

        })
        // console.log(res.status)
        res = await res.json()
        console.log(res, 'response')
        cartCounter.innerHTML = res.totalQty;
    } catch (error) {
        error("Error");
    }
}


cartButton.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
        let pizza = btn.dataset.pizza;
        try {
            const result = await Swal.fire({
                title: "Add to Cart",

                icon: "success",
                text: "Item added to cart successfully!",
                showConfirmButton: false,
                timer: 1500
            });

            updateCart(pizza);
        } catch (error) {
            console.error("Error displaying SweetAlert:", error);
        }
    });
});

//******************** FETCHING DECREMENT CART********************* */

async function cartDecrement(pizzaid) {
    try {
        let res = await fetch("/decrement-cart", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ pizzaid })
        })
        let data = await res.json();
        console.log(data)
        cartCounter.innerHTML = data.totalQty;
        updateCartUI(pizzaid, data.qty, data.items, data)
        // quantity.innerHTML=data.qty;
    } catch (error) {
        console.log(error);
    }
}

function decrementFun(id) {
    // console.log(hiddenInput)
    hiddenInput.forEach((e) => {
        if (id === e.value) {
            cartDecrement(id);
        }
    })

}
async function cartIncrement(pizzaid) {
    try {
        let res = await fetch("/increment-cart", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pizzaid })
        })
        let data = await res.json();
        // console.log(data);
        cartCounter.innerHTML = data.totalQty;
        updateCartUI(pizzaid, data.qty, data.items, data)
    }
    catch (error) {
        console.log(error);
    }
}
function incrementFun(id) {
    hiddenInput.forEach((e) => {
        if (id === e.value) {
            cartIncrement(id);
        }
    })
}
function updateCartUI(pizzaid, newQuantity, items, data) {
    document.getElementById(`${pizzaid}-quantity`).innerHTML = `${newQuantity} Pcs`;
    document.getElementById(`${pizzaid}-amount`).innerHTML = `₹${newQuantity * items.price} `;
    price.innerHTML = "₹" + data.totalPrice;
    document.getElementById("addTotal").innerHTML = `₹${data.totalPrice + 50} `
}

// ***********************home slider**************//

// ***************************order complete logic********************
let hiddenOrderStatus = document.querySelectorAll(".hiddenOrderStatus");
hiddenOrderStatus.forEach((status) => {
    if (status.value === "completed") {
        status.parentElement.classList.add("completed");
    }
})


// let pizzaBtn=document.querySelector("#pizzaBtn");
// console.log(pizzaBtn)
// pizzaBtn.addEventListener("click",(e)=>{
//     console.log(pizzaBtn.value);
// })
// *******************************************************************************************

// *********************************************************************************************
// **********admin markup***********************//
async function initAdmin() {
    let orderTableBody = document.querySelector("#orderTableBody");
    let orders = [];
    let markup;

    try {
        const res = await fetch("/admin/order", {
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        });
        orders = await res.json();
        // let formateTimeStamp =;
        // console.log(orders);
        markup = generateMarkup(orders);
        console.log()
        orderTableBody.innerHTML = markup;
    } catch (error) {
    }
    function renderItems(item) {
        let parsedItems = Object.values(item)
        return parsedItems.map((menuItem) => {
            return `
            <p class="my-0">${menuItem.items.name} - ${menuItem.qty} pcs </p>
            `
        }).join('')
    }

    function generateMarkup(orders) {
        return orders.map(order => {
            return `
            <tr>
            <td class="border px-4 py-2 text-success">
                <p class="my-0">${order._id}</p>
                 <div>${renderItems(order.item)}</div> 
            </td>
            <td class="border px-4 py-2">${order.customerId.name}</td>
            <td class="border px-4 py-2">${order.address}</td>
            <td class="border px-4 py-2">
                <div class="inline-block relative w-64">
                    <form action="/admin/order/status" method="POST">
                        <input type="hidden" name="orderId" value="${order._id}">
                        <select name="status" onchange="this.form.submit()"
                            class="block appearance-none w-full bg-white border  px-4 py-2 pr-8  ">
                            <option value="order_placed" ${order.status === 'order_placed' ? 'selected' : ''}>Placed</option>
                            <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}> Confirmed</option>
                            <option value="prepared" ${order.status === 'prepared' ? 'selected' : ''}>Prepared</option>
                            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </form>
                </div>
            </td>
            <td class="border px-4 py-2">
            ${moment(order.createdAt).format('hh:mm A')}
            </td>
            
            </tr>
            
        `
        }).join('')
    }
}

initAdmin();
// window.screen
// seePassword.addEventListener("click", (e) => {
//     // passwordInput.type = 'text';
//     if (passwordInput.type === 'text') {
//         passwordInput.type = 'password';
//         // console.log(seePasswordnod)
//     }
//     else {
//         passwordInput.type = 'text'
//     }

// })

// update status


// // console.log(typeof objOrder);

