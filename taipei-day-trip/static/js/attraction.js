console.log("enter attraction.js");

const taipeiTopButton = document.querySelector(".left-div")

taipeiTopButton.addEventListener('click', function() {
    window.location.href="/";
});
async function fetchData() {
    try {

      const currentUrl = window.location.href;
      const attractionId = currentUrl.split('/').pop();
      const apiUrl = `/api/attraction/${attractionId}`;
  
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  

      displayAttractionInfo(data);
      imageButton();

    } catch (error) {
      console.error('Error fetching attraction data:', error);
    }
  }

  document.addEventListener('DOMContentLoaded', async function () {
    await fetchData(); // 使用await調用async函式執行fetch
    
  });
//處理日期
// const dateInput = document.querySelector('input[type="date"]');
// console.log("抓到dateinput",dateInput)

// const dateIcon = document.querySelector('.calendar');
// console.log("抓icon",dateIcon);

// dateIcon.addEventListener('click', function() {
//     console.log("偵測點擊日期")
//     dateInput.click();
//     // dateInput.focus();
// });


function displayAttractionInfo(data) {
    const imageContainer = document.querySelector('.image-container');
    const tourment = document.querySelector('.tourment');
    const description = document.querySelector('.description');
    const address = document.querySelector('.address');
    const transportation = document.querySelector('.transportation');
    const reservationTitle= document.querySelector('.reservation-title');
    const reservationSubtitle = document.querySelector('.reservation-subtitle');

    const attraction = data.data;
  
    // const titleDiv = document.createElement('div');
    // titleDiv.className = 'reservation-title';
    reservationTitle.innerHTML = `<h2>${attraction.name}</h2>`;
  
    // const subtitleDiv = document.createElement('div');
    // subtitleDiv.className = 'reservation-subtitle';
    reservationSubtitle.innerHTML = `${attraction.category} at ${attraction.mrt}`;
  
    // tourment.appendChild(titleDiv);
    // tourment.appendChild(subtitleDiv);
  
    description.textContent = attraction.description;
    address.textContent = attraction.address;
    transportation.textContent = attraction.transport;
  
    imageContainer.innerHTML = ''; 
  
    attraction.images.forEach((imageUrl, index) => {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.className = 'image';
      img.setAttribute('data-index', index);
      imageContainer.appendChild(img);
    //   console.log("imageContainer",imageContainer);
    //   console.log("img:",img);
    //   imagelist.push(img);
    });
  }


//處理user選擇時間
const morningBtn = document.getElementById("morning-btn");
const afternoonBtn = document.getElementById("afternoon-btn");
const fareText = document.querySelector(".fare");

morningBtn.addEventListener('click', function() {
morningBtn.style.backgroundColor = "#448899";
afternoonBtn.style.backgroundColor = "#FFFF";
fareText.textContent = "新台幣2000元";
});

afternoonBtn.addEventListener('click', function() {
afternoonBtn.style.backgroundColor = "#448899";
morningBtn.style.backgroundColor = "#FFFF";
fareText.textContent = "新台幣2500元";
});

// //按鈕跟小圓點一起處理
// function imageButton() {
//     const leftButton = document.querySelector('.left-button');
//     const rightButton = document.querySelector('.right-button');
//     const imageContainer = document.querySelector('.image-container');
//     const imageDots = document.querySelectorAll('.image-dot');

//     const circle = document.querySelector('.circle');
//     const circleA = circle.children;
//     console.log(`${circle}and${circleA}`)

//     let currentIndex = 0;

//     function updateDisplayedImage(index) {
//         const images = document.querySelectorAll('.image');

//         for (let i = 0; i < images.length; i++) {
//             const img_display = images[i];
//             if (i === index) {
//                 img_display.style.display = 'block';
//                 console.log(`${i}第幾張圖片`)
//                 // imageDots[i].classList.add('active');
//             } else {
//                 img_display.style.display = 'none';
//                 // imageDots[i].classList.remove('active');
//             }
//         }
//         for(let i =0;i<images.length;i++){
//             let aNode = document.createElement('a');

//             aNode.setAttribute('index',i);
//             circle.appendChild(aNode);
//         }
//         imageDots.forEach((dot, i) => {
//             if (i === index) {
//                 console.log("進for處理dot",dot)
//                 dot.style.backgroundColor = "#000";
//                 // dot.classList.add('active');
//             } else {
//                 dot.style.backgroundColor = "transparent";
//                 // dot.classList.remove('active');
//             }
//         });
//         function circlechange(currentIndex){
//             console.log("進入處理原點的func")
//             for(let i = 0;i <circleA.length;i++){
//                 console.log(`${i}：i的值`)
//                 circleA[i].className=''

//             }
//             circleA[currentIndex].className='hover';
//         }
//         circlechange(currentIndex);
//         currentIndex = index;
//     }

//     leftButton.addEventListener('click', function () {
//         currentIndex = (currentIndex - 1 + imageContainer.children.length) % imageContainer.children.length;
//         updateDisplayedImage(currentIndex);
//     });

//     rightButton.addEventListener('click', function () {
//         currentIndex = (currentIndex + 1) % imageContainer.children.length;
//         updateDisplayedImage(currentIndex);
//     });
//     // 初始化第一個圖片和圖片原點的狀態
//     updateDisplayedImage(currentIndex);
// }
function imageButton() {
    const leftButton = document.querySelector('.left-button');
    const rightButton = document.querySelector('.right-button');
    const imageContainer = document.querySelector('.image-container');
    const images = document.querySelectorAll('.image');
    const imageButton = document.querySelector('.image-dot');

    let currentIndex = 0;

    // 動態生成圖片原點（circlea）
    const circle = document.querySelector('.circle');
    console.log(`image length${images.length}`);
    for (let i = 0; i < images.length; i++) {
        const circleA = document.createElement('div');
        circleA.className = 'circle-a';
        circleA.setAttribute('index', i);
        circle.appendChild(circleA);
        console.log(circleA);
    }

    const circleAElements = document.querySelectorAll('.circle-a');

    function updateDisplayedImage(index) {
        console.log("進入funcdisplay circleAele為",circleAElements);
        for (let i = 0; i < images.length; i++) {
            const img_display = images[i];
            const circle_display = circleAElements[i];
            if (i === index) {
                console.log("進入回圈選圖")
                img_display.style.display = 'block';
                console.log(circleAElements[i]);
                console.log(`circleaelements${circleAElements[i]}image`);
                circle_display.style.backgroundColor = "#FFFF";
            } else {
                img_display.style.display = 'none';
                circleAElements[i].style.backgroundColor= "#000";
            }
        }

        currentIndex = index;
    }

    leftButton.addEventListener('click', function () {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateDisplayedImage(currentIndex);//看他餘幾就是第幾張 加數字上去只是為了能除
    });

    rightButton.addEventListener('click', function () {
        currentIndex = (currentIndex + 1) % images.length;
        updateDisplayedImage(currentIndex);
    });

    // 初始化第一張圖片和圖片原點的狀態
    updateDisplayedImage(currentIndex);
}



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
        } else {
            console.log("token有問題或無效")
        }
      } catch (error) {
        console.error('發生錯誤', error);
      }
    }
  }
  let iconClose = document.querySelector(".icon-close");
  iconClose.addEventListener('click', () => {
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
