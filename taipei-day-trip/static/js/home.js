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

// 获取所需的DOM元素
// const attractionList = document.getElementById('attraction-list');

// let page = 0;
// let shouldFetchData = true;
// let isLoading = false;

// // 创建IntersectionObserver选项
// const options = {
//   root: null, // 使用viewport作为根元素
//   rootMargin: '0px',
//   threshold: 0.1, // 当目标元素10%进入视口时触发回调
// };

// // 创建一个函数来处理加载更多数据
// function loadMoreData() {
//   if (shouldFetchData && !isLoading) {
//     isLoading = true;
//     console.log('触发下拉');
//     let keyword = searchInput.value.trim();
//     console.log("let keyword的時候keyword",keyword);
//     fetch(`/api/attractions?page=${page + 1}&keyword=${keyword}`)
//       .then((response) => response.json())
//       .then((data) => {
//         let nextpage = data.nextPage;
//         data.data.forEach((attraction) => {
//           const div = document.createElement('div');
//           div.className = 'titlepic';

//           // 创建和添加其他元素的逻辑...
//           const img = document.createElement('img');
//           img.src = attraction.images[0];
//           img.className = 'image';

//           const overlay = document.createElement('div');
//           overlay.className = 'overlay';
//           const name = document.createElement('p');
//           name.textContent = attraction.name;

//           const titleDiv = document.createElement('div');
//           titleDiv.className = 'title';
//           const mrt = document.createElement('p');
//           mrt.textContent = attraction.mrt;

//           const category = document.createElement('p');
//           category.textContent = attraction.category;

//           titleDiv.appendChild(mrt);
//           titleDiv.appendChild(category);
//           overlay.appendChild(name);

//           div.appendChild(img);
//           div.appendChild(overlay);
//           div.appendChild(titleDiv);

//           attractionList.appendChild(div);
//         });

//         console.log('nextpage186', nextpage);
//         console.log("keyword187",keyword);
//         if (keyword === "" && nextpage !== null) {
//           console.log("page:即將執行++",page)
//           page++;
//           isLoading = false;
//           // 继续加载更多数据
//           loadMoreData();
//           console.log("執行函數should 194",shouldFetchData);
//           console.log("執行函數isloa",isLoading);
//         } else {
//           shouldFetchData = false;
//         }
//         isLoading = false;
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//       });
//   }
// }

// // 创建IntersectionObserver实例
// const intersectionObserver = new IntersectionObserver((entries) => {
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       // 触发加载更多数据
//       console.log("確認有沒有偵測到list變化");
//       loadMoreData();
//     }
//   });
// }, options);

// // 开始观察attractionList元素
// intersectionObserver.observe(attractionList);




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
// rightButton.addEventListener('click', () => {
//     stationList.scrollLeft += 50; // Adjust the scroll amount as needed
// });
// rightbutton.onclick = () => {
//     console.log("右邊按鈕被點擊")
//     stationList.scrollLeft += 20;
//   };

       


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