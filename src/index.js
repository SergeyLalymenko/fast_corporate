import './index.scss';

const API_URL = 'https://veryfast.io/t/front_test_api.php';

const offersBox = document.getElementById('offers');
const downloadMarker = document.getElementById('download-marker');

async function fetchOffers() {
    try {
        const res = await fetch(API_URL);
        const { state, result: { elements: offers } } = await res.json();
        if (state !== 'ok') return;

        drawOffers(offers);
    } catch(err) {
        console.log(err);
    }
}

function drawOffers(offers = []) {
    const offersTemplate = offers.reduce((acc, offer) => acc + getOfferTemplate(offer), '');
    offersBox.innerHTML = offersTemplate;
}

function getOfferTemplate({
    amount,
    license_name,
    name_display,
    price_key,
    is_best,
    link
}) {
    console.log(is_best);
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
                <h5 class="offers__price">
                    <span>$${amount}</span>/per year
                </h5>
            </div>
            <h5 class="offers__description">
                <span>${name_display}</span>
                <br>
                ${license_name}
            </h5>
            <a class="offers__download" href="${link}" download>
                DOWNLOAD
            </a>
        </div>
    `;
}

function init() {
    fetchOffers();
}

init();
