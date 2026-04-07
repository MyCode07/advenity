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
            const value = selectedOption.value;
            console.log('Выбран:', value);
        });
    });
}