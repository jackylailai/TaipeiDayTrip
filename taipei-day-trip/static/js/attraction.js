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
// function displayAttractionInfo(data){
//     const imageContainer = document.getElementsByClassName('image-container');
//     const tourment = document.getElementsByClassName('tourment');
//     const description = document.getElementsByClassName('description');
//     const address =document.getElementsByClassName('address');
//     const transportation=document.getElementsByClassName('transportation');
//     data.data.forEach(attraction => {
//         const divTitle = document.createElement('div');
//             divTitle = attraction.name;
//             divTitle.className = 'reservation-title';
//         const divSubtitle = document.createElement('div');
//         const divContent = document.createElement('p')
//             divContent = attraction.category+" at "+attraction.mrt;
//             divSubtitle.className = 'reservation-subtitle';
//             divSubtitle.appendChild(divContent);

//             tourment.appendChild(divTitle);
//             tourment.appendChild(divSubtitle);
        
//             description.innerHTML = attraction.description;
//             address.innerHTML = attraction.address;
//             transportation.innerHTML = attraction.transport;
//         const 

//         attraction.images.forEach(imageUrl => {
//             const img = document.createElement('img');
//             img.src = imageUrl;
//             img.className = 'image';
//             imageContainer.appendChild(img);
//     });
// });
// }
// let imagelist=[];
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

// function imageButton(){
// const leftButton = document.querySelector('.left-button');
// const rightButton = document.querySelector('.right-button');
// const imageContainer = document.querySelector('.image-container');
// let currentIndex = 0;
// console.log(`images:${this.images}}`);
// console.log(`imageContainer:${imageContainer}`);
// console.log(`${leftButton}:leftbutton${rightButton}:rightbutton`);
// updateDisplayedImage(currentIndex);
// leftButton.addEventListener('click', function () {
//     currentIndex = (currentIndex - 1 + imageContainer.children.length) % imageContainer.children.length;
//     updateDisplayedImage(currentIndex);//要做循環就要看餘數多少
    
// });

// rightButton.addEventListener('click', function () {
//     currentIndex = (currentIndex + 1) % imageContainer.children.length;
//     updateDisplayedImage(currentIndex);
// });

// function updateDisplayedImage(index) {
//     // const imageContainer = document.getElementsByClassName('image-container');
//     const images = document.getElementsByClassName('image')

//     for(let i=0; i<images.length ;i++){
//     console.log("進for")
//     const img_display = images[i]; 
//     if (i === index) {
//         console.log("index進update",index);
//         img_display.style.display = 'block';
//     } else {
//         img_display.style.display = 'none';
//     }
//     console.log(`Image ${i}:`, img_display);
//     };
//     }
// }


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

//按鈕跟小圓點一起處理
function imageButton() {
    const leftButton = document.querySelector('.left-button');
    const rightButton = document.querySelector('.right-button');
    const imageContainer = document.querySelector('.image-container');
    const imageDots = document.querySelectorAll('.image-dot');

    let currentIndex = 0;

    function updateDisplayedImage(index) {
        const images = document.querySelectorAll('.image');

        for (let i = 0; i < images.length; i++) {
            console.log("進for處理image",i)
            const img_display = images[i];
            if (i === index) {
                img_display.style.display = 'block';
                // imageDots[i].classList.add('active');
            } else {
                img_display.style.display = 'none';
                // imageDots[i].classList.remove('active');
            }
        }

        imageDots.forEach((dot, i) => {
            if (i === index) {
                console.log("進for處理dot",dot)
                dot.style.backgroundColor = "#000";
                // dot.classList.add('active');
            } else {
                dot.style.backgroundColor = "transparent";
                // dot.classList.remove('active');
            }
        });
        currentIndex = index;
    }

    leftButton.addEventListener('click', function () {
        currentIndex = (currentIndex - 1 + imageContainer.children.length) % imageContainer.children.length;
        updateDisplayedImage(currentIndex);
    });

    rightButton.addEventListener('click', function () {
        currentIndex = (currentIndex + 1) % imageContainer.children.length;
        updateDisplayedImage(currentIndex);
    });

    // 初始化第一個圖片和圖片原點的狀態
    updateDisplayedImage(currentIndex);
}

