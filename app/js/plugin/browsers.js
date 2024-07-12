/* HTML
<picture class="loadImg">
    <source srcset="" data-srcset="assets/img/img.webp" type="image/webp">
    <source srcset="" data-srcset="assets/img/img.jpg" type="image/jpg">
    <img src="" data-src="assets/img/img.jpg" alt="*" width="" height="" />
</picture>
*/
/* CSS
&.tpx-img {
    .section-01 {
        background-image: url(...jpg);
    }
}
&.tpx-webp {
    .section-01 {
        background-image: url(...webp);
    }
}
*/

function support_format_webp() {
    var elem = document.createElement('canvas');

    if (!!(elem.getContext && elem.getContext('2d'))) {
        // was able or not to get WebP representation
        document.body.classList.add('tpx-webp');
    } else {
         // very old browser like IE 8, canvas not supported
        document.body.classList.add('tpx-img');
    }
}

support_format_webp();