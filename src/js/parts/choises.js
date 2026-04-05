import Choices from "choices.js";

const choices = document.querySelectorAll('.variations_form select');
if (choices.length) {
    choices.forEach(element => {
        new Choices(element, {
            searchEnabled: false,
            itemSelectText: false
        });

        element.addEventListener('change', function (e) {
            const selectedOption = this.options[this.selectedIndex];
            const url = selectedOption.value;
            console.log('Выбрана ссылка:', url);
            if (url) {
                // window.location.href = url; // для перехода
            }
        });
    });
}