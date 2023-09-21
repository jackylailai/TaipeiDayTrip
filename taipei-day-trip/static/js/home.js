console.log("成功引入home.js")
// 處理圖片邏輯
// 抓取瀏覽器視窗的寬度
const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
// 將寬度輸出到控制台
console.log('瀏覽器寬度：', windowWidth);

document.addEventListener("DOMContentLoaded", function () {
    const attractionList = document.getElementById('attraction-list');

    fetch('/api/attractions?page=0')
        .then(response => response.json())
        .then(data => {
            data.data.forEach(attraction => {
                const div = document.createElement('div');
                div.className = 'titlepic';

                const img = document.createElement('img');
                img.src = attraction.images[0];
                img.className = 'image';
                const hrefTag = document.createElement('a');
                hrefTag.setAttribute('href', `/attraction/${attraction.id}`);
                hrefTag.appendChild(img);

                const overlay = document.createElement('div');
                overlay.className = 'overlay';
                const name = document.createElement('p');
                name.textContent = attraction.name;

                const titleDiv = document.createElement('div');
                titleDiv.className = 'title';
                const mrt = document.createElement('p');
                mrt.textContent=attraction.mrt;

                const category = document.createElement('p');
                category.textContent = attraction.category;


                // 將所有元素添加到 div.titlepic 中
                titleDiv.appendChild(mrt);
                titleDiv.appendChild(category);
                overlay.appendChild(name);

                div.appendChild(hrefTag);
                div.appendChild(overlay);
                div.appendChild(titleDiv);

                // 將 div.titlepic 添加到景點列表中
                attractionList.appendChild(div);
            });
        })
        .catch(error => console.error('發生錯誤：', error));

});
// document.addEventListener("DOMContentLoaded",function(){

    //方法1:getgetBoundingClientRect()的做法


    const attractionList = document.getElementById('attraction-list');
    let page = 0; 
    let shouldFetchData = true;
    let isLoading = false;

    window.addEventListener('scroll', () => {
      const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
      const containerBottom = attractionList.getBoundingClientRect().bottom;
      const keyword = searchInput.value.trim();
    //   console.log("偵測到下拉此時keyword是",keyword);
      console.log("偵測到下拉此時shouldfetch是",shouldFetchData);
    //   console.log("偵測到下拉此時isloading是",isLoading);
    //   console.log("偵測到下拉此時page",page);
      if(keyword!==""){
        page=0;
        console.log(`成功下滑進入 且keyword="${keyword}`);
      }
      if (containerBottom <= window.innerHeight +5 && shouldFetchData && !isLoading) {
        isLoading = true; 
        console.log("進入判斷式 沒在loading 可以fetch 滾動大於")
        fetch(`/api/attractions?page=${page + 1}&keyword=${keyword}`)
          .then((response) => response.json())
          .then((data) => {
            let nextpage = data.nextPage;
            data.data.forEach(attraction => {
                const div = document.createElement('div');
                div.className = 'titlepic';
                //圖片部分網路上看到，也可研究function處理
                const img = document.createElement('img');
                img.src = attraction.images[0];
                img.className = 'image';
                const hrefTag = document.createElement('a');
                hrefTag.setAttribute('href', `/attraction/${attraction.id}`);
                hrefTag.appendChild(img);
                
                const overlay = document.createElement('div');
                overlay.className = 'overlay';
                const name = document.createElement('p');
                name.textContent = attraction.name;

                const titleDiv = document.createElement('div');
                titleDiv.className = 'title';
                const mrt = document.createElement('p');
                mrt.textContent=attraction.mrt;

                const category = document.createElement('p');
                category.textContent = attraction.category;


                // 將所有元素添加到 div.titlepic 中
                titleDiv.appendChild(mrt);
                titleDiv.appendChild(category);
                overlay.appendChild(name);

                div.appendChild(hrefTag);
                div.appendChild(overlay);
                div.appendChild(titleDiv);

                // 將 div.titlepic 添加到景點列表中
                attractionList.appendChild(div);
                console.log(`page: ${page}, shouldFetchData: ${shouldFetchData}`);
                
            });
            console.log("nextpage",nextpage);
            if (keyword==="" && nextpage !== null) { 
                page++;
                searchInput.value = "";
                shouldFetchData=true;
              } else if(nextpage !==null){
                shouldFetchData=true;
              } else {
                shouldFetchData = false; 
              }
              isLoading = false;
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }
    });
    


//方法2：intersection的做法





//搜尋之後跳轉（可以執行）

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector('.search-form input');
    const searchButton = document.getElementById('search-button');
    const attractionList = document.getElementById('attraction-list');
    let page = 0; 
    searchButton.addEventListener('click', () => {
      fetchAttractions();
    });
  
    document.querySelector('.search-form').addEventListener('submit', (e) => {
      e.preventDefault(); // 阻止頁面
      fetchAttractions();
    });
  
    function fetchAttractions() {
      const keyword = searchInput.value.trim();
  
      fetch(`/api/attractions?page=${page}&keyword=${keyword}`)
        .then((response) => response.json())
        .then((data) => {
          // 先清空
          attractionList.innerHTML = '';
          if (data.data.length === 0) {
            console.log("沒找到景點進來判斷式")
            alert('沒有找到任何景點。');
          } else {
            data.data.forEach(attraction => {
              const div = document.createElement('div');
              div.className = 'titlepic';
  
              const img = document.createElement('img');
              img.src = attraction.images[0];
              img.className = 'image';
              const hrefTag = document.createElement('a');
              hrefTag.setAttribute('href', `/attraction/${attraction.id}`);
              hrefTag.appendChild(img);

              const overlay = document.createElement('div');
              overlay.className = 'overlay';
              const name = document.createElement('p');
              name.textContent = attraction.name;
  
              const titleDiv = document.createElement('div');
              titleDiv.className = 'title';
              const mrt = document.createElement('p');
              mrt.textContent = attraction.mrt;
  
              const category = document.createElement('p');
              category.textContent = attraction.category;
  
              // 將所有元素添加到 div.titlepic 中
              titleDiv.appendChild(mrt);
              titleDiv.appendChild(category);
              overlay.appendChild(name);
  
              div.appendChild(hrefTag);
              div.appendChild(overlay);
              div.appendChild(titleDiv);
  
              // 將 div.titlepic 添加到景點列表中
              attractionList.appendChild(div);
              shouldFetchData=true;//**********************非常重要
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  });
  

// 處理list捷運站按鈕
const leftButton = document.querySelector('.left-button');
const rightButton = document.getElementById('right-button');
const stationList = document.querySelector('.list');
const stationListBar = document.querySelector('.list-bar');
const searchInput = document.querySelector('.search-form input');
const searchButton = document.getElementById('search-button');
let scrollDisance = calculateScrollDistance();
let currrentINdex=0;

function calculateScrollDistance(){
    let stationListWidth = stationList.scrollWidth;
    console.log("stationlistwidth:",stationListWidth)
    return stationListWidth * 2/3;
}
fetch('/api/mrts')
    .then(response => response.json())
    .then((data)=>{
        const mrtData = data.data;
        console.log('mrt資料',mrtData);
        mrtData.forEach((station)=>{
            const stationItem = document.createElement('div');
            stationItem.textContent = station;
                  // 添加點擊事件監聽器
        stationItem.addEventListener('click', () => {
        const clickedStation = station;
        // 填入捷運站名稱到搜尋框
        searchInput.value = clickedStation;
        searchButton.click();
      });
            stationList.appendChild(stationItem);
        })
    })
    .catch((error) => {
        // 處理錯誤
        console.error('發生錯誤：', error);
      });
      
window.addEventListener('resize',()=>{
    scrollDisance = calculateScrollDistance();
})
leftButton.addEventListener('click', function() {
    // let currentScroll = stationList.scrollLeft;//先抓住list最左邊的點
    // let movement = scrollDisance;
    // let targetScroll = currentScroll-movement;//剛開始最左邊-螢幕長度（list2/3）=等等要動的距離
    console.log("左邊按鈕被點擊")
    stationListBar.scrollLeft -=windowWidth * 2/3;
    // stationListBar.scrollTo({
    //     left:targetScroll,
    //     behavior:"smooth",
    // })
});

rightButton.addEventListener('click', function() {
    // let currentScroll = stationList.scrollLeft;//先抓住list最左邊的點
    // let movement = scrollDisance;
    // let targetScroll2 = movement;//剛開始最左邊+螢幕長度（list2/3）=等等要動的距離
    console.log("右邊按鈕被點擊")
    stationListBar.scrollLeft +=windowWidth * 2/3;
    // stationList.scrollBy
    // stationListBar.scrollTo({
    //     left: targetScroll2,
    //     behavior: "smooth",
    // });
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
