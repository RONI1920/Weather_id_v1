/* ================================================
   CuacaID — script.js (WEATHERAPI VERSION)
   ================================================ */

// 1. DAFTAR DI WEATHERAPI.COM, AMBIL KEY-NYA, PASTE DI SINI
const API_KEY = '873da99298a44334801160802262803';
const BASE_URL = 'https://api.weatherapi.com/v1/current.json';

const IBU_KOTA_MAP = {
    "11": "Banda Aceh",
    "12": "Medan",
    "13": "Padang",
    "31": "Jakarta",
    "32": "Bandung",
    "35": "Surabaya",
    "51": "Denpasar",
    "61": "Pontianak",
    "63": "Banjarmasin",
    "91": "Jayapura"
};

const DAFTAR_PROVINSI_PILIHAN = [
    { id: "11", name: "ACEH" },
    { id: "12", name: "SUMATERA UTARA" },
    { id: "13", name: "SUMATERA BARAT" },
    { id: "31", name: "DKI JAKARTA" },
    { id: "32", name: "JAWA BARAT" },
    { id: "35", name: "JAWA TIMUR" },
    { id: "51", name: "BALI" },
    { id: "61", name: "KALIMANTAN BARAT" },
    { id: "63", name: "KALIMANTAN SELATAN" },
    { id: "91", name: "PAPUA" }
];

// Ambil Elemen DOM
const selectProvinsi = document.getElementById('selectProvinsi');
const loadingProvinsi = document.getElementById('loadingProvinsi');
const loadingWeather = document.getElementById('loadingWeather');
const weatherCard = document.getElementById('weatherCard');
const errorMsg = document.getElementById('errorMsg');

let namaProvinsiDipilih = '';

// Inisialisasi Dropdown
initApp();

function initApp() {
    if (loadingProvinsi) loadingProvinsi.style.display = 'block';
    selectProvinsi.innerHTML = '<option value="">— Pilih Provinsi —</option>';
    DAFTAR_PROVINSI_PILIHAN.forEach(prov => {
        const option = document.createElement('option');
        option.value = prov.id;
        option.textContent = prov.name;
        selectProvinsi.appendChild(option);
    });
    if (loadingProvinsi) loadingProvinsi.style.display = 'none';
}

function onProvinsiChange() {
    const idProvinsi = selectProvinsi.value;
    resetUI();

    if (!idProvinsi) return;

    namaProvinsiDipilih = selectProvinsi.options[selectProvinsi.selectedIndex].text;
    const namaKotaBesar = IBU_KOTA_MAP[idProvinsi];

    if (namaKotaBesar) {
        fetchCuaca(namaKotaBesar);
    }
}

async function fetchCuaca(namaKota) {
    if (loadingWeather) loadingWeather.style.display = 'block';

    try {
        // Query ke WeatherAPI (Pake parameter lang=id biar deskripsinya Bahasa Indonesia)
        const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(namaKota)}&lang=id`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Gagal mengambil data. Cek API Key lo.");

        const data = await response.json();
        renderCuaca(data);
    } catch (err) {
        showError(`❌ ${err.message}`);
    } finally {
        if (loadingWeather) loadingWeather.style.display = 'none';
    }
}

function renderCuaca(data) {
    // WeatherAPI punya struktur: data.location dan data.current
    document.getElementById('wcKota').textContent = data.location.name;
    document.getElementById('wcProvinsi').textContent = `📍 ${namaProvinsiDipilih}`;

    // Icon cuaca dari API (depannya perlu ditambah https:)
    const iconUrl = "https:" + data.current.condition.icon;
    document.getElementById('wcEmoji').innerHTML = `<img src="${iconUrl}" width="64">`;

    document.getElementById('wcTemp').textContent = Math.round(data.current.temp_c);
    document.getElementById('wcDesc').textContent = data.current.condition.text;

    // WeatherAPI current tidak kasih Max/Min secara default di endpoint 'current'
    // Kita isi dengan 'feels like' atau data lain yang tersedia
    document.getElementById('wcMax').textContent = "-";
    document.getElementById('wcMin').textContent = "-";
    document.getElementById('wcFeels').textContent = Math.round(data.current.feelslike_c);

    document.getElementById('wcHumidity').textContent = `${data.current.humidity}%`;
    document.getElementById('wcWind').textContent = Math.round(data.current.wind_kph);
    document.getElementById('wcVis').textContent = `${data.current.vis_km} km`;
    document.getElementById('wcCloud').textContent = `${data.current.cloud}%`;

    const now = new Date();
    document.getElementById('wcTime').textContent =
        `🕐 ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

    if (weatherCard) weatherCard.style.display = 'block';
}

function showError(msg) {
    if (errorMsg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
    }
}

function resetUI() {
    if (weatherCard) weatherCard.style.display = 'none';
    if (errorMsg) errorMsg.style.display = 'none';
}


footer {
  margin-top: 40px;
  padding: 30px 20px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8; /* Warna abu-abu soft */
  font-size: 0.9rem;
}

footer a {
  color: #38bdf8; /* Warna biru muda yang kontras */
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

footer a:hover {
  color: #7dd3fc;
  text-decoration: underline;
}

.footer-content p {
  margin: 5px 0;
}

.footer-links {
  margin-top: 10px;
  font-size: 0.8rem;
  opacity: 0.8;
}
