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

                div.appendChild(img);
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
        
      if (containerBottom <= window.innerHeight + 10 && shouldFetchData && !isLoading) {
        isLoading = true; 

        fetch(`/api/attractions?page=${page + 1}`)
          .then((response) => response.json())
          .then((data) => {
            data.data.forEach(attraction => {
                const div = document.createElement('div');
                div.className = 'titlepic';

                const img = document.createElement('img');
                img.src = attraction.images[0];
                img.className = 'image';

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

                div.appendChild(img);
                div.appendChild(overlay);
                div.appendChild(titleDiv);

                // 將 div.titlepic 添加到景點列表中
                attractionList.appendChild(div);
                console.log(`page: ${page}, shouldFetchData: ${shouldFetchData}`);
            });
            if (page < 4) { 
                page++;
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



    // const footer = document.getElementById('footer-id');

    // let page = 0; 
    // //需創建intersectionobserver實例
    // const observer = new IntersectionObserver((entries) => {
    // //footer進入觸發
    //   if (entries[0].isIntersecting) {
    //     const attractionList = document.getElementById('attraction-list');
    //     console.log("進入Footer");
    //     fetch(`/api/attractions?page=${page + 1}`)
    //       .then((response) => response.json())
    //       .then((data) => {
           
    //         data.data.forEach(attraction => {
    //             const div = document.createElement('div');
    //             div.className = 'titlepic';

    //             const img = document.createElement('img');
    //             img.src = attraction.images[0];
    //             img.className = 'image';

    //             const overlay = document.createElement('div');
    //             overlay.className = 'overlay';
    //             const name = document.createElement('p');
    //             name.textContent = attraction.name;

    //             const titleDiv = document.createElement('div');
    //             titleDiv.className = 'title';
    //             const mrt = document.createElement('p');
    //             mrt.textContent=attraction.mrt;

    //             const category = document.createElement('p');
    //             category.textContent = attraction.category;


    //             // 將所有元素添加到 div.titlepic 中
    //             titleDiv.appendChild(mrt);
    //             titleDiv.appendChild(category);
    //             overlay.appendChild(name);

    //             div.appendChild(img);
    //             div.appendChild(overlay);
    //             div.appendChild(titleDiv);

    //             attractionList.appendChild(div);
    //       })
    //     })
    //       .catch((error) => {
    //         console.error('Error fetching data:', error);
    //       });
    //   }
    // });

    // observer.observe(footer);
    

//方法3 暫時用來處理下拉還在研究其他的    

//     let isLoading = false; 
//     let nextPage = null; 

// function loadAttractions() {

//     if (isLoading) {
//         return;
//     }

//     if (nextPage === null) {
//         return;
//     }
    
//     isLoading = true;
//     fetch(`/api/attractions?page=${nextPage}`)
//         .then(response => response.json())
//         .then(data => {
//             nextPage = data.nextPage;

//             const attractions = data.data;
//             const attractionsList = document.getElementById("attractionsList");

//             attractions.forEach(attraction => {
//                 const div = document.createElement('div');
//                 div.className = 'titlepic';

//                 const img = document.createElement('img');
//                 img.src = attraction.images[0];
//                 img.className = 'image';

//                 const overlay = document.createElement('div');
//                 overlay.className = 'overlay';
//                 overlay.textContent = attraction.name;

//                 const titleDiv = document.createElement('div');
//                 titleDiv.className = 'title';
//                 titleDiv.textContent = attraction.mrt;

//                 const category = document.createElement('p');
//                 category.textContent = attraction.category;

//                 titleDiv.appendChild(category);

//                 div.appendChild(img);
//                 div.appendChild(overlay);
//                 div.appendChild(titleDiv);

//                 attractionsList.appendChild(div);
//             });

//             isLoading = false;
//         })
//         .catch(error => {
//             console.error("Error loading attractions:", error);

//             isLoading = false;
//         });
// }

// loadAttractions();

// window.addEventListener("scroll", () => {
//     if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
//         loadAttractions(); 
//     }
// });

// });


//搜尋之後跳轉（可以執行）
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector('.search-form input');
    const searchButton = document.getElementById('search-button');
    const attractionList = document.getElementById('attraction-list');
let page = 0; 

searchButton.addEventListener('click', () => {
  const keyword = searchInput.value.trim();

  fetch(`/api/attractions?page=${page}&keyword=${keyword}`)
    .then((response) => response.json())
    .then((data) => {
    //   先清空
      attractionList.innerHTML = '';
      if (data.results.length === 0) {
        attractionList.textContent = '沒有找到任何景點。';
      } else {
      data.data.forEach(attraction => {
        const div = document.createElement('div');
        div.className = 'titlepic';

        const img = document.createElement('img');
        img.src = attraction.images[0];
        img.className = 'image';

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

        div.appendChild(img);
        div.appendChild(overlay);
        div.appendChild(titleDiv);

        // 將 div.titlepic 添加到景點列表中
        attractionList.appendChild(div);
      });
    }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
});
});

// 處理list捷運站按鈕
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');
const stationList = document.querySelector('.list');
const stationListBar = document.querySelector('.list-bar');
const searchInput = document.querySelector('.search-form input');
const searchButton = document.getElementById('search-button');
let currrentINdex=0;
fetch('/api/mrts')
    .then(response => response.json())
    .then((data)=>{
        const mrtData = data.data;
        console.log('mrt資料',mrtData);
        mrtData.forEach((station)=>{
            const stationItem = document.createElement('span');
            stationItem.textContent = station;
                  // 添加點擊事件監聽器
      stationItem.addEventListener('click', () => {
        const clickedStation = station;
        // 填入捷運站名稱到搜尋框
        searchInput.value = clickedStation;
        searchButton.click();
        // // 調用旅遊景點 API 並使用捷運站名稱進行搜尋
        // fetch(`/api/attractions?page=0&keyword=${keyword}`)
        //   .then(response => response.json())
        //   .then((attractionData) => {
        //     // 在這裡處理旅遊景點資料，例如顯示結果
        //     console.log('搜尋結果：', attractionData);
        //   })
        //   .catch((error) => {
        //     // 處理錯誤
        //     console.error('搜尋景點時發生錯誤：', error);
        //   });
      });
            stationList.appendChild(stationItem);
        })
    })
    .catch((error) => {
        // 處理錯誤
        console.error('發生錯誤：', error);
      });
    
leftButton.addEventListener('click', function() {
    stationListBar.scrollTo({
        left:-500,
        behavior:"smooth",
    })
});

rightButton.addEventListener('click', function() {
    stationListBar.scrollTo({
        left:windowWidth/2+windowWidth/3,
        behavior:"smooth",
    })
});

       


//處理捷運站12站的按鈕

// document.addEventListener("DOMContentLoaded", function () {
//     // 處理list捷運站按鈕
//         const leftButton = document.querySelector('.left-button');
//         const rightButton = document.querySelector('.right-button');
//         const stationList = document.querySelector('.list');
//         let currrentINdex=0;

//         leftButton.addEventListener('click', function() {
//             if (currentIndex > 0) {
//             currentIndex--;
//             updateStationList();
//             }
//         });
        
//         rightButton.addEventListener('click', function() {
//             if (currentIndex < stations.length - 1) {
//             currentIndex++;
//             updateStationList();
//             }
//         });
//     fetch('/api/mrts')
//         .then(response => response.json())
//         .then(data => {
//             const stations = data.data.map(mrt=>mrt.name);
//             //有空來研究下面
//             function updateStationList() {
//                 let html = '';
//                 const stationsToShow = getStationsToShow();
    
//                 for (let i = currentIndex; i < currentIndex + stationsToShow; i++) {
//                     if (stations[i]) {
//                         html += `<p class="station">${stations[i]}</p>`;
//                     }
//                 }
//                 stationList.innerHTML = html;
//             }
//             function getStationsToShow() {
//                 return window.innerWidth < 600 ? 4 : 12; // 手機寬度小於600px時顯示4個，否則顯示12個
//             }
//             updateStationList();
//             window.addEventListener('resize', function() {
//                 currentIndex = 0; // 重新設定 currentIndex
//                 updateStationList();
//             });
//         })
//         .catch(error => {
//             console.error('發生錯誤：', error);
//         });
       
// });