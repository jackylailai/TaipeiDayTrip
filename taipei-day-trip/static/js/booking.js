
async function checkUserLoggedIn() {
    const token = localStorage.getItem('token');
    if (!token) {
        
        window.location.href = '/';
        return;
    }
}
const taipeiTopButton = document.querySelector(".left-div")

taipeiTopButton.addEventListener('click', function() {
    window.location.href="/";
});
const messageContainer = document.getElementById('messageContainer');
const messageElement = document.createElement('div');
//處理登入內容
document.addEventListener("DOMContentLoaded", function() {
document.getElementById('showLoginForm').addEventListener('click', () => {
    document.getElementById('loginModal').style.display = 'flex';
  });
  let signupLink = document.querySelector(".signuptitle");
  let signupForm = document.getElementById("signupModal");
  let loginForm = document.getElementById("loginModal");
  console.log("signuplink",signupLink);
    signupLink.addEventListener("click", function() {
    if (signupForm.style.display === "none" || signupForm.style.display === "") {
        signupForm.style.display = "flex";
        loginForm.style.display = "none";
    } else {
        signupForm.style.display = "none"; 
    }
    });

  document.getElementById('loginButton').addEventListener('click', async () => {
    const loginEmail = document.getElementById('loginEmail').value;
    const loginPassword = document.getElementById('loginPassword').value;
    const modalContent = document.querySelector('.modal-content');
    if (!loginEmail || !loginPassword) {
        alert('請填寫完所有資料。');
        return; 
    }
    const loginData = {
      email: loginEmail,
      password: loginPassword
    };

    try {
      const response = await fetch('/api/user/auth', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      let data = await response.json();

      if (response.ok) {
        const token = data.token;
        localStorage.setItem('token', token);
        console.log('登入成功拿token:',token);
        document.getElementById('loginModal').style.display = 'none';
        location.reload(true);
      } else {
        console.error(data.message)
        const errorMessage = data.message || '登入失敗';
        messageElement.textContent = errorMessage;
        messageElement.classList.add('error');
      }
      messageContainer.innerHTML = '';
      messageContainer.appendChild(messageElement);
    //   modalContent.classList.add('expanded');
      messageContainer.style.display = 'block';
    } catch (error) {
      console.error('發生錯誤', error);
    }
  });
});




//處理註冊部分

let loginLink = document.querySelector(".logintitle");
let loginForm = document.getElementById("loginModal");
let signupForm = document.getElementById("signupModal");
console.log("loginlink",loginLink);
console.log("loginform",loginForm);
  loginLink.addEventListener("click", function() {
  if (loginForm.style.display === "none" || loginForm.style.display === "") {
    loginForm.style.display = "flex";
    signupForm.style.display = "none";
  } else {
    loginForm.style.display = "none"; 
  }
  });
document.getElementById('signupButton').addEventListener('click', async () => {
    const messageContainer = document.getElementById('messageContainer2');
    const messageElement = document.createElement('div');
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    if (!name || !email || !password) {
        alert('請填寫完所有資料。');
        return; 
    }

    const signupData = {
        name: name,
        email: email,
        password: password
    };

    try {
        const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupData)
        });
        let data = await response.json();
        
        if (response.ok) {
            console.log('註冊成功');
            messageElement.textContent = '註冊成功';
            messageElement.classList.add('success');
        } else {
            console.error(data.message);
            console.log(`${messageElement}messageelement`)
            const errorMessage = data.message || '註冊失敗';
            messageElement.textContent = errorMessage;
            messageElement.classList.add('error');
        }
        messageContainer.innerHTML = '';
        messageContainer.appendChild(messageElement);
        messageContainer.style.display = 'block';
        console.log(`${messageContainer}messagecon`)
    } catch (error) {
        console.error('發生錯誤', error);
    }
});

//處理每次載入頁面 查看token
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const welcome = document.getElementById("welcome-title")
async function checkTokenValidity() {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const response = await fetch('/api/user/auth', {
          method: 'GET',
          headers: {
            'Authorization': token
          }
        });
        const responseData = await response.json(); 
        console.log("responsedata.data",responseData.data);
        if (responseData.data !== null) {
            document.getElementById('showLoginForm').style.display = 'none';
            document.getElementById('logout').style.display = 'block';
            console.log("成功登入");
            console.log(responseData.data);
            nameInput.value = responseData.data.name;
            emailInput.value = responseData.data.email;
            welcome.innerHTML = `您好，${responseData.data.name}，待預訂的行程如下：`;
        } else {
            console.log("token有問題或無效")
        }
      } catch (error) {
        console.error('發生錯誤', error);
      }
    }
  }
    //控制登入xx
  let iconClose = document.querySelector(".icon-close");
  iconClose.addEventListener('click', () => {
    loginForm.style.display = "none";
    signupForm.style.display = "none";
  });
    //控制註冊xx
  let iconClose2 = document.querySelector(".icon-close2");
  iconClose2.addEventListener('click', () => {
    loginForm.style.display = "none";
    signupForm.style.display = "none";
  });
  //登出後刪除token
  let logoutText = document.getElementById('logout');
  let loginText = document.getElementById('showLoginForm');
  logoutText.addEventListener('click', () => {
    // logoutText.style.display = 'none';
    // loginText.style.display = 'block';
    localStorage.removeItem('token');
    location.reload(true);
  });
  window.addEventListener('load', () => {
    checkTokenValidity();
  });

const loginButton = document.getElementById('showLoginForm');
function triggerButtonClick() {
    const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    loginButton.dispatchEvent(event);
}
document.getElementById('reservation-top').addEventListener('click', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        triggerButtonClick();
    } else {
        window.location.href = '/booking';
    }
});

// 處理get行程的fetch
const attractionImage = document.getElementById('booking-image');
const attractionName = document.querySelector('.reservation-maintitle');
const attractionDate = document.querySelector('.reservation-date');
const attractionTime = document.querySelector('.reservation-time');
const attractionFare = document.querySelector('.reservation-fare');
const attractionPlace = document.querySelector('.reservation-place');

let order={};
async function fetchAndDisplayBookings() {
    try {
        const response = await fetch('/api/booking', {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log("fetch到預定",data);
            if (data!==null) {
                attractionImage.src = data.data.attraction.image;
                attractionName.textContent = `台北一日遊 ： ${data.data.attraction.name}`;
                attractionDate.textContent = `${data.data.date}`;
                if(data.data.time==="morning"){
                    attractionTime.textContent = `早上9點到下午4點`;
                }else{
                    attractionTime.textContent = `下午2點到晚上9點`;
                };
                attractionFare.textContent = `新臺幣：${data.data.price}元`;
                attractionPlace.textContent = `${data.data.attraction.address}`;
                console.log(data.data.time,"data.data.time")
                order = {
                    price: data.data.price,
                    trip: {
                      attraction: {
                        id: data.data.attraction.id,
                        name: data.data.attraction.name,
                        address: data.data.attraction.address,
                        image: data.data.attraction.image,
                      },
                      date: data.data.date,
                      time: data.data.time,
                    },
                  };
                  console.log(order,",order在第一次fetch接受資料裡面")
                // 順便處理刪除按鈕
            
                const orderElement = document.getElementById('order-element');
                orderElement.setAttribute('data-price', order.price);
                orderElement.setAttribute('data-attraction-id', order.trip.attraction.id);
                orderElement.setAttribute('data-attraction-name', order.trip.attraction.name);
                orderElement.setAttribute('data-attraction-address', order.trip.attraction.address);
                orderElement.setAttribute('data-attraction-image', order.trip.attraction.image);
                orderElement.setAttribute('data-trip-date', order.trip.date);
                orderElement.setAttribute('data-trip-time', order.trip.time);

                console.log(orderElement,",orderelement建立")
                const deleteButton = document.querySelector(".icon-delete");
                deleteButton.addEventListener('click', () => {
                    deleteBooking(data.data.attraction.name);
                });
                }else{
                    const hideableElements = document.querySelector('.hideable-elements');
                    hideableElements.style.display = 'none';
                    console.error('沒行程');
                    const parentContainer = document.querySelector('.container-title'); 
                    const newDiv = document.createElement('div');
                    newDiv.classList.add('container-title-null'); 
                    newDiv.textContent = '目前沒有任何待預訂的行程';

                    parentContainer.appendChild(newDiv);
                };
        } else {
            const hideableElements = document.querySelector('.hideable-elements');
            hideableElements.style.display = 'none';
            console.error('沒行程');
            const parentContainer = document.querySelector('.container-title'); 
            const newDiv = document.createElement('div');
            newDiv.classList.add('container-title-null'); 
            newDiv.textContent = '目前沒有任何待預訂的行程';

            parentContainer.appendChild(newDiv);
            console.error('獲取預訂失敗');
        }
    } catch (error) {
        console.error('發生錯誤：', error);
    }
}


async function deleteBooking(name) {
    try {
        console.log("準備刪除name為",name);
        const response = await fetch('/api/booking', {
            method: 'DELETE',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }), 
        });

        if (response.ok) {
            fetchAndDisplayBookings();
        } else {
            console.error('刪除失敗');
        }
    } catch (error) {
        console.error('發生錯誤：', error);
    }
}

window.addEventListener('load', () => {
    checkUserLoggedIn(); 
    fetchAndDisplayBookings();
});
let contact ={};
const cardNumber = document.getElementById("card-number");
const cardExpiration = document.getElementById("card-expiration-date");
const cardCCV = document.getElementById("card-ccv");
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const phoneNumberField = document.getElementById("phoneNumber");

const payButton = document.querySelector(".paybutton");
TPDirect.setupSDK("137122", "app_U0LAC72mswo8odCgupXJXPEds7Xohq4JbwjPjjT1ySLdEEdCnt7oSbKU2t2c", 'sandbox');
let fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'CCV'
    },
}
TPDirect.card.setup({
    // Display ccv field
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            'color': 'gray',
        },
        // Styling ccv field
        'input.ccv': {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
    }
})
TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        // submitButton.removeAttribute('disabled')
    } else {
        // Disable submit Button to get prime.
        // submitButton.setAttribute('disabled', true)
    }

    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
    if (update.cardType === 'visa') {
        // Handle card type visa.
    }

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.expiry === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.ccv === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.ccv === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }
})
// let prime;
console.log(order,"order");
payButton.addEventListener("click", () => {
    const cardNumberValue = cardNumber.value;
    const cardExpirationValue = cardExpiration.value;
    const cardCCVValue = cardCCV.value;
    const nameValue = nameField.value;
    const emailValue = emailField.value;
    const phoneNumberValue = phoneNumberField.value;
    const contact={
        'name':nameValue,
        'email':emailValue,
        'phone':phoneNumberValue,
    }
    // TPDirect.card.setup(cardNumber);
    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();

    // 確認是否可以 getPrime
    // console.log(tappayStatus);
    if (tappayStatus.canGetPrime === false) {
        alert('can not get prime');
        return;
    }
    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            // console.log("失敗status",result.status)
            alert('get prime error ' + result.msg);
            return;
        }
        const prime = result.card.prime;
        
        const orderElement = document.getElementById('order-element');
        const order = {
            price: orderElement.getAttribute('data-price'),
            trip: {
                attraction: {
                    id: orderElement.getAttribute('data-attraction-id'),
                    name: orderElement.getAttribute('data-attraction-name'),
                    address: orderElement.getAttribute('data-attraction-address'),
                    image: orderElement.getAttribute('data-attraction-image'),
                },
                date: orderElement.getAttribute('data-trip-date'),
                time: orderElement.getAttribute('data-trip-time'),
            },
            contact: contact,
        };
        console.log(`${prime},${order},${contact}`);

        const requestData = {
            prime: prime,
            order: order,
        };
    

        fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': localStorage.getItem('token'),
            },
            body: JSON.stringify(requestData),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                alert("付款失敗：" + data.message);
            } else {
                alert("付款成功，訂單號碼" + data.data.number + "；導引您至編號頁面！");
                if (data.data.number) {
                    const orderNumber = data.data.number;
                    const thankyouUrl = `/thankyou?number=${orderNumber}`;
                    window.location.href = thankyouUrl;
                }
            }
        })
        .catch((error) => {
            console.error("請求失敗：" + error);
            alert("請求失敗：");
        });
        console.log('get prime 成功，prime: ' + result.card.prime);
         // send prime to your server, to pay with Pay by Prime API .
        // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    });
    
    });