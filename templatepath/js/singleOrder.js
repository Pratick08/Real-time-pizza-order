let hiddenInput=document.querySelector("#hiddenInput")
// let orderString=hiddenInput? hiddenInput.value: null;
// orderString=JSON.stringify(orderString);
// console.log( orderString)
let order =hiddenInput? hiddenInput.value : null;
// order=JSON.parse(order);
console.log( order)


let status_line=document.querySelectorAll(".status_line")
let time=document.createElement("small");
time.classList.add("update-time-status");

function updateCart(order)
{
    
    let stepComplete=true;
    status_line.forEach(e=>{
    let dataStatus=e.dataset.status;
    // console.log(order);
        if(stepComplete)
        {
            e.classList.add("step_completed");
        }
        console.log();
        if(dataStatus===order)
        {
            time.innerHTML=moment(order.updatedAt).format('hh:mm A')
            e.appendChild(time);
            stepComplete=false;
            if(e.nextElementSibling)
            {
                e.nextElementSibling.classList.add("current_step");
            }
            
        }
    })
}
updateCart(order);