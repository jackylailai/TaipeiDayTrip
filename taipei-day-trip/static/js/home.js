console.log("成功引入home.js")
// 處理圖片邏輯
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
document.addEventListener("DOMContentLoaded",function(){
    let isLoading = false; 
    let nextPage = null; 

function loadAttractions() {

    if (isLoading) {
        return;
    }

    if (nextPage === null) {
        return;
    }
    
    isLoading = true;
    fetch(`/api/attractions?page=${nextPage}`)
        .then(response => response.json())
        .then(data => {
            nextPage = data.nextPage;

            const attractions = data.data;
            const attractionsList = document.getElementById("attractionsList");

            attractions.forEach(attraction => {
                const div = document.createElement('div');
                div.className = 'titlepic';

                const img = document.createElement('img');
                img.src = attraction.images[0];
                img.className = 'image';

                const overlay = document.createElement('div');
                overlay.className = 'overlay';
                overlay.textContent = attraction.name;

                const titleDiv = document.createElement('div');
                titleDiv.className = 'title';
                titleDiv.textContent = attraction.mrt;

                const category = document.createElement('p');
                category.textContent = attraction.category;

                titleDiv.appendChild(category);

                div.appendChild(img);
                div.appendChild(overlay);
                div.appendChild(titleDiv);

                attractionsList.appendChild(div);
            });

            isLoading = false;
        })
        .catch(error => {
            console.error("Error loading attractions:", error);

            isLoading = false;
        });
}

loadAttractions();

window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        loadAttractions(); 
    }
});

})
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