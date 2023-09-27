
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
                console.log("進入頁面整理");
                attractionImage.src = data.data.attraction.image;
                attractionName.textContent = `台北一日遊 ： ${data.data.attraction.name}`;
                attractionDate.textContent = `${data.data.date}`;
                if(data.time==="morning"){
                    attractionTime.textContent = `早上9點到下午4點`;
                }else{
                    attractionTime.textContent = `下午2點到晚上9點`;
                };
                attractionFare.textContent = `新臺幣：${data.data.price}元`;
                attractionPlace.textContent = `${data.data.attraction.address}`;

                // 順便處理刪除按鈕
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
