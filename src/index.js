import './index.scss';

const API_URL = 'https://veryfast.io/t/front_test_api.php';

const body = document.querySelector('body');
const offersBox = document.getElementById('offers');
const downloadMarker = document.getElementById('download-marker');
let isActiveMarker = false;

async function fetchOffers() {
    try {
        const res = await fetch(API_URL);
        const { state, result: { title, elements: offers } } = await res.json();
        console.log(offers);
        if (state !== 'ok') return;

        drawOffers(offers, title);
    } catch(err) {
        console.log(err);
    }
}

function drawOffers(offers = [], title = '') {
    const offersTemplate = offers.reduce((acc, offer) => acc + getOfferTemplate(offer, title), '');
    offersBox.innerHTML = offersTemplate;

    [...document.querySelectorAll('.downloadButton')].forEach((downloadButton) => {
        downloadButton.addEventListener('click', onFileLoad);
    });
}

function getOfferTemplate({
    amount,
    license_name,
    price_key,
    is_best,
    link
}, title) {
    const term = license_name.toLowerCase().includes('monthly') ? 'MO' : 'PER YEAR';
    const resultArray = price_key.match(/[0-9]?[0-9]%$/gi);
    const discount = resultArray ? resultArray[0] : null;
    const fullPrice = discount ? getFullPrice(amount, discount) : '';
    
    return `
        <div class="offers__item">
            <div class="offers__price-box">
                ${is_best ? `
                    <div class="offers__best-box">
                        <p class="offers__best-text small">
                            Best Value
                        </p>
                    </div>
                ` : ''}
                ${discount ? `
                    <div class="offers__discount-box">
                        <h4 class="offers__discount">
                            ${discount}<br>
                            <span>OFF</span>
                        </h4>
                    </div>
                ` : ''}
                <h5 class="offers__price">
                    <span>$${amount}</span>/${term}
                </h5>
                ${fullPrice ? `
                    <h6 class="offers__full-price">
                        ${fullPrice}
                    </h6>
                `: ''}
            </div>
            <h5 class="offers__description">
                <span>${title}</span>
                <br>
                ${license_name}
            </h5>
            <a class="offers__download downloadButton" href="${link}" download>
                DOWNLOAD
            </a>
        </div>
    `;
}

function getFullPrice(price, discount) {
    const discountNum = +discount.replace('%', '');

    return `$${price * (100 / discountNum)}`;
}

function onFileLoad() {
    if (isActiveMarker) return;

    isActiveMarker = true;
    setTimeout(() => {
        downloadMarker.classList.add('active');

        setTimeout(() => {
            isActiveMarker = false;
            downloadMarker.classList.remove('active');
        }, 5000);
    }, 1500);
}

function setMarkerPosition() {
    const browser = getBrowserName();
    const markerRightPosition = getMarkerRightPosition(browser);
    if (!markerRightPosition) return;

    const scrollWidth = window.innerWidth - body.scrollWidth;
    downloadMarker.style.right = `calc(${markerRightPosition} - ${scrollWidth}px)`;
}

function onResize() {
    setMarkerPosition();
}

function getBrowserName() {
    const { userAgent } = navigator;

    if (userAgent.includes('Firefox')) return 'firefox';
    if (userAgent.includes('SamsungBrowser')) return 'samsungInternet';
    if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'opera';
    if (userAgent.includes('Edge')) return 'edgeLegacy';
    if (userAgent.includes('Edg')) return 'edge';
    if (userAgent.includes('Chrome')) return 'chrome';
    if (userAgent.includes('Safari')) return 'safari';

    return '';
}

function getMarkerRightPosition(browser) {
    const data = {
        firefox: '5.2%',
        chrome: '3.8%',
        edge: '5.9%'
    };

    return data[browser] || '';
}

function init() {
    fetchOffers();
    setMarkerPosition();
}

init();

window.addEventListener('resize', onResize);
