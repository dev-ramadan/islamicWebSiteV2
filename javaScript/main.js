$(document).ready(function () {
  window.fristScroll = () => {
    window.scrollTo(0, 550);
  }
  const opt = document.querySelector("#surah-list");
  const karae = document.querySelector("#reciter-list");
  const serchName = document.querySelector(".name");
  const inputSerch = document.querySelector(".input-serch");
  if (localStorage.getItem("thems") !== null) {
    $(".them").css('background-color', JSON.parse(localStorage.getItem("thems")));
    $("#navHome").css('background-color', JSON.parse(localStorage.getItem("thems")));
    $("footer").css('background-color', JSON.parse(localStorage.getItem("thems")));
    $(".arrow i").css('color', JSON.parse(localStorage.getItem("thems")));
    $(".quicGoin").css('border-color', JSON.parse(localStorage.getItem("thems")));
    $(".quicGoin").css('color', JSON.parse(localStorage.getItem("thems")));
    $(".serch-name").css('border-color', JSON.parse(localStorage.getItem("thems")));
    $(".all-reciters span").css('background-color', JSON.parse(localStorage.getItem("thems")));
  }
  $(window).scroll(function () {
    const audioPlayer = document.querySelector("#audio");
    if (window.scrollY > 450) {
      audioPlayer.classList.remove("player");
    } else {
      audioPlayer.classList.add("player");
    }
  });
  // استدعاء القراء
  (async function getReciter() {
    const reciters = await fetch(`https://alquran.vip/APIs/reciters`);
    const reciterArray = await reciters.json();
    const result = reciterArray.reciters;
    const pestReciters = result.splice(250);
    pestReciters.map(pestReciter => {
      const div = document.createElement("div");
      div.classList.add("serch-name");
      div.setAttribute("data-bs-toggle", "modal");
      div.setAttribute("data-bs-target", "#exampleModal");
      div.addEventListener("click", () =>
        suraByKare(pestReciter.reciter_name, pestReciter.reciter_id)
      );
      div.textContent += pestReciter.reciter_name;
      serchName.appendChild(div);
    });
    result.map((reciter) => {
      const option = document.createElement("option");
      option.textContent = reciter.reciter_name;
      option.value = reciter.reciter_id;
      karae.appendChild(option);
    });
    karae.addEventListener("change", (e) => {
      getSura(e.target.value);
    });
  })();

  window.bestReciter = async function () {
    const reciters = await fetch(`https://alquran.vip/APIs/reciters`);
    const reciterArray = await reciters.json();
    const result = reciterArray.reciters;
    const pestReciters = result.splice(250);
    serchName.innerHTML = ``
    pestReciters.map(pestReciter => {
      const div = document.createElement("div");
      div.classList.add("serch-name");
      div.setAttribute("data-bs-toggle", "modal");
      div.setAttribute("data-bs-target", "#exampleModal");
      div.addEventListener("click", () =>
        suraByKare(pestReciter.reciter_name, pestReciter.reciter_id)
      );
      div.textContent += pestReciter.reciter_name;
      serchName.appendChild(div);
    })
  }

  window.allReciter = async function () {
    $(".spinner").css("display","flex",()=>{
      $(".spinner").fadeIn(200)
  })
    try{
      const reciters = await fetch(`https://alquran.vip/APIs/reciters`);
      const reciterArray = await reciters.json();
      const result = reciterArray.reciters;
      serchName.innerHTML = ``
      result.map(pestReciter => {
        const div = document.createElement("div");
        div.classList.add("serch-name");
        div.setAttribute("data-bs-toggle", "modal");
        div.setAttribute("data-bs-target", "#exampleModal");
        div.addEventListener("click", () =>
          suraByKare(pestReciter.reciter_name, pestReciter.reciter_id)
        );
        div.textContent += pestReciter.reciter_name;
        serchName.appendChild(div);
      })
    }catch(error){
      console.log(error)
    }finally{
      $(".spinner").fadeOut(500, function () {
        $("body").css("overflow", "auto")
      });
    }
  }
  // استدعاء السور مع الصوت
  async function getSura(id) {
    opt.innerHTML = '<option value="">جارٍ تحميل السور...</option>'; // رسالة مؤقتة
    try {
      // تحميل أسماء السور
      const surahNameResponse = await fetch(`https://alquran.vip/APIs/reciterAudio?reciter_id=${id}`);
      const surahNameData = await surahNameResponse.json();
      const surahName = surahNameData.audio_urls; // قائمة السور
      opt.innerHTML = '<option value="">اختر السورة</option>';
      // إضافة التلاوات إلى القائمة
      surahName.map((recitation) => {
        let option = document.createElement("option");
        option.value = recitation.audio_url; // وضع رابط الصوت
        option.textContent = `${recitation.surah_id} - ${recitation.surah_name_ar}`;
        opt.appendChild(option);
      });
      console.log(" تم تحميل السور بنجاح!");
    } catch (error) {
      console.error("خطأ أثناء تحميل السور:", error);
    }
    opt.addEventListener("change", (e) => play(e.target.value));
  }
  $('#radioButton').click((e) => audio.src = e.target.getAttribute("data-url"))
  async function play(e) {
    const playAudio = document.querySelector(".fa-circle-play");
    playAudio.addEventListener("click", () => {
      const audio = document.querySelector("#audio");
      audio.src = "";
      audio.src = e;
      audio.type = "audio/ogg";
    });
  }
  // البحث عن القارئ
  window.serch = async function (reciter) {
    const reciters = await fetch(`https://alquran.vip/APIs/reciters`);
    const reciterArray = await reciters.json();
    const result = reciterArray.reciters;
    serchName.innerHTML = "";
    function normalizeArabic(text) {
      return text.replace(/أ/g, "ا").replace(/إ/g, "ا").replace(/آ/g, "ا");
    }
    result.forEach((reciters) => {
      if (normalizeArabic(reciters.reciter_name).includes(normalizeArabic(reciter))) {
        const reciterDiv = document.createElement("div");
        reciterDiv.setAttribute("data-bs-toggle", "modal");
        reciterDiv.setAttribute("data-bs-target", "#exampleModal");
        reciterDiv.classList.add("serch-name");
        reciterDiv.innerHTML = `<p class="">${reciters.reciter_name}</p>`;
        const reciterName = reciterDiv.querySelector("p").textContent;
        reciterDiv.addEventListener("click", () =>
          suraByKare(reciterName, reciters.reciter_id)
        );
        serchName.appendChild(reciterDiv);
      }
    });
  }
  const suraByKare = (name, id) => {
    getSura(id);
    karae.innerHTML = `<option>${name}</option>`;
  };
  serchName.addEventListener("click", () => inputSerch.focus());
  // ادعية
  (async function fetchHadiths() {
    $(".spinner .loader").fadeIn(200)
    try {
      const res = await fetch("https://api.allorigins.win/raw?url=https://alquran.vip/APIs/duas");
      const request = await res.json();
      const duas = (request.prophetic_duas);
      const sliderContainer = document.getElementById("hadithSlider");
      duas.filter((hadith) => hadith.hadithArabic && hadith.hadithArabic.length < 400);
      duas.map((hadith) => {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.innerHTML = `<h5>${hadith.text}</h5>`;
        sliderContainer.appendChild(slide);
      });
      new Swiper(".swiper-container", {
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    }
    catch (error) {
      console.log(error)
    }
    finally {
      $(".spinner").fadeOut(500, function () {
        $("body").css("overflow", "auto")
      });
    }
  })();

  // anmation
  $(".website").animate({ width: "100%" }, 1000);
  $(".website").animate({ height: "100vh" }, 1000, function () {
    $(".background .arrow").slideDown(1000)
    $(".website #nav").fadeIn(1000);
    $(".website #navHome").fadeIn(1000);
    $("#radioButton").fadeIn(1000);
    $(".box").css("display", 'flex')
  });
  $(window).scroll(function () {
    if (window.scrollY > 500) {
      $(".website #nav").fadeOut(1000);
    } else {
      $(".website #nav").fadeIn(1000);
    }
  });
});
// them action
$(".fa-gear").click(() => {
  let x = $(".colors").outerWidth();
  if ($(".box").css("left") === '0px') {
    $(".box").animate({ left: `-${x}` }, 1000)
  } else {
    $(".box").animate({ left: `0px` }, 1000)
  }
});
let spans = $(".colors span");
for (let i = 0; i < spans.length; i++) {
  let dataColor = spans[i].getAttribute("data-color");
  spans[i].style.backgroundColor = dataColor
};
$(spans).click((e) => {
  let thems = $(e.target).css('background-color');
  $(".them").css('background-color', thems);
  $("#navHome").css('background-color', thems);
  $("footer").css('background-color', thems);
  $(".arrow i").css('color', thems);
  $(".quicGoin").css('border-color', thems);
  $(".quicGoin").css('color', thems);
  $(".serch-name").css('border-color', thems);
  $(".all-reciters span").css('background-color', thems);
  localStorage.setItem('thems', JSON.stringify(thems));
})
