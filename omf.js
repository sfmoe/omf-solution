window.onload = () => { 
let paymentType = document.querySelector("input[name=payment-type]:checked").value;

//toggles the payment group and disables hidden inputs 
const paymentGroupsToggle = (showEl)=>{
    let paymentGroups = document.querySelectorAll(".payment-group-inputs");
    //hide all payment samples first
    document.querySelectorAll(".payment-sample > div").forEach(e=>{e.style = "display: none;"})
    //check all payment groups, hide and disable all payment groups according to selected group var->showEl
    paymentGroups.forEach(el=>{
        el.style = "display: none;";
        el.querySelectorAll("input").forEach(e=>{e.disabled = "true"; e.value=""});
        if(el.id == showEl){
            el.style="display: block"; //show the container
            document.querySelector(`.payment-sample > .${showEl}`).style = "display: block;"
            el.querySelectorAll("input").forEach(e=>{e.removeAttribute("disabled")}); //remove the disabled attribute
        }
    })
};

let paymentSelector = document.querySelectorAll("input[name=payment-type]"); 
    // iterate through each radio button to add event listener
    paymentSelector.forEach(el=>{
        // add listener to each radio button and pass the currently selected input value 
        // to the function that toggles fields
        el.addEventListener("change", (e)=>{
            paymentGroupsToggle(e.target.value);
        })
    });

const toggleError = (el, status, msg) => {
    let label = el.querySelector("label").innerText;
    message = msg || `${label} is required`;
    if(status){
        el.classList.add("has-error");
        el.querySelector(".error-message").innerText = message;
    }else{
        el.classList.remove("has-error");
    }
    
};

//used for fields that cant be set to number type to check that all characters are numbers
const numberRegex = /^\d+$/;

//form validation: listen for form submit
document.querySelector("form").addEventListener("submit", event=>{
    event.preventDefault(); // by default disable form submit
    
    let form = event.target; //form referemce

    form.querySelectorAll("input:not([type=radio])").forEach(e=>{

        //if element not disabled then validate for empty
        if (!e.disabled && e.value ==""){
            toggleError(e.parentElement, true);
        }else{
            toggleError(e.parentElement, false);

            //if CVV not disabled make sure its exactly 3 numbers
            if(e.name == "card-cvv" && !e.disabled){
                if(numberRegex.test(e.value)){
                    //check that field is exactly 3 characters long
                    (e.value.length !== 3)? toggleError(e.parentElement, true, `${e.parentElement.querySelector("label").innerText} must be 3 numbers long`) : toggleError(e.parentElement, false);
                }else{
                    toggleError(e.parentElement, true, `${e.parentElement.querySelector("label").innerText} must be only numbers`);
                }
                
            }

            //if routing number not disabled make sure its numbers only
            if(e.name == "routing-number" && !e.disabled){
                (numberRegex.test(e.value))? toggleError(e.parentElement, false) : toggleError(e.parentElement, true, `${e.parentElement.querySelector("label").innerText} must be numbers only`);
            }
            
            //confirmation check if it matches the originator. uses data-confirm on element to tell it what to match on
            if(e.dataset.confirm){
                let confirmLabel = document.querySelector(`#${e.dataset.confirm}`).parentElement.querySelector("label").innerText;
                console.log(e.value,  confirmLabel);
                (e.value !== document.querySelector(`#${e.dataset.confirm}`).value)? toggleError(e.parentElement, true, `${confirmLabel}s do not match`) : toggleError(e.parentElement, false);
            }
        } 

    })
    //checks if there are any errors displayed
    let hasError = form.querySelectorAll(".has-error").length;
    //submit form if no errors 
    if(hasError == 0){ form.submit(); }

});



//on load run this to disable hidden inputs of unselected payment type
paymentGroupsToggle(paymentType);

}//end onload



